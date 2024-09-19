let startQuiz=document.getElementById("quiz-start");
let welcomePage=document.getElementById("welcome-container");
let QuestionPage=document.getElementById("quiz-container");

startQuiz.addEventListener('click',()=>{
welcomePage.style.display="none";
QuestionPage.style.display="flex";
});
