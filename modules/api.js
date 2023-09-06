let userURL = "https://wedev-api.sky.pro/api/user/login";
let apiCommentsURL = "https://wedev-api.sky.pro/api/v2/usernameapetri/comments";
let regURL = "https://wedev-api.sky.pro/api/user";

export let token;

export const setToken = (newToken) => {
  token = newToken;
};

export let userName;

export const setUserName = (newName) => {
  userName = newName;
};

export function getApi() {
  return fetch(apiCommentsURL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((response) => {
    return response.json();
  });
}

export function postApi({ name, text, date }) {
  return fetch(apiCommentsURL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: name,
      text: text,
      date: date,
    }),
  });
}

export function login({ login, password }) {
  return fetch(userURL, {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  })
    .then((response) => {
      if (response.status === 201) {
        return response.json();
      }
      if (response.status === 400) {
        throw new Error("Неверно введено имя или пароль");
      }
    })
    .catch((error) => {
      if (error.message === "Неверно введено имя или пароль") {
        alert("Неверно введено имя или пароль");
      }
    });
}

export function registration({ name, login, password }) {
  return fetch(regURL, {
    method: "POST",
    body: JSON.stringify({
      name,
      login,
      password,
    }),
  })
    .then((response) => {
      if (response.status === 201) {
        return response.json();
      }
      if (response.status === 400) {
        throw new Error(
          "Данный логин или Имя уже существует попробуйте войти в авторизоваться"
        );
      }
    })
    .catch((error) => {
      let errorMessage = "Произошла ошибка при регистрации";
      if (
        error.message ===
        "Данный логин или Имя уже существует попробуйте войти в авторизоваться"
      ) {
        errorMessage =
          "Данный логин или Имя уже существует. Попробуйте войти в систему.";
      }
      alert(errorMessage);
    });
}
