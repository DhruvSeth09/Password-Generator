const inputSlider=document.querySelector("[data-length-slider]");
const lengthDisplay=document.querySelector("[data-length]");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copy-message]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numberCheck=document.querySelector("#number");
const symbolCheck=document.querySelector("#symbol");
const generateBtn=document.querySelector(".generate-button");
const indicator=document.querySelector("[data-indicator]");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");

let password="";
let passwordLength=10;
let checkCount=0;
let symbol="'!@#%^&*()_+-=[]{}|;':\",./<>?~`'"
handleSlider();
setIndicator("#ccc");
uppercaseCheck.checked=true;

// it replicates the passwordLength to the browser
function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min))+"% 100%"
}

function setIndicator(color){
    indicator.style.backgroundColor=color;
    // indicator.style.boxShadow=`0px 0px 12px 1px ${color}`
}

function getRandomInteger(min,max){
   return Math.floor(Math.random()*(max-min))+min;
}

function generateRandomNumber(){
    return getRandomInteger(0,9);
}

function generateLowerCase(){
   return String.fromCharCode(getRandomInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRandomInteger(65,91));
}

function generateSymbols(){
    return symbol.charAt(getRandomInteger(0,symbol.length-1));   
}

function calcStrength(){
    let upper=false;
    let lower=false;
    let number=false;
    let symbol=false;
    if(uppercaseCheck.checked) upper=true;
    if(lowercaseCheck.checked) lower=true;
    if(numberCheck.checked) number=true;
    if(symbolCheck.checked) symbol=true;
    if(uppercaseCheck.unchecked) upper=false;
    if(lowercaseCheck.unchecked) lower=false;
    if(numberCheck.unchecked) number=false;
    if(symbolCheck.unchecked) symbol=false;

    if(upper && lower && (number || symbol) && passwordLength>=0){
        setIndicator("##0f0");
      }  else if( (lower||upper)&&(number||symbol)&&passwordLength>=6){
        setIndicator("#ff0");
        }else{
            setIndicator("#f00");
        }
}

async function copyContent(){
    try{
        if(password == ""){
            alert('First Generate Password to copy');
            throw 'Failed'; 
        }
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerHTML="copied";
    }
   catch(e){
   copyMsg.innerText="error";
   }
   copyMsg.classList.add('active');

   setTimeout(()=>{
    copyMsg.classList.remove("active");
   },2000)
}

copyMsg.addEventListener("click", () => {
    // if (password) copyContent();
    copyContent();
});

inputSlider.addEventListener('input',(e)=>{
    passwordLength = e.target.value;
    handleSlider();
})

function handelCheckBoxCase(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        }
    });

    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change',handelCheckBoxCase);
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copyContent();
    }
})

generateBtn.addEventListener('click',()=>{
    // none of the checkbox are selected
    if(checkCount<=0) return ;

    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }

    // let's start to find the password

    // remove old password first
    password="";

    // lets put the stuff mentioned by checkboxes

    // if(uppercaseCheck.checked){
    //     password+=generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password+=generateLowerCase();
    // }
    // if(numberCheck.checked){
    //     password+=generateRandomNumber();
    // }
    // if(symbolCheck.checked){
    //     password+=generateSymbols();
    // }

    let funArr= [];
    if(uppercaseCheck.checked){
        funArr.push(generateUpperCase)
    }
    if(lowercaseCheck.checked){
        funArr.push(generateLowerCase);
    }
    if(numberCheck.checked){
        funArr.push(generateRandomNumber);
    }
    if(symbolCheck.checked){
        funArr.push(generateSymbols);
    }

    // compulsory condition
    for(let i=0 ; i<funArr.length ; i++){
        password+=funArr[i]();
    }

    // remaining condition
    for(let i=0 ; i<passwordLength-funArr.length ; i++){
        let randIndex=getRandomInteger(0,funArr.length);
        password+=funArr[randIndex]();
    }

    // shuffle the password
    password=shufflePassword(Array.from(password));

    // show in UI
    passwordDisplay.value=password;

    // calculate strength
    calcStrength();
})

function shufflePassword(shufflePassword){
    // fisher yates method
    for(let i=shufflePassword.length-1 ; i>0 ; i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp=shufflePassword[i];
        shufflePassword[i]=shufflePassword[j];
        shufflePassword[j]=temp;
    }

    let str="";
    shufflePassword.forEach((el)=>{str+=el});
    return str;
}
