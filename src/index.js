'use strict';

const app = document.getElementById("app");
const HIDDEN_CLASS = "hidden",
  LOCAL_STORAGE = window.localStorage,
  QUOTES = [
    { quote: 'I never dreamed about success, I worked for it', author: 'Estee Lauder' },
    { quote: 'Do not try to be original, just try to be good.', author: 'Paul Rand' },
    { quote: 'Do not be afraid to give up the good to go for the great', author: 'John D. Rockefeller' },
    { quote: 'If you cannot fly then run. If you cannot run, then walk. And if you cannot walk, then crawl, but whatever you do, you have to keep moving forward.', author: 'Martin Luther King Jr.' },
    { quote: 'Our greatest weakness lies in giving up. The most certain way to succeed is always to try just one more time.', author: 'Thomas Edison' },
    { quote: 'The fastest way to change yourself is to hang out with people who are already the way you want to be', author: 'REid Hoffman' },
    { quote: 'Money is like gasoline during a road trip. You do not want to run out of gas on your trip, but you are not doing a tour of gas stations', author: 'Tim O Reilly' },
    { quote: 'Some people dream of success, while other people get up every morning and make it happen', author: 'Wayne Huizenga' },
    { quote: 'The only thing worse than starting something and falling.. is not starting something', author: 'SEth Godin' },
    { quote: 'If you really want to do something, you will find a way. If you do not, you will find an excuse.', author: 'Jim Rohn' }
  ];

function getRandomIndex(target, length, result) {
  if (result === "undefined") {
    result = [];
  }

  if (length <= 0) {
    return result;
  }

  const randomIndex = Math.floor(Math.random() * target.length);
  result.push(target[randomIndex]);

  const exclude = [...target];
  exclude.splice(randomIndex, 1);
  return getRandomIndex(exclude, length - 1, result);
}



//+++++++++++++ SET time
function getTime() {
  const newDateNow = new Date();
  return `${String(newDateNow.getHours()).padStart(2, "0")} : ${String(newDateNow.getMinutes()).padStart(2, "0")} : ${String(newDateNow.getSeconds()).padStart(2, "0")}`;
};



//+++++++++++++ GET geolocation and SET weather
function getGeolocation() {
  const weatherHere = contentBox.querySelector(".content_weather .weather-now");

  const API_KEY = "4768cdf41f132390c7e271472a41d15c";
  const onGeoOk = async (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    await fetch(url)
      .then(response => response.json())
      .then(data => {
        const name = data?.name || "";
        const weather = data?.weather[0].main || "";
        const temp = data?.main.temp || "";
        weatherHere.innerHTML = `
          <p class="name">${name}</p>
          <p class="weather">${weather}<span class="temp">${temp}°C</span></p>
        `;
      })
      .catch(error => console.error(error));
  };
  const onGeoError = (error) => {
    console.error("Can't find you. No weather for you.");
    console.error(error);
  };
  navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError);
};



//+++++++++++++ SET random background image and quotes
const background = app.querySelector(".background");
function getRandomBackground() {
  const imageNumber = new Array(12).fill(0).map((e, i) => String(i + 1).padStart(2, "0"));
  const randomImageIndex = getRandomIndex(imageNumber, 1, []);
  background.innerHTML = `<img src="./assets/bg-${randomImageIndex}.jpg" />`;
}

const randomQuoteBox = app.querySelector(".content_quote");
function getRandomQuotes() {
  const randomQuote = getRandomIndex(QUOTES, 1, [])[0];
  randomQuoteBox.querySelector(".quote").innerText = randomQuote.quote;
  randomQuoteBox.querySelector(".author").innerText = randomQuote.author;
}

const loginBox = app.querySelector(".login-box");
const contentBox = app.querySelector(".content-box");



//+++++++++++++ Login
function greeting(name) {
  const greeting = document.getElementById("greeting-title");
  greeting.innerText = `🖐 Hi, ${name}`;
}

function handleLoginSubmit(e) {
  e.preventDefault();
  const usernameInput = loginBox.querySelector("input.username");
  const username = usernameInput.value;

  if (username.trim() === "") {
    alert("Input username");
    usernameInput.focus();
    return;
  }

  LOCAL_STORAGE.setItem("username", username);
  loginBox.classList.add(HIDDEN_CLASS);
  contentBox.classList.remove(HIDDEN_CLASS);
  greeting(LOCAL_STORAGE.username);
};

loginBox.querySelector("#loginForm").addEventListener("submit", handleLoginSubmit);



//+++++++++++++ add to-do item
const todo = {
  form: document.getElementById("todo-form"),
  input: document.querySelector("#todo-form input"),
  list: document.querySelector(".content__todo-list")
};
const TODOS_KEY = "todos";
let todos = [];

function saveTodos(todos) {
  LOCAL_STORAGE.setItem(TODOS_KEY, JSON.stringify(todos));
}

function deleteTodo(e) {
  e.target.parentElement.remove();
  todos = todos.filter(todo =>
    parseInt(todo.id, 10) !== parseInt(e.target.parentElement.id, 10)
  );
  saveTodos(todos);
  console.log(todos);
}


function paintTodo(newTodo) {
  const LI = document.createElement("li");
  LI.id = newTodo.id;
  const SPAN = document.createElement("span");
  SPAN.innerText = newTodo.text;
  const BUTTON = document.createElement("button");
  BUTTON.innerHTML = `❌`;
  BUTTON.addEventListener("click", deleteTodo);
  LI.appendChild(BUTTON);
  LI.appendChild(SPAN);
  todo.list.appendChild(LI);
}

function handleTodoSubmit(e) {
  e.preventDefault();

  const newTodo = { id: Date.now(), text: todo.input.value };

  todo.input.value = "";
  todos.push(newTodo);
  paintTodo(newTodo);
  saveTodos(todos);
}

todo.form.addEventListener("submit", handleTodoSubmit);



//+++++++++++++ onLoad window,
window.onload = () => {

  // random background
  getRandomBackground();

  if (LOCAL_STORAGE.username) {
    greeting(LOCAL_STORAGE.username);
    loginBox.classList.add(HIDDEN_CLASS);
    contentBox.classList.remove(HIDDEN_CLASS);
  } else {
    contentBox.classList.add(HIDDEN_CLASS);
    loginBox.classList.remove(HIDDEN_CLASS);
  }

  // random quotes
  getRandomQuotes();

  // weather
  getGeolocation();

  // time
  const clock = contentBox.querySelector(".content_clock .clock");
  if (clock.innerText === "") {
    clock.innerText = getTime();
  }
  setInterval(() => {
    clock.innerText = getTime();
  }, 1000);

  const savedTodos = LOCAL_STORAGE.getItem(TODOS_KEY);
  if (savedTodos) {
    const parsedTodos = JSON.parse(savedTodos);
    parsedTodos.forEach(todoItem => {
      paintTodo(todoItem);
    });
    todos = parsedTodos;
  }
};