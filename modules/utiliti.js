export const sanitizeHtml = (htmlString) => {
  return htmlString.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
};

export const getCurrentDate = () => {
  const formattedDate = new Date();

  return formattedDate;
};
