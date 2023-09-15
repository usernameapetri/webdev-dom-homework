import { getApi, setToken, setUserName } from './modules/api.js';
import { renderTask } from './modules/renderComments.js';
let commentListener = [];

export const fetchGet = () => {
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
    setToken(window.localStorage.getItem('storageToken'));
    setUserName(window.localStorage.getItem('userName'));
    renderTask({ commentListener });
  });
};

fetchGet();
