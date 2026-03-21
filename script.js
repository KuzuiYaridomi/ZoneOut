const options=document.querySelectorAll(".option");
let index=1;

function updateSelection(){
options.forEach(o=>o.classList.remove("active","selector"));
options[index].classList.add("active","selector");
}

/* KEYBOARD */

document.addEventListener("keydown",e=>{
if(e.key==="ArrowDown") index=(index+1)%options.length;
if(e.key==="ArrowUp") index=(index-1+options.length)%options.length;

if(e.key==="Enter"){
if(index===0) startLoading();
if(index===1) triggerLearn();
}

updateSelection();
});

/* MOUSE */

options.forEach((opt,i)=>{

opt.addEventListener("mouseenter",()=>{
index=i;
updateSelection();
});

opt.addEventListener("click",()=>{
if(i===0) startLoading();
if(i===1) triggerLearn();
});

});

/* RSVP */

function startLoading(){

const screen=document.getElementById("loadingScreen");
screen.classList.add("active");

let dots=0;
const text=document.getElementById("loadingText");

setInterval(()=>{
dots=(dots+1)%4;
text.innerText="Loading"+".".repeat(dots);
},400);

setTimeout(()=>{
window.location.href="https://forms.fillout.com/t/fuxhBdNbhdus";
},Math.random()*5000+3000);

}

/* GLITCH TRANSITION */

const glitch=document.getElementById("glitchOverlay");
const learnPage=document.getElementById("learnPage");

function triggerLearn(){

glitch.classList.add("active");

setTimeout(()=>{

learnPage.classList.add("active");
glitch.classList.remove("active");

},500);

}

/* BACK */

document.getElementById("backBtn").onclick=()=>{
learnPage.classList.remove("active");
};

/* FAQ */

document.querySelectorAll(".faq").forEach(faq=>{
faq.addEventListener("click",()=>{
faq.classList.toggle("open");
});
});

/* FIX LINK CLICK INSIDE FAQ */

document.querySelectorAll(".answer a").forEach(link=>{
link.addEventListener("click",(e)=>{
e.stopPropagation();
});
});

/* AUDIO FIX */

const audio=document.getElementById("bgAudio");
document.addEventListener("click",()=>audio.play().catch(()=>{}));

updateSelection();