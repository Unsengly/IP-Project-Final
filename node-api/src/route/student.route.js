const { validate_token } = require("../config/service");
const { getList, create, update, remove, getOne, studentRegisterCreate, studentRegisterGetList, studentPayment } = require("../controller/student.controller");
const student = (app) => {
  app.get("/api/student", getList);
  app.get("/api/student/:id", getOne);
  app.post("/api/student", create);
  app.put("/api/student", update);
  app.delete("/api/student", remove);
  app.post("/api/student_payment", studentPayment);
  app.get("/api/student_register", validate_token(), studentRegisterGetList);
  app.post("/api/student_register", studentRegisterCreate);
};
module.exports = {
  student,
};
