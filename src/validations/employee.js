/*
 *  Import external packages here;
 */
const Joi = require('@hapi/joi');

/*
 *  Import project packages here;
 */
const { createEmployee } = require('../controllers/employee');


//  eslint-disable-next-line consistent-return
const createEmployeeValidator = (request, response, next) => {
  const employeeSchema = Joi.object().keys({
    code: Joi.string().required().label("Employee Code"),
    firstName: Joi.string().required().label("Employee First Name"),
    lastName: Joi.string().required().label("Employee Last Name"),
    email: Joi.string().required().label("Employee Email"),
    phoneNumber: Joi.array().items(Joi.string()).max(14).required().label("Employee Phone Nummber"),
    dateOfJoining: Joi.date().required("Employee Date of Joining"),
    salary: Joi.number().label("Employee Salary")
  });
  const { error } = Joi.validate(request.body, employeeSchema, { abortEarly: false });
  if (error) {
    return response.status(400).json({
      status: false,
      error: {
        error: 'BadRequestError',
        message: 'Request doesn\'t contain all the required fields.',
        errors: error.details.map(detail => detail.message),
      },
    });
  }
  next();
};


const employeeValidatorFor = methodType => (request, response, next) => {
  switch (methodType) {
    case createEmployee.name:
      //  do something here;
      createEmployeeValidator(request, response, next);
      break;
    default:
      throw new Error(`Unknown method type '${methodType}' used for validation.`);
  }
};


module.exports = {
  employeeValidatorFor,
};
