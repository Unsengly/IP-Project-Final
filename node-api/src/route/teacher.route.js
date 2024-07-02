const { validate_token } = require("../config/service");
const { getList, create, update, remove, getOne } = require("../controller/teacher.controller");
const teacher = (app) => {
  app.get("/api/teacher", validate_token(), getList);
  app.get("/api/teacher/:id", validate_token(), getOne);
  app.post("/api/teacher", validate_token(), create);
  app.put("/api/teacher", validate_token(), update);
  app.delete("/api/teacher/:id", validate_token(), remove);
};

module.exports = {
  teacher,
};
