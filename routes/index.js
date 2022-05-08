const express = require("express");
const controllers = require("../controllers");
const router = express.Router();

router.route("/")
  	.get(controllers.getAllstudents)
  	.post(controllers.registerStudent)
	.put(controllers.updateStudentDetails);

router.route("/:s_id")
 	.get(controllers.getStudent)
 	.delete(controllers.deleteStudent);

module.exports = router;