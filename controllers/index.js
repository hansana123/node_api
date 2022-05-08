const AppError = require("../utils/appError"); // global error handler
const conn = require("../services/db"); // database connection to make crud

const bcrypt = require("bcryptjs"); // for password hashing
const jwt = require("jsonwebtoken"); // genarate json web token

const joi = require("@hapi/joi");

const registerStudentModel = joi.object({
    name: joi.string().min(3).required(),
    age: joi.number().required(),
    rank: joi.number().required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).required(),
});


exports.registerStudent = (req, res, next) => {
    if (!req.body) return next(new AppError("No Form Data", 404));

    const student = {
        name: req.body.name,
        age:  req.body.age,
        rank:  req.body.rank,
        email:  req.body.email,
        password:  req.body.password
    };

    try{
        const { error } =   registerStudentModel.validate(student);
        if( error ) return next(new AppError(error.details[0].message , 400 )) ;

        conn.query(
            "SELECT * FROM students WHERE email = ?",
            [student.email],
            async function (err, data, fields) {
                if (err) return next(new AppError(err, 500));

                if(data.length) return next(new AppError("Email Already Used", 400));
               
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await  bcrypt.hash(student.password , salt);
                console.log( "salt " + salt)
                const values = [student.name, student.age, student.rank ,student.email , hashedPassword ];
                conn.query(
                    "INSERT INTO `students` (`s_id`, `name`, `age`, `rank`, `email`, `password`) VALUES ( NULL , ? );",
                    [values],
                    function (err, data, fields) {
                        if (err) return next(new AppError(err, 500));
                        res.status(201).json({
                            status: "success",
                            message: "student registered!",
                        });
                    }
                );
                
            }
        );


    } catch(error){
        res.status(500).send(error);
    }

};


exports.getAllstudents = (req, res, next) => {
    conn.query("SELECT * FROM students", function (err, data, fields) {
        if (err) return next(new AppError(err))
        res.status(200).json({
            status: "success",
            length: data?.length,
            data: data,
        });
    });
};

exports.deleteStudent = (req, res, next) => {
    if (!req.params.s_id) {
        return next(new AppError("No student s_id found", 404));
    }
    conn.query(
        "DELETE FROM students WHERE s_id=?",
        [req.params.s_id],
        function (err, fields) {
            if (err) return next(new AppError(err, 500));
            res.status(201).json({
                status: "success",
                message: "Student deleted!",
            });
        }
    );
}

exports.updateStudentDetails = (req, res, next) => {
    if (!req.body.s_id) {
        return next(new AppError("No student s_id found", 404));
    }
    conn.query(
        "UPDATE students SET name= ? , age = ? , rank= ?  WHERE s_id = ?",
        [req.body.name, req.body.age, req.body.rank, req.body.s_id],
        function (err, data, fields) {
            if (err) return next(new AppError(err, 500));
            res.status(201).json({
                status: "success",
                message: "student details updated!",
            });
        }
    );
};


exports.getStudent = (req, res, next) => {
    if (!req.params.s_id) {
        return next(new AppError("No student s_id found", 404));
    }
    conn.query(
        "SELECT * FROM students WHERE s_id = ?",
        [req.params.s_id],
        function (err, data, fields) {
            if (err) return next(new AppError(err, 500));
            res.status(200).json({
                status: "success",
                length: data?.length,
                data: data,
            });
        }
    );
};