const db = require("../config/db");
const { logError, isEmptyOrNull, removeFile } = require("../config/service");

const getList = async (req, res) => {
  try {
    const { categoryId, txtSearch, status } = req.query;
    const sqlParam = req.query;
    var sql = "SELECT " + " c.* ," + " ct.Name as CategoryName " + " FROM  course c " + " INNER JOIN category ct ON (c.CategoryId = ct.Id )" + " WHERE 1=1 ";
    var sqlWhere = "";
    if (!isEmptyOrNull(categoryId)) {
      sqlWhere += " AND c.CategoryId = :categoryId ";
    }
    if (!isEmptyOrNull(txtSearch)) {
      sqlWhere += " AND (c.Name LIKE :txtSearch OR c.Description LIKE :txtSearch OR ct.Name LIKE :txtSearch )";
      sqlParam.txtSearch = "%" + txtSearch + "%";
    }
    if (!isEmptyOrNull(status)) {
      sqlWhere += " AND c.IsActive = :status ";
    }
    const [list] = await db.query(sql + sqlWhere, sqlParam);
    const [category] = await db.query("SELECT * FROM category");
    res.json({
      list: list,
      category: category,
    });
  } catch (error) {
    logError("course.getList", error, res);
  }
};

const getOne = async (req, res) => {
  try {
    var parameter = {
      Id: req.params.id,
    };
    const [list] = await db.query("SELECT * FROM course WHERE Id = :Id", parameter);
    res.json({
      list: list,
    });
  } catch (error) {
    logError("course.getOne", error, res);
  }
};

const create = async (req, res) => {
  try {
    var { CategoryId, Name, Description, TotalHour, Price, IsActive } = req.body;
    var error = {};
    if (isEmptyOrNull(CategoryId)) {
      error.CategoryId = "CategoryId required!";
    }
    if (isEmptyOrNull(Name)) {
      error.Name = "Name requered!";
    }
    if (Object.keys(error).length > 0) {
      res.json({
        error: error,
      });
      return false;
    }
    var Image = null;
    if (req.file) {
      Image = req.file.filename;
    }
    const [list] = await db.query(
      "INSERT INTO course (CategoryId, Name, Description, Image, TotalHour, Price, IsActive) VALUES (:CategoryId, :Name, :Description, :Image, :TotalHour, :Price, :IsActive)",
      {
        CategoryId,
        Name,
        Description,
        Image,
        TotalHour,
        Price,
        IsActive,
      }
    );
    res.json({
      list: list,
      message: "Insert successfully!",
    });
  } catch (error) {
    logError("category.create", error, res);
  }
};

const update = async (req, res) => {
  try {
    var { Id, CategoryId, Name, OldImage, Description, TotalHour, Price, IsActive } = req.body;
    var error = {};
    if (isEmptyOrNull(Id)) {
      error.Id = "Id required!";
    }
    if (isEmptyOrNull(CategoryId)) {
      error.CategoryId = "CategoryId required!";
    }
    if (isEmptyOrNull(Name)) {
      error.Name = "Name requered!";
    }
    if (Object.keys(error).length > 0) {
      res.json({
        error: error,
      });
      return false;
    }
    var Image = null;
    if (req.file) {
      Image = req.file.filename;
    } else {
      Image = OldImage;
      if (req.body.isRemoveFile == "true") {
        Image = null;
      }
    }
    const [list] = await db.query(
      "UPDATE course SET CategoryId=:CategoryId, Name=:Name, Description=:Description, Image=:Image, TotalHour=:TotalHour, Price=:Price, IsActive=:IsActive WHERE Id = :Id",
      {
        Id,
        CategoryId,
        Name,
        Description,
        Image,
        TotalHour,
        Price,
        IsActive,
      }
    );
    // try remove file in server.
    if (!isEmptyOrNull(OldImage) && req.file) {
      await removeFile(OldImage);
    } else if (!isEmptyOrNull(OldImage) && req.body.isRemoveFile == "true") {
      await removeFile(OldImage);
    }

    res.json({
      list: list,
      message: "Update successfully!",
    });
  } catch (error) {
    logError("course.update", error, res);
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
      OldImage: req.body.OldImage,
    };
    await removeFile(req.body.OldImage);
    const [list] = await db.query("DELETE FROM course WHERE Id=:Id", parameter);
    res.json({
      list: list,
    });
  } catch (error) {
    logError("course.remove", error, res);
  }
};

module.exports = {
  getList,
  getOne,
  create,
  update,
  remove,
};
