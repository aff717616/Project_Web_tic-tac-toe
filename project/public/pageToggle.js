// alert('script.js can operative')
let signInPage = document.getElementById(`signIn-page`);
let signUpPage = document.getElementById(`signUp-page`);
let menuPage = document.getElementById(`menu-page`);
let gamepage = document.getElementById(`game-page`);
let scorepage = document.getElementById(`score-page`);
let togglescoreboard = 0;

function goToSignUpPage() {
    signInPage.style.display = `none`;
    signUpPage.style.display = `flex`;
    menuPage.style.display = `none`;
    gamepage.style.display = `none`;
    scorepage.style.display = `none`;
}

function goToSignInPage() {
    signInPage.style.display = `flex`;
    signUpPage.style.display = `none`;
    menuPage.style.display = `none`;
    gamepage.style.display = `none`;
    scorepage.style.display = `none`;   
    wantlogout()
    
}

function goToMenuPage() {
    signInPage.style.display = `none`;
    signUpPage.style.display = `none`;
    menuPage.style.display = `flex`;
    gamepage.style.display = `none`;
    scorepage.style.display = `none`;
    togglescoreboard = 0
}
function goToGamePage() {
    signInPage.style.display = `none`;
    signUpPage.style.display = `none`;
    menuPage.style.display = `none`;
    gamepage.style.display = `block`;
    scorepage.style.display = `none`;
}


let allway = 0;
function gotoScoreboard() {
    allway = 1
    if (togglescoreboard==1){
        goToMenuPage()
        
    }else{
        signInPage.style.display = `none`;
    signUpPage.style.display = `none`;
    menuPage.style.display = `none`;
    gamepage.style.display = `none`;
    scorepage.style.display = `flex`;
    togglescoreboard ++;
    }
}
if (allway = 1){
    calluserboard()
}
function wantlogout(){
    setTimeout(function(){
        if (document.querySelector('#user-profile-name').innerText !=''){
            goToMenuPage()
        }
    }, 1000)
   
}

goToSignInPage()