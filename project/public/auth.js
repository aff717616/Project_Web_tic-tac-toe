// const signupForm = document.querySelector("#signup-form");
const signupForm = document.querySelector("#signUp-form");
signupForm.addEventListener("submit", createUser);

const signupFeedback = document.querySelector("#feedback-msg-signup");
const signupModal = new bootstrap.Modal(document.querySelector("#signUp-page"));

function createUser(event) {

    event.preventDefault();
    const email = signupForm["input-email-signup"].value;
    const pwd = signupForm["input-password-signup"].value;
    firebase
        .auth()
        .createUserWithEmailAndPassword(email, pwd)
        .then(() => {
            signupFeedback.style = `color:green`;
            signupFeedback.innerText = `Sign completed`;
            setTimeout(function() {
                signupModal.hide();
            }, 1000);
            // oom add
            goToMenuPage()
                //end
        })
        .catch((error) => {
            signupFeedback.style = `color:crimson`;
            signupFeedback.innerText = `${error.message}`;
            signupForm.reset();
        });
}

const btnLogout = document.querySelector('#btnLogout');
btnLogout.addEventListener('click', () => {
    firebase.auth().signOut();
    console.log('logout complete');
    //oom add
    resetSignInput()
    goToSignInPage()
        //end
})

firebase.auth().onAuthStateChanged((user => {
    console.log('User: ', user);
    //getList(user);
    setupUI(user);
}))

const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', loginUser);

const loginFeedback = document.querySelector('#feedback-msg-login');
// const loginModal = new bootstrap.Modal(document.querySelector('#signin-page'));
const loginModal = new bootstrap.Modal(document.querySelector('#signIn-page'));

function loginUser(event) {
    event.preventDefault();
    const email = loginForm['input-email-login'].value;
    const pwd = loginForm['input-password-login'].value;

    firebase
        .auth()
        .signInWithEmailAndPassword(email, pwd)
        .then(() => {
            loginFeedback.style = `color:green`;
            loginFeedback.innerText = `Sign completed`;
            setTimeout(function() {
                loginModal.hide();
            }, 1000);
            // oom add
            goToMenuPage()
                //end
        })
        .catch((error) => {
            loginFeedback.style = `color:crimson`;
            loginFeedback.innerText = `${error.message}`;
            loginForm.reset();
        });

}
const btnCancel = document.querySelectorAll('.btn-cancel').forEach(btn => {
    btn.addEventListener('click', () => {
        resetSignInput()
    })
})

function resetSignInput() {
    signupForm.reset();
    signupFeedback.innerHTML = ``;
    loginForm.reset();
    loginFeedback.innerHTML = ``;
}