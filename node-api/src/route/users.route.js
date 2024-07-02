const { validate_token } = require("../config/service");
const { getList, getOne, create, update, remove, login, refres_token, userConfig } = require("../controller/users.controller");

const users = (app) => {
  app.get("/api/users", validate_token(), getList);
  app.post("/api/users/login", login);
  app.get("/api/users/:id", validate_token(), getOne);
  app.post("/api/users", validate_token(), create);
  app.put("/api/users", validate_token(), update);
  app.delete("/api/users/:id", validate_token(), remove);
  app.post("/api/users/refresh_token", refres_token);
  app.post("/api/users/getConfig", userConfig);
};
module.exports = {
  users,
};
