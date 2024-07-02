const { validate_token } = require("../config/service");
const { getList, getOne, create, update, remove } = require("../controller/role.controller");
const role = (app) => {
  app.get("/api/role", validate_token(), getList);
  app.get("/api/role/:id", validate_token(), getOne);
  app.post("/api/role", validate_token(), create);
  app.put("/api/role", validate_token(), update);
  app.delete("/api/role/:id", validate_token(), remove);
};

module.exports = {
  role,
};
