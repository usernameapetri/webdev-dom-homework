import { getCurrentDate } from "./modules/sanitizeHtml.js";
import { getApi, postApi } from "./modules/api.js";
import { renderTask } from "./modules/renderComments.js";

const nameInput = document.getElementById("nameInput");
const commentInput = document.getElementById("commentInput");
const remuveButton = document.getElementById("remuveButton");
const addButton = document.getElementById("addButton");
const commentElement = document.querySelectorAll(".comments");

const editImput = document.querySelectorAll(".edit-input");
const addForm = document.querySelector(".add-form");
const loadingForm = document.querySelector(".loading-addForm");
const loadingText = document.querySelector(".loading-text");
const loadingPage = document.querySelector(".load-comments");
const likeBtn = document.querySelectorAll(".like-button");

let commentListener = [];

const fetchGet = () => {
  getApi().then((responseData) => {
    const appComments = responseData.comments.map((comment) => {
      return {
        name: comment.author.name,
        date: comment.date,
        text: comment.text,
        likes: comment.likes,
        isLiked: false,
        isEdited: true,
        isLoading: true,
      };
    });
    commentListener = appComments;
    loadingPage.style.display = "none";
    renderTask({ commentListener });
  });
};

fetchGet();

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
        fetchPost();
      });
  };
  fetchPost();
});
