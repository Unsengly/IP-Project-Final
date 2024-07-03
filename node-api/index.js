const express = require("express");
const cors = require("cors");
const { teacher } = require("./src/route/teacher.route"); //import route
const { student } = require("./src/route/student.route");
const { category } = require("./src/route/category.route");
const { role } = require("./src/route/role.route");
const { users } = require("./src/route/users.route");
const { course } = require("./src/route/course.route");
const { classroom } = require("./src/route/classroom.route");
const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.get("/", (req, res) => {
  res.send("");
});

// call route
teacher(app);
student(app);
category(app);
role(app);
users(app);
course(app);
classroom(app);

const port = 8085;
app.listen(port, () => {
  console.log("http://localhost:" + port);
});
