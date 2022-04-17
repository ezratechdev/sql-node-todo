const checkForToken = () => {
    console.log(localStorage.getItem("authkey"));
    console.log(sessionStorage.getItem("authkey"));
    const token = (localStorage.getItem("authkey")) ? localStorage.getItem("authkey") : sessionStorage.getItem("authkey") ? sessionStorage.getItem("authkey") : null;
    if (!token) return {
        token: null,
        error: true,
    };
    else return {
        token,
        error: false,
    };
    // localStorage.
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
        const {error , results} =  await ServiceWorker({
            url: `/auth/verifyMe`,
            method: "POST",
            token,
            data: undefined,
        });
        if(!error){
            console.log(results);
        }
        console.log(results);
    }
    console.log(token , error);
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
                if (!check) {
                    localStorage.setItem("authtoken",token);
                }else{
                    sessionStorage.setItem("authtoken",token);
                }
            } else console.log(results.message);

        }
    });
}

HandlingLogin();
window.onload = (event) => validateToken();