export function getApi() {
  return fetch("https://wedev-api.sky.pro/api/v1/apetrimihai/comments", {
    method: "GET",
  }).then((response) => {
    return response.json();
  });
}

export function postApi({ name, text, date }) {
  return fetch("https://wedev-api.sky.pro/api/v1/apetrimihai/comments", {
    method: "POST",
    body: JSON.stringify({
      name: name,
      text: text,
      date: date,
    }),
  });
}
