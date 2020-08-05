/*
Import external packages here
*/

/*
Import project packages here
*/
const { Employee } = require("../models/employee");
const { response } = require("express");

const createEmployee = (request, response) => {
    const childLogger = request.logger.child({
        controllerName: "createEmployee",
    })
    childLogger.info({req: request});
    Employee.findOne({
        code: request.body.code
    })
    .then((entry) => {
			if(entry) {
				return response.status(409).json({
					status: false,
					error: {
							error: 'ConflictError',
							message: 'A Code has already present'
					}
			})
			}
			const employeeData = new Employee(request.body);
			employeeData.save()
			.then((saveData) => {
					response.status(200).json({
							status: true,
							data: saveData
					})
			})
			.catch((saveError) => {
					response.status(500).json({
							status: false,
							error: {
									error: saveError.name,
									message: saveError.message
							}
					})
			})
    }) .catch(fetchError => response.status(500).json({
        status: false,
        error: {
          error: fetchError.name,
          message: fetchError.message,
        },
      }));

}

const getEmployeeData = (request, response) => {
	const childLogger = request.logger.child({
		controllerName: "getEmployeeData",
})
childLogger.info({req: request});
    Employee.findOne({code: request.params.code})
    .then((employee) => {
        if(!employee) {
            return response.status(404).json({
                status: false,
                error: {
                    error: 'NotFoundError',
                    message:`Employee with code ${request.params.code} not found`
                }
            })
        }
        joingDate = new Date(employee.dateOfJoining)
    
        endFinancialYear = new Date(employee.dateOfJoining)
        let currentYear = new Date().getFullYear()
            if(endFinancialYear.getMonth() > 2){
        endFinancialYear.setYear(endFinancialYear.getFullYear()+1)
        }
        endFinancialYear.setMonth(2)
        endFinancialYear.setDate(31)
       
      
        workingDays = Math.ceil(Math.abs( endFinancialYear - joingDate) / (1000 * 60 * 60 * 24)); 
 
        salaryPerDay = employee.salary / 30
        totalYearlySalary= workingDays*salaryPerDay
        employee = employee.toJSON()
        if(totalYearlySalary >250000 && totalYearlySalary <=500000) {
            employee.tax = (totalYearlySalary*5)/100
        } else if(totalYearlySalary > 500000 && totalYearlySalary <=1000000) {
            employee.tax = (totalYearlySalary*10)/100
        } else if(totalYearlySalary>1000000) {
            employee.tax = (totalYearlySalary*20)/100
        } else {
            employee.tax = "No Tax Deduction"
        }

        if(totalYearlySalary >2500000) {
            employee.cessAmount = (totalYearlySalary*2)/100
        } else {
            employee.cessAmount = "No Cess Deduction"
        }

        employeeDetails = {
            "employeeCode": employee.code,
            "firstName": employee.firstName, 
            "lastName": employee.lastName, 
            "yearlySalary": totalYearlySalary.toFixed(2),
            "taxAmount": employee.tax, 
            "cessAmount": employee.cessAmount,
            "workingDays": workingDays,
            "salaryPerDay": salaryPerDay.toFixed(2)
        }

        return response.status(200).json({
            status: true,
            data: employeeDetails
        })
    })
    .catch((fetchError) => response.status(500).json({
        status: false,
        error: {
            error: fetchError.name,
            message: fetchError.message
        }
    }))
}

module.exports={
    createEmployee,
    getEmployeeData
}