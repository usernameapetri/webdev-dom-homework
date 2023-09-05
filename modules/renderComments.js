import { sanitizeHtml } from "./sanitizeHtml.js";

const commentList = document.getElementById("commentBlock");

export const renderTask = ({ commentListener }) => {
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

  commentList.innerHTML = commentHtml;
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
};
