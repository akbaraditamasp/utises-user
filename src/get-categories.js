import service from "./service";

const getCategories = () =>
  new Promise((resolve) => {
    service
      .get("/category")
      .then((response) => {
        resolve(response.data);
      })
      .catch(() => {
        resolve([]);
      });
  });

export default getCategories;
