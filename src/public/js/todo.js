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

const UsernameHolder = document.getElementById("UsernameHolder");
const validateToken = async (username) => {
    const { token, error } = checkForToken();
    if (!error) {
        const dataReply =  await ServiceWorker({
            url: `/auth/verifyMe`,
            method: "POST",
            token,
            data: undefined,
        });
        if(dataReply.error){
            window.location.href = "../index.html";
        }else{
            username.innerHTML = dataReply.results.username;
        }
    }
}


const LogOut = document.getElementById("LogOut");
const HandleLogout = (component) =>{
    component.addEventListener("click" , event =>{
        localStorage.getItem("authkey") ? localStorage.removeItem("authkey") : null;
        sessionStorage.getItem("authkey") ? sessionStorage.removeItem("authkey") : null;
        window.location.href = "../index.html";
    });
}

window.onload = () =>{
    HandleLogout(LogOut);
    validateToken(UsernameHolder);
}