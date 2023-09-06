import { postApi, userName, token } from "./api.js";
import { getCurrentDate, sanitizeHtml } from "./utiliti.js";
import { fetchGet } from "../main.js";
import { renderLogin } from "./loginPage.js";

const commentList = document.getElementById("commentBlock");

export const renderTask = ({ commentListener }) => {
  const appElement = document.getElementById("app");
  const commentHtml = commentListener
    .map((comment, index) => {
      if (comment.isLiked === true) {
        comment.isLiked = "-active-like";
      }
      return `
        <li class="comment" data-comments=${index} >
      <div class="comment-header">
        <div>${sanitizeHtml(comment.name)}</div>
        <div>${
          comment.date ? new Date(comment.date).toLocaleString() : ""
        }</div>
      </div>
      <div class="comment-body">
      ${
        comment.isEdited
          ? `<div class="comment-text" style="white-space:pre-line" data-coment=${index} data-text=${index}>
          ${sanitizeHtml(comment.text)}
      </div> `
          : `<textarea
    type="textarea"
    class="add-form-text edit-input"
    placeholder="Введите ваш коментарий"
    rows="4"
    data-text=${index}
  >${sanitizeHtml(comment.text)}</textarea>`
      }
      <div class="comment-footer">
      <button class = 'edit-btn' data-edit=${index}>
                ${comment.isEdited ? "Редактировать" : "Сохранить"}
              </button>
        <div class="likes">
          <span class="likes-counter ">${comment.likes}</span>
          <button class="like-button ${
            comment.isLiked
          }" data-index="${index}"></button>
        </div>
      </div>
    </li>
    `;
    })
    .join("");

  const appHtml = `<div class="container">
    <ul class="comments" id="commentBlock">
      ${commentHtml}
    </ul> 
    <div class="loading-addForm">
      <p class="loading-text">Коментарий добавляеться...</p>
     </div>
     ${
       token
         ? `<div class="add-form id="add-form" ">
     <input
       type="text"
       class="add-form-name"
       placeholder="Введите ваше имя"
       id="nameInput"
     />
     <textarea
       type="textarea"
       class="add-form-text"
       placeholder="Введите ваш коментарий"
       rows="4"
       id="commentInput"
     ></textarea>
     <div class="add-form-row">
       <button class="add-form-button" id="addButton">Написать</button>
       <button class="add-form-button remuve-form-button" id="remuveButton">
         Удалить
       </button>
     </div>`
         : `<div class="authorization-block">
         Чтобы добавить коментарий,<a href="#" class="add-form-authorization" id='form-log'>авторизуйтесь</a>
       </div>`
     }
    </div>
  </div>`;

  appElement.innerHTML = appHtml;

  const loadingText = document.querySelector(".loading-text");
  const loadingPage = document.querySelector(".load-comments");
  const likeButtons = document.querySelectorAll(".like-button");
  likeButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      setTimeout(() => {
        event.stopPropagation();
        const index = button.dataset.index;
        const comment = commentListener[index];
        const likeBtn = likeButtons[index];

        likeBtn.classList.add("-loading-like");

        if (!comment.isLiked) {
          comment.isLiked = true;
          comment.likes++;
        } else {
          comment.isLiked = false;
          comment.likes--;
        }

        renderTask({ commentListener });
      }, 1000);
    });
  });

  const eventClickText = document.querySelectorAll(".comment");
  eventClickText.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const index = button.dataset.comments;
      const comment = commentListener[index];
      commentInput.value =
        ">" +
        commentListener[index].text +
        "\n" +
        "\n" +
        commentListener[index].name +
        ",";
    });
  });

  const editEventElement = document.querySelectorAll(".edit-btn");
  editEventElement.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const index = button.dataset.edit;
      const comment = commentListener[index];

      const select = document.querySelector(".edit-input");

      if (select) {
        commentListener[index].editText = select.value;
        commentListener[index].text = select.value;
      }

      if (!comment.isEdited) {
        comment.isEdited = true;
      } else {
        comment.isEdited = false;
      }
      renderTask({ commentListener });
    });
  });

  const nameInput = document.getElementById("nameInput");
  const commentInput = document.getElementById("commentInput");
  const remuveButton = document.getElementById("remuveButton");
  const addButton = document.getElementById("addButton");
  const commentElement = document.querySelectorAll(".comments");

  const editImput = document.querySelectorAll(".edit-input");
  const addForm = document.querySelector(".add-form");
  const loadingForm = document.querySelector(".loading-addForm");

  const likeBtn = document.querySelectorAll(".like-button");

  if (token) {
    nameInput.value = userName;
    nameInput.disabled = true;
    addButton.addEventListener("click", () => {
      if (nameInput.value === "") {
        nameInput.style.backgroundColor = "rgba(255, 0, 0, 0.5)";
        nameInput.placeholder = "ВВЕДИТЕ ВАШЕ ИМЯ";
        addButton.disabled = true;
        addButton.style.backgroundColor = "gray";
        return;
      }

      if (commentInput.value === "") {
        commentInput.style.backgroundColor = "rgba(255, 0, 0, 0.5)";
        commentInput.placeholder = "ВЫ НИЧЕГО НЕ ВВЕЛИ";
        addButton.disabled = true;
        addButton.style.backgroundColor = "gray";
        return;
      }
      loadingForm.style.display = "block";
      addForm.style.display = "none";

      const fetchPost = () => {
        postApi({
          name: nameInput.value,
          text: commentInput.value,
          date: getCurrentDate(),
        })
          .then((response) => {
            if (response.status === 201) {
              return response.json();
            } else {
              throw new Error("Сервер упал");
            }
          })
          .then((responseData) => {
            commentListener = responseData.comments;
            nameInput.value = "";
            commentInput.value = "";
            nameInput.style.backgroundColor = "";
            nameInput.placeholder = "Введите ваше имя";
            commentInput.style.backgroundColor = "";
            commentInput.placeholder = "Введите ваш комментарий";
            return fetchGet();
          })
          .finally(() => {
            addForm.style.display = "flex";
            loadingForm.style.display = "none";
            nameInput.addEventListener("input", () => {
              addButton.disabled = false;
              addButton.style.backgroundColor = "";
              nameInput.style.backgroundColor = "";
            });

            commentInput.addEventListener("input", () => {
              addButton.disabled = false;
              addButton.style.backgroundColor = "";
              commentInput.style.backgroundColor = "";
            });
          })
          .catch((error) => {
            alert("Кажеться что то пошло не так, попробуй позже🗿");
            addButton.disabled = false;
            console.warn("Error");
          });
      };
      fetchPost();
    });
  } else {
    const formLogElement = document.getElementById("form-log");
    formLogElement.addEventListener("click", () => {
      renderLogin({ fetchGet });
    });
  }
};
