const arr = [
  {
    question: "What year was JavaScript Launched?",
    a: "1996",
    b: "1995",
    c: "1994",
    d: "none of the above",
    ans: "b",
  },
  {
    question: "What does HTML stand for?",
    a: "HyperText Markup Language",
    b: "HyperText Markdown Language",
    c: "Hyperloop Machine Language",
    d: "Helicopters Terminals Motorboats Lamborginis",
    ans: "a",
  },
  {
    question: "Which Language run in a web browser?",
    a: "Java",
    b: "C",
    c: "Python",
    d: "JavaScript",
    ans: "d",
  },
  {
    question: "What does CSS stand for?",
    a: "Central Style Sheets",
    b: "Cascading Style Sheets",
    c: "Central Simple Sheets",
    d: "Cars SUVs Sailboats",
    ans: "b",
  },
];


const box = document.getElementById("box");
const question = document.getElementById("question");
const options = document.querySelectorAll(".option");
const optionA = document.getElementById("optionA");
const optionB = document.getElementById("optionB");
const optionC = document.getElementById("optionC");
const optionD = document.getElementById("optionD");
const submit = document.getElementById("submit");
const backBtn = document.getElementById('backBtn');
const quizApp = document.getElementById('quiz-app');
const inputform = document.getElementById('inputform');
const userEmail = document.getElementById('useremail');
const userName = document.getElementById('username');
const usernamepara = document.getElementById('usernamepara');
const result = document.getElementById('result');
const resultContainer = document.getElementById('resultContainer')
const restartButton = document.getElementById("restartButton")


let obj = {};
let ansSelected = obj.ansSelected || [];


function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + encodeURIComponent(JSON.stringify(value)) + expires + "; path=/";
}


function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return JSON.parse(decodeURIComponent(c.substring(nameEQ.length, c.length)));
  }
  return null;
}


function deleteCookie(name) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}


function saveUserDataCookies() {
  setCookie("userData", obj);
}


function loadUserData() {
  const cookieData = getCookie("userData");
  const localStorageData = localStorage.getItem("userData");

  if (cookieData) {
    obj = cookieData;
  } else if (localStorageData) {
    obj = JSON.parse(localStorageData);
  } else {
    showLoginPage();
    return;
  }

  if (obj.index !== undefined) {

    ansSelected = obj.ansSelected || [];
    if (obj.index >= arr.length) {
      showScorePage();
    } else {
      showQuesPage()
      render()

    }
    return;
  }

  showLoginPage();
}


window.addEventListener("load", () => {
  loadUserData();
  usernamepara.innerText = `Hey, ${obj.username}`;
});


window.addEventListener("beforeunload", () => {
  if (obj.index !== undefined) {
    saveUserDataCookies()
  }
});


function showLoginPage() {
  inputform.reset()

  quizApp.style.display = "block";
  box.style.display = "none"
  resultContainer.style.display = "none"
}


function showQuesPage() {
  quizApp.style.display = "none";
  box.style.display = "block"
  resultContainer.style.display = "none"
}


function showScorePage() {

  result.innerHTML = ``

  quizApp.style.display = "none"
  box.style.display = "none"
  resultContainer.style.display = "block"


  let table = document.createElement('table')
  let tr = document.createElement('tr')
  let th1 = document.createElement('th')
  let th2 = document.createElement('th')
  let th3 = document.createElement('th')


  result.insertAdjacentElement("afterbegin", table)
  table.insertAdjacentElement("afterbegin", tr)
  tr.insertAdjacentElement("afterbegin", th1)
  th1.innerText = "Username"
  tr.insertAdjacentElement("beforeend", th2)
  th2.innerText = "Email"
  tr.insertAdjacentElement("beforeend", th3)
  th3.innerText = "Score"


  for (let i = 0; i < localStorage.length; i++) {
    let x = localStorage.key(i)
    let user = localStorage.getItem(x)
    user = JSON.parse(user)

    let tr = document.createElement('tr')
    let td1 = document.createElement('td')
    let td2 = document.createElement('td')
    let td3 = document.createElement('td')

    table.insertAdjacentElement("beforeend", tr)
    tr.insertAdjacentElement("afterbegin", td1)
    td1.innerHTML = `${user.username}`
    tr.insertAdjacentElement("beforeend", td2)
    td2.innerHTML = `${user.useremail}`
    tr.insertAdjacentElement("beforeend", td3)
    td3.innerHTML = `${user.score}`

  }

}


inputform.addEventListener('submit', (e) => {

  e.preventDefault()

  const useremail = userEmail.value
  const username = userName.value

  let validation = useremail.toLowerCase().match(
    /^[A-Za-z\._\-0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/
  );

  if (!validation) {
    alert("Please Enter valid email address")
    userEmail.value = "";
    userEmail.focus();
    return;
  }

  if (localStorage.length >= 10) {
    alert("Maximum users have attended the quiz.")
    localStorage.clear()
    window.close()
  }

  const userData = JSON.parse(localStorage.getItem(useremail))
  if (userData) {
    obj = userData;
    showScorePage()
    return;
  } else {
    obj = {
      username,
      useremail,
      score: 0,
      index: 0
    };
    localStorage.setItem(useremail, JSON.stringify(obj));

    saveUserDataCookies();
  }

  usernamepara.innerText = `Hey, ${username}`
  showQuesPage();
  render();

})


function render() {

  const currentmcq = arr[obj.index];

  question.innerText = currentmcq.question;
  optionA.innerText = currentmcq.a;
  optionB.innerText = currentmcq.b;
  optionC.innerText = currentmcq.c;
  optionD.innerText = currentmcq.d;


  let answer = ansSelected[obj.index];

  if (answer !== undefined) {
    options.forEach((option) => {
      if (option.id == answer) {
        option.checked = true;
      }
    });
  }

  if (obj.index == 0) {
    backBtn.style.display = "none";
  } else {
    backBtn.style.display = "block";
  }
}


submit.addEventListener("click", () => {

  let selectedChoice;

  for (let i = 0; i < options.length; i++) {
    if (options[i].checked) {
      selectedChoice = options[i].id;
      for (let j = 0; j < options.length; j++) {
        options[j].checked = false;
      }
      break;
    }
  }

  ansSelected[obj.index] = selectedChoice;
  obj.ansSelected = ansSelected;
  localStorage.setItem(obj.useremail, JSON.stringify(obj));
  saveUserDataCookies()

  if (selectedChoice == undefined) {
    alert("Please select option!!!");
    return;
  }


  obj.index++;

  if (obj.index === arr.length) {
    calculateScore();
    showScorePage()

  } else {
    render();
  }
}
);


function calculateScore() {
  let score = 0;
  for (let i = 0; i < arr.length; i++) {
    if (ansSelected[i] === arr[i].ans) {
      score++;
    }
  }
  obj.score = score;
  localStorage.setItem(obj.useremail, JSON.stringify(obj));
  saveUserDataCookies();
}


backBtn.addEventListener('click', () => {
  obj.index--;
  localStorage.setItem(obj.useremail, JSON.stringify(obj));
  saveUserDataCookies();

  render()
})


restartButton.addEventListener("click", () => {
  if (localStorage.length >= 10) {
    alert("Maximum users have attended the quiz.");
    localStorage.clear();
    window.close();
  }

  deleteCookie("userData")

  inputform.reset();
  obj = {};
  ansSelected = [];

  showLoginPage()
});