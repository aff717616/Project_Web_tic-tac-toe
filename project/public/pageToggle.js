// alert('script.js can operative')
let signInPage = document.getElementById(`signIn-page`);
let signUpPage = document.getElementById(`signUp-page`);
let menuPage = document.getElementById(`menu-page`);

function goToSignUpPage() {
    signInPage.style.display = `none`;
    signUpPage.style.display = `flex`;
    menuPage.style.display = `none`;
}

function goToSignInPage() {
    signInPage.style.display = `flex`;
    signUpPage.style.display = `none`;
    menuPage.style.display = `none`;
}

function goToMenuPage() {
    signInPage.style.display = `none`;
    signUpPage.style.display = `none`;
    menuPage.style.display = `flex`;
}