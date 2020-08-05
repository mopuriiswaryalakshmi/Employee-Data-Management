/*
Import external packages here
*/
const router = require('express').Router();

/*
Import project packages here
*/
const {createEmployee, getEmployeeData } = require('../controllers/employee');
const {employeeValidatorFor} = require('../validations/employee')

router
.post('/employee', createEmployee, employeeValidatorFor(createEmployee.name))
.get('/employee/:code', getEmployeeData)

module.exports = router;