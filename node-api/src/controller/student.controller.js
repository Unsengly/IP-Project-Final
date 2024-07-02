const db = require("../config/db");
const { logError, isEmptyOrNull } = require("../config/service");

// work database
const getList = async (req, res) => {
  //api/student?key1=value1&key2=value2@keyn=valuen
  const { page, txtSearch, status, fromDate, toDate } = req.query;
  try {
    var sqlTotal = "SELECT COUNT(Id) AS totalRecords FROM student  WHERE 1=1 ";
    var sql = "SELECT * FROM student WHERE 1=1";
    var sqlWhere = "",
      sqlParm = {};
    if (!isEmptyOrNull(txtSearch)) {
      sqlWhere += " AND (FirstName LIKE :txtSearch OR LastName LIKE :txtSearch OR Tel LIKE :txtSearch)";
      sqlParm.txtSearch = "%" + txtSearch + "%";
    }
    if (!isEmptyOrNull(fromDate) && !isEmptyOrNull(toDate)) {
      sqlWhere += " AND CreateAt BETWEEN :fromDate AND :toDate";
      sqlParm.fromDate = fromDate;
      sqlParm.toDate = toDate;
    }
    if (!isEmptyOrNull(status)) {
      sqlWhere += " AND IsActive = :status ";
      sqlParm.status = status;
    }
    const sqlOrder = " ORDER BY Id DESC";
    const pageSize = 10;
    const offest = (page - 1) * pageSize;
    const limit = ` LIMIT  ${offest}, ${pageSize}`;
    const [data] = await db.query(sql + sqlWhere + sqlOrder + limit, sqlParm);
    var totalRecords = 0;
    if (page == 1) {
      const [total] = await db.query(sqlTotal + sqlWhere, sqlParm);
      totalRecords = total[0].totalRecords;
    }
    res.json({
      list: data,
      totalRecords: totalRecords,
    });
  } catch (error) {
    logError("student.getList", error, res);
  }
};

const getOne = async (req, res) => {
  try {
    var sql = "SELECT * FROM student WHERE Id=:Id";
    var param = {
      Id: req.params.id,
    };
    const [data] = await db.query(sql, param);
    res.json({
      list: data,
    });
  } catch (error) {
    logError("student.getOne", error, res);
  }
};
const create = async (req, res) => {
  try {
    var { FirstName, LastName, Gender, Dob, Tel, Image, Email, Current_Address, Note, IsActive, CreateBy } = req.body;
    var error = {};
    if (isEmptyOrNull(FirstName)) {
      error.FirstName = "FirstName Required!";
    }
    if (isEmptyOrNull(LastName)) {
      error.LastName = "LastName Required!";
    }
    if (isEmptyOrNull(Tel)) {
      error.Tel = "Tel Required!";
    }
    if (Object.keys(error).length > 0) {
      res.json({
        error: error,
      });
      return;
    }
    var param = {
      FirstName: FirstName,
      LastName: LastName,
      Gender: Gender,
      Dob: Dob,
      Tel: Tel,
      Image: Image,
      Email: Email,
      Current_Address: Current_Address,
      Note: Note,
      IsActive: IsActive,
      CreateBy: req.user_name,
    };
    const [findstudent] = await db.query("SELECT * FROM student WHERE (Tel=:Tel OR Email=:Email)", param);
    if (findstudent.length > 0) {
      res.json({
        error: {
          acount_exist: "Account Already Exist! Please try other!",
        },
      });
    } else {
      var sql =
        "INSERT INTO student (FirstName, LastName, Gender, Dob, Tel, Image, Email, Current_Address, Note, IsActive, CreateBy) VALUES (:FirstName, :LastName, :Gender, :Dob, :Tel, :Image, :Email, :Current_Address, :Note, :IsActive, :CreateBy)";
      const [data] = await db.query(sql, param);
      res.json({
        list: data,
      });
    }
  } catch (error) {
    logError("student.create", error, res);
  }
};
const update = async (req, res) => {
  try {
    var { FirstName, LastName, Gender, Dob, Tel, Image, Email, Current_Address, Note, IsActive, Id } = req.body;
    var error = {};
    if (isEmptyOrNull(Id)) {
      error.Id = "Id Required!";
    }
    if (isEmptyOrNull(FirstName)) {
      error.FirstName = "FirstName Required!";
    }
    if (isEmptyOrNull(LastName)) {
      error.LastName = "LastName Required!";
    }
    if (isEmptyOrNull(Tel)) {
      error.Tel = "Tel Required!";
    }
    if (Object.keys(error).length > 0) {
      res.json({
        error: error,
      });
      return;
    }
    var param = {
      Id: Id,
      FirstName: FirstName,
      LastName: LastName,
      Gender: Gender,
      Dob: Dob,
      Tel: Tel,
      Image: Image,
      Email: Email,
      Current_Address: Current_Address,
      Note: Note,
      IsActive: IsActive,
    };
    const [findstudent] = await db.query("SELECT * FROM student WHERE (Tel=:Tel OR Email=:Email) AND Id != :Id", param);
    if (findstudent.length > 0) {
      res.json({
        error: {
          acount_exist: "Tel Or Email Already Exist! Please try other!",
        },
      });
    } else {
      var sql =
        "UPDATE  student SET FirstName=:FirstName, LastName=:LastName, Gender=:Gender, Dob=:Dob, Tel=:Tel, Image=:Image, Email=:Email, Current_Address=:Current_Address, Note=:Note, IsActive=:IsActive WHERE Id=:Id";
      const [data] = await db.query(sql, param);
      res.json({
        list: data,
      });
    }
  } catch (error) {
    logError("student.create", error, res);
  }
};
const remove = async (req, res) => {
  try {
    var sql = "DELETE FROM student WHERE Id=:Id";
    var param = {
      Id: req.params.id,
    };
    const [data] = await db.query(sql, param);
    res.json({
      list: data,
    });
  } catch (error) {
    logError("student.remove", error, res);
  }
};

const studentRegisterGetList = async (req, res) => {
  try {
    var sql =
      " SELECT  " +
      " s.FirstName, " +
      " s.LastName, " +
      " s.Tel, " +
      " concat(c.Name,'-G',cr.CourseGeneration) as CourseName, " +
      " sr.* , " +
      " cr.LearningType, " +
      " cr.ClassShiff, " +
      " cr.Note, " +
      " cr.StartTime, " +
      " cr.EndTime, " +
      " cr.StartDate, " +
      " cr.EndDate, " +
      " cr.Class_Price, " +
      " SUM(sp.Payment) as Paid " +
      " FROM `studentregister` sr  " +
      " INNER JOIN student s on sr.StudentId = s.Id " +
      " INNER JOIN classroom cr on sr.ClassRoomId = cr.Id " +
      " INNER JOIN course c on cr.CourseId = c.Id " +
      " LEFT JOIN studentpayment sp on (sr.ClassRoomId = sp.ClassRoomId and sr.StudentId = sp.StudentId) " +
      " GROUP BY sr.ClassRoomId,sr.StudentId " +
      " ORDER BY sr.CreateAt DESC ";
    const [classroom] = await db.query("SELECT cr.*,c.Name as CourseName FROM classroom cr INNER JOIN course c on cr.CourseId = c.Id");
    const [student] = await db.query("SELECT * FROM student");

    const [data] = await db.query(sql);
    res.json({
      list: data,
      student,
      classroom,
    });
  } catch (error) {
    logError("studentRegisterGetList", error, res);
  }
};

// ClassRoomId, StudentId Discount, Discount_Price, TotalToPay
// Payment, PaymentMethod, PaymentDate

const studentRegisterCreate = async (req, res) => {
  try {
    var sqlRegister =
      " INSERT INTO studentregister " +
      " (ClassRoomId, StudentId, Discount, Discount_Price, TotalToPay, IsCompletedPaid, Note, RegisterAt) " +
      " VALUES " +
      " (:ClassRoomId, :StudentId, :Discount, :Discount_Price, :TotalToPay, :IsCompletedPaid, :Note, 'NOW()') ";

    var sqlPayment =
      " INSERT INTO studentpayment " +
      " ( ClassRoomId, StudentId, Payment, PaymentMethod, PaymentDate, ImageRef, Note ) " +
      " VALUES " +
      " ( :ClassRoomId, :StudentId, :Payment, :PaymentMethod, :PaymentDate, null, null) ";

    var { ClassRoomId, StudentId, Discount, Discount_Price, TotalToPay, Payment, PaymentMethod, PaymentDate } = req.body;
    const [register] = await db.query(sqlRegister, req.body);
    if (!isEmptyOrNull(Payment) && !isEmptyOrNull(PaymentMethod) && !isEmptyOrNull(PaymentDate)) {
      const [payment] = await db.query(sqlPayment, req.body);
    }

    res.json({
      list: register,
      message: "Insert successfully",
    });
  } catch (error) {
    logError("studentRegisterCreate", error, res);
  }
};

const studentPayment = async (req, res) => {
  try {
    var sql = "";
    var param = {
      Id: req.params.id,
    };
    const [data] = await db.query(sql, param);
    res.json({
      list: data,
    });
  } catch (error) {
    logError("studentPayment.remove", error, res);
  }
};

module.exports = {
  getList,
  create,
  update,
  remove,
  getOne,
  studentRegisterGetList,
  studentRegisterCreate,
  studentPayment,
};
