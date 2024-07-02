const db = require("../config/db");
const { logError, isEmptyOrNull } = require("../config/service");

const getList = async (req, res) => {
  try {
    const [list] = await db.query("SELECT * FROM category");
    res.json({
      list: list,
    });
  } catch (error) {
    logError("category.getList", error, res);
  }
};

const getOne = async (req, res) => {
  try {
    var parameter = {
      Id: req.params.id,
    };
    const [list] = await db.query("SELECT * FROM category WHERE Id = :Id", parameter);
    res.json({
      list: list,
    });
  } catch (error) {
    logError("category.getOne", error, res);
  }
};

const create = async (req, res) => {
  try {
    var Name = req.body.Name;
    var Description = req.body.Description;
    var Status = req.body.Status;
    var error = {};
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
      Name: Name,
      Description: Description,
      Status: Status,
    };
    const [list] = await db.query("INSERT INTO category (Name,Description,Status) VALUES (:Name,:Description,:Status)", parameter);
    res.json({
      list: list,
    });
  } catch (error) {
    logError("category.create", error, res);
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
    const [list] = await db.query("DELETE FROM category WHERE Id=:Id", parameter);
    res.json({
      list: list,
    });
  } catch (error) {
    logError("category.remove", error, res);
  }
};

module.exports = {
  getList,
  getOne,
  create,
  update,
  remove,
};
