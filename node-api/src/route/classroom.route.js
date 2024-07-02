const { getList, getOne, create, update, remove, getCourseGenerationByCourseId, student_by_classroom } = require("../controller/classroom.controller");
const classroom = (app) => {
  app.get("/api/classroom", getList);
  app.get("/api/classroom/:id", getOne);
  app.post("/api/classroom", create);
  app.put("/api/classroom", update);
  app.delete("/api/classroom/:id", remove);
  app.get("/api/classroom/get_gn/:id", getCourseGenerationByCourseId);
  app.get("/api/student_by_classroom/:id", student_by_classroom);
};
module.exports = {
  classroom,
};
