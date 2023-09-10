import { fetchGet } from "../main.js";
import { renderLogin } from "./loginPage.js";
import { registration, setToken, setUserName, token, userName } from "./api.js";

export const renderRegistration = () => {
  const appElement = document.getElementById("app");
  const regHtml = ` <div class="container">
  <div class="add-form">
    <p class="logPage__headung">Форма регистрации</p>
    <form class="logForm" action="">
        <input
        class="add-form-name logForm__input"
        type="text"
        id="name-input"
        placeholder="Введите имя"
        autocomplete="username"
      />
        <input
        class="add-form-name logForm__input"
        type="text"
        id="login-input"
        placeholder="Введите логин"
        autocomplete="username"
      />
        <input
        class="add-form-name logForm__input"
        type="password"
        id="password-input"
        placeholder="Введите пароль"
        autocomplete="current-password"
      />
      </form>
    <div class="logPage__btn">
      <button class="add-form-button" id='reg-btn'>Зарегистрироваться</button>
    </div>
    <a class="registrationLink" id='enter-btn' href="#">Войти</a>
  </div>
 </div>`;

  appElement.innerHTML = regHtml;
  const nameInputElement = document.getElementById("name-input");
  const loginInputElement = document.getElementById("login-input");
  const passwordInputElement = document.getElementById("password-input");
  const enterBtnElement = document.getElementById("enter-btn");
  const regbtnElement = document.getElementById("reg-btn");

  enterBtnElement.addEventListener("click", () => {
    renderLogin({ fetchGet });
  });

  regbtnElement.addEventListener("click", () => {
    regbtnElement.textContent = "Отправка данных...";
    regbtnElement.style.color = "gray";
    regbtnElement.disabled = true;
    nameInputElement.disabled = true;
    loginInputElement.disabled = true;
    passwordInputElement.disabled = true;

    registration({
      name: nameInputElement.value,
      login: loginInputElement.value,
      password: passwordInputElement.value,
    })
      .then((responseData) => {
        setToken(responseData.user.token);
        setUserName(responseData.user.name);
        setTimeout(() => {
          regbtnElement.textContent = "Регистрация прошла успешно ✅";
          regbtnElement.style.color = "green";
        }, 2000);
        setTimeout(() => {
          fetchGet();
        }, 2500);
        if (responseData.status === 400) {
          throw new Error("Что то пошло не так");
        }
      })
      .catch((error) => {
        if (error.message === "Что то пошло не так") {
          alert("💢Что то пошло не так, попробуйте позже💢 ");
          nameInputElement.value = "";
          loginInputElement.value = "";
          passwordInputElement.value = "";
          setTimeout(() => {
            regbtnElement.disabled = false;
            nameInputElement.disabled = false;
            loginInputElement.disabled = false;
            passwordInputElement.disabled = false;
            regbtnElement.textContent = "Зарегистрироваться";
            regbtnElement.style.color = "black";
          }, 2000);
        }
      });
  });
};
