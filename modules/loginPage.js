import { login, setToken, setUserName, token, userName } from "./api.js";
import { renderRegistration } from "./registrationpage.js";

export const renderLogin = ({ fetchGet }) => {
  const appElement = document.getElementById("app");
  const loginHtml = `<div class="container">
    <div class="add-form">
      <p class="logPage__headung">Форма входа</p>
      <form class="logForm" action="">
        <input
            class="add-form-name logForm__input"
            type="text"
            name="username"
            id="login-input"
            placeholder="Введите логин"
            autocomplete="username"
         />
        <input
            class="add-form-name logForm__input"
            type="password"
            name="password"
            id="password-input"
            autocomplete="current-password"
            placeholder="Введите пароль"
            />
        </form>
      <div class="logPage__btn">
        <button class="add-form-button" id="login-btn">Войти</button>
      </div>
      <a class="registrationLink" id="reg-btn" href="#">Зарегистрироваться</a>
    </div>
  </div>`;
  appElement.innerHTML = loginHtml;

  const regbtnElement = document.getElementById("reg-btn");
  const btnElement = document.getElementById("login-btn");
  const loginInputElement = document.getElementById("login-input");
  const passwordInputElement = document.getElementById("password-input");

  regbtnElement.addEventListener("click", () => {
    renderRegistration({ renderLogin });
  });

  btnElement.addEventListener("click", () => {
    login({
      login: loginInputElement.value,
      password: passwordInputElement.value,
    })
      .then((responseData) => {
        setToken(responseData.user.token);
        setUserName(responseData.user.name);
        window.localStorage.setItem("storageToken", responseData.user.token);
        window.localStorage.setItem("userName", responseData.user.name);
        return fetchGet();
      })
      .then((fetchResponse) => {
        btnElement.textContent = "Подождите";
        btnElement.style.color = "gray";
      });
  });
};
