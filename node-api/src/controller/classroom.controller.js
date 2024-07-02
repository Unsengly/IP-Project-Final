const db = require("../config/db");
const { logError, isEmptyOrNull } = require("../config/service");

const getList = async (req, res) => {
  try {
    var sql1 =
      "SELECT " +
      " cr.*," +
      " CONCAT(t.FirstName,'-',t.LastName) AS TeacherName," +
      " CONCAT(c.Name,'-G',cr.CourseGeneration) AS CourseName" +
      " FROM `classroom` cr" +
      " INNER JOIN teacher t on cr.TeacherId = t.Id" +
      " INNER JOIN course c on cr.CourseId = c.Id ";
    var sql =
      " SELECT  " +
      " cr.Id ClassRoomId, " +
      " CONCAT(c.Name,'-G',cr.CourseGeneration) as CourseName, " +
      " CONCAT(t.FirstName,'-',t.LastName) AS TeacherName, " +
      " CONCAT(c.Name,'-G',cr.CourseGeneration) AS CourseName, " +
      " cr.StartTime, " +
      " cr.EndTime, " +
      " cr.Note, " +
      " cr.ClassShiff, " +
      " cr.LearningType, " +
      " cr.ClassStatus, " +
      " cr.StartDate, " +
      " cr.EndDate, " +
      " cr.Class_Price, " +
      " cr.*, " +
      " COUNT(sr.ClassRoomId) as TotalRegister, " +
      " SUM(sr.TotalToPay) as TotalToPay, " +
      " SUM(sp.Payment) as TotalPaid " +
      " from classroom cr " +
      " INNER JOIN course c on cr.CourseId = c.Id " +
      " LEFT JOIN studentregister sr on cr.Id = sr.ClassRoomId " +
      " LEFT JOIN studentpayment sp on (sr.ClassRoomId = sp.ClassRoomId and sr.StudentId = sp.StudentId) " +
      " INNER JOIN teacher t on cr.TeacherId = t.Id " +
      " GROUP BY cr.Id";

    const [teacher] = await db.query("SELECT * FROM teacher");
    const [course] = await db.query("SELECT * FROM course");
    const [list] = await db.query(sql);
    res.json({
      list: list,
      teacher,
      course,
    });
  } catch (error) {
    logError("classroom.getList", error, res);
  }
};

const getCourseGenerationByCourseId = async (req, res) => {
  try {
    const [course] = await db.query("SELECT CourseId FROM classroom WHERE CourseId =:Id", { Id: req.params.id });
    res.json({
      generation: course.length + 1,
    });
  } catch (error) {
    logError("classroom.getList", error, res);
  }
};

const getOne = async (req, res) => {
  try {
    var parameter = {
      Id: req.params.id,
    };
    const [list] = await db.query("SELECT * FROM classroom WHERE Id = :Id", parameter);
    res.json({
      list: list,
    });
  } catch (error) {
    logError("classroom.getOne", error, res);
  }
};
//

var sqlUpdate =
  "" +
  " UPDATE classroom SET" +
  " TeacherId=:TeacherId " +
  " ,CourseId=:CourseId " +
  " ,CourseGeneration=:CourseGeneration " +
  " ,Course_Price=:Course_Price " +
  " ,Class_Discount=:Class_Discount " +
  " ,Class_Discount_Price=:Class_Discount_Price " +
  " ,Class_Price=:Class_Price " +
  " ,LearningType=:LearningType " +
  " ,ClassStatus=:ClassStatus " +
  " ,ClassShiff=:ClassShiff " +
  " ,StartTime=:StartTime " +
  " ,EndTime=:EndTime " +
  " ,StartDate=:StartDate " +
  " ,EndDate=:EndDate " +
  " ,IsActive=:IsActive " +
  " ,Note=:Note ";
var param = {
  TeacherId: "",
  CourseId: "", //*
  CourseGeneration: "", //*
  Course_Price: "", //*
  Class_Discount: "",
  Class_Discount_Price: "",
  Class_Price: "",
  LearningType: "", //*
  ClassStatus: "", //*
  ClassShiff: "", //*
  StartTime: "", //*
  EndTime: "", //*
  StartDate: "",
  EndDate: "",
  IsActive: "",
  Note: "",
};
const create = async (req, res) => {
  try {
    var {
      TeacherId, //*
      CourseId, //*
      CourseGeneration, //*
      Course_Price,
      Class_Discount,
      Class_Discount_Price,
      Class_Price,
      LearningType, //*
      ClassStatus, //*
      ClassShiff, //*
      StartTime,
      EndTime,
      StartDate,
      EndDate,
      IsActive,
      Note,
    } = req.body;
    var error = {};
    if (isEmptyOrNull(TeacherId)) {
      error.TeacherId = "TeacherId required!";
    }
    if (isEmptyOrNull(CourseId)) {
      error.CourseId = "CourseId required!";
    }
    if (isEmptyOrNull(CourseGeneration)) {
      error.CourseGeneration = "CourseGeneration requered!";
    }
    if (isEmptyOrNull(LearningType)) {
      error.LearningType = "LearningType requered!";
    }
    if (isEmptyOrNull(ClassStatus)) {
      error.ClassStatus = "ClassStatus requered!";
    }
    if (isEmptyOrNull(ClassShiff)) {
      error.ClassShiff = "ClassShiff requered!";
    }
    if (Object.keys(error).length > 0) {
      res.json({
        error: error,
      });
      return false;
    }

    var sqlInsert =
      "" +
      " INSERT INTO classroom" +
      " (TeacherId,CourseId,CourseGeneration,Course_Price,Class_Discount,Class_Discount_Price,Class_Price,LearningType,ClassStatus,ClassShiff,StartTime,EndTime,StartDate,EndDate,IsActive,Note)" +
      " VALUES " +
      " (:TeacherId,:CourseId,:CourseGeneration,:Course_Price,:Class_Discount,:Class_Discount_Price,:Class_Price,:LearningType,:ClassStatus,:ClassShiff,:StartTime,:EndTime,:StartDate,:EndDate,:IsActive,:Note)";
    const [list] = await db.query(sqlInsert, {
      TeacherId,
      CourseId,
      CourseGeneration,
      Course_Price,
      Class_Discount,
      Class_Discount_Price,
      Class_Price,
      LearningType,
      ClassStatus,
      ClassShiff,
      StartTime,
      EndTime,
      StartDate,
      EndDate,
      IsActive,
      Note,
    });
    res.json({
      list: list,
      message: "Insert successfully!",
    });
  } catch (error) {
    logError("classroom.create", error, res);
  }
};

const update = async (req, res) => {
  try {
    var Id = req.body.Id;
    var Name = req.body.Name;
    var Description = req.body.Description;
    var Status = req.body.Status;
    var error = {};
    if (isEmptyOrNull(Id)) {
      error.Id = "Id required!";
    }
    if (isEmptyOrNull(Name)) {
      error.Name = "Name required!";
    }
    if (isEmptyOrNull(Status)) {
      error.Status = "Status requered!";
    }
    if (Object.keys(error).length > 0) {
      res.json({
        error: error,
      });
      return false;
    }

    var parameter = {
      Id: Id,
      Name: Name,
      Description: Description,
      Status: Status,
    };
    const [list] = await db.query("UPDATE category SET Name=:Name ,Description=:Description ,Status=:Status WHERE Id=:Id", parameter);
    res.json({
      list: list,
    });
  } catch (error) {
    logError("category.update", error, res);
  }
};

const remove = async (req, res) => {
  try {
    var Id = req.params.id;
    var error = {};
    if (isEmptyOrNull(Id)) {
      error.Id = "Id required!";
    }
    if (Object.keys(error).length > 0) {
      res.json({
        error: error,
      });
      return false;
    }
    var parameter = {
      Id: Id,
    };
    const [list] = await db.query("DELETE FROM classroom WHERE Id=:Id", parameter);
    res.json({
      list: list,
    });
  } catch (error) {
    logError("classroom.remove", error, res);
  }
};

const student_by_classroom = async (req, res) => {
  try {
    const sql =
      " SELECT " +
      " s.Id StudentId, " +
      " CONCAT(s.FirstName,'-',s.LastName) StudentName, " +
      " s.Tel, " +
      " sr.Discount, " +
      " sr.Discount_Price, " +
      " sr.TotalToPay, " +
      " SUM(p.Payment) TotalPaid, " +
      " COUNT(p.Id) PaidTime " +
      " FROM studentregister sr " +
      " INNER JOIN student s on sr.StudentId = s.Id " +
      " LEFT JOIN studentpayment p on (sr.ClassRoomId = p.ClassRoomId AND sr.StudentId = p.StudentId) " +
      " WHERE sr.ClassRoomId = :ClassRoomId " +
      " GROUP BY sr.ClassRoomId,sr.StudentId ";

    const [list] = await db.query(sql, { ClassRoomId: req.params.id });
    res.json({
      list: list,
    });
  } catch (error) {
    logError("classroom.student_by_classroom", error, res);
  }
};

module.exports = {
  getList,
  getOne,
  create,
  update,
  remove,
  student_by_classroom,
  getCourseGenerationByCourseId,
};
