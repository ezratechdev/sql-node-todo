const checkForToken = () => {
    const token = (localStorage.getItem("authkey")) ? localStorage.getItem("authkey") : sessionStorage.getItem("authkey") ? sessionStorage.getItem("authkey") : null;
    if (!token) return {
        token: null,
        error: true,
    };
    else return {
        token,
        error: false,
    };
}


const ServiceWorker = async ({ url, method, token, data }) => {
    let returnMe = {
        error: true,
        results: null
    };
    await fetch(url, {
        method,
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': (token) ? `Bearer ${token}` : null,
        }),
        body: (data) ? JSON.stringify(data) : null,
    })
        .then(data => data.json())
        .then(result => {
            returnMe.error = false;
            returnMe.results = result;
        })
        .catch(error => {
            returnMe.error = true;
            returnMe.results = error;
            console.log(returnMe);
        })
    return returnMe;
}

const validateToken = async () => {
    const { token, error } = checkForToken();
    if (!error) {
        const dataReply =  await ServiceWorker({
            url: `/auth/verifyMe`,
            method: "POST",
            token,
            data: undefined,
        });
        if(!dataReply.error){
            window.location.href = "./html/todo.html";
        }
    }
}
const LoginForm = document.getElementById("LoginForm");
const HandlingLogin = () => {
    LoginForm.addEventListener("submit", async event => {
        event.preventDefault();
        const { LoginEmail, LoginPassword, CheckBox } = LoginForm;
        const email = LoginEmail.value;
        const password = LoginPassword.value;
        const check = CheckBox.checked;
        if (email && password) {
            const {error , results } = await ServiceWorker({
                url: `/auth/login`,
                method: 'POST',
                token: undefined,
                data: {
                    email,
                    password,
                }
            })
            if (!error && results.status == 200){
                const { message , token } = results;
                LoginForm.reset();
                if (!check) {
                    localStorage.setItem("authkey",token);
                }else{
                    sessionStorage.setItem("authkey",token);
                }
                setTimeout(() => window.location.href = "./html/todo.html" , 3000);
            } else console.log(results.message);

        }
    });
}

// handle signup
const SignupForm = document.getElementById("SignupForm");
const HandlingSignup = ()=>{
    SignupForm.addEventListener("submit" , async event =>{
        event.preventDefault();
        const { RegUsername , RegEmail , RegPassword , Regcpassword } = SignupForm;
        if(RegPassword.value === Regcpassword.value){
            const username = RegUsername.value
            const email = RegEmail.value;
            const password = RegPassword.value;
            const {error , results } = await ServiceWorker({
                url: `/auth/signup`,
                method: 'POST',
                token: undefined,
                data: {
                    email,
                    username,
                    password,
                }
            });
            if (!error && results.status == 200){
                const { message , token } = results;
                localStorage.setItem("authkey",token);
                SignupForm.reset();
                setTimeout(() => window.location.href = "./html/todo.html" , 3000);
            } else console.log(results.message);
        }
    });
}

window.onload = (event) => {
    HandlingLogin();
    HandlingSignup();
    validateToken();
}