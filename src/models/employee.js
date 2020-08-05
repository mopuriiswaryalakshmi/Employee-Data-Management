/*
Import external packages here
*/

const mongoose = require('mongoose')

/* 
Import project packages here
*/
const { Schema } = mongoose;

const EmployeeSchema = new Schema({
    code: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: [{
        type: String,
        require: true
    }],
    dateOfJoining: {
        type: Date,
        required: true
    },
    salary: {
        type: Number,
        required: true
    }
}, {
        timestamps: {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt',
        },
})

const Employee = mongoose.model('employee',EmployeeSchema,'employee')

module.exports = {
    Employee
}