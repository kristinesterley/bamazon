var mysql = require("mysql");
var inquirer = require("inquirer");
require('console.table');


var connection = mysql.createConnection({
	host: "localhost",
	port: 8889,
	user: "root",
	password: "root",
	database: "Bamazon"
});

inquirer.prompt({
      name: "choice",
      type: "rawlist",
      choices: ["View Product Sales by Department", "Create New Department"],
      message: "Type the number of the function that you would like to perform:"
    }).then(function(answer) {
    	console.log(answer.choice);
    	switch (answer.choice) {
    		case "View Product Sales by Department":
    			connection.query("SELECT department_id, department_name, over_head_costs, total_sales, total_sales - over_head_costs as total_profit FROM departments", function(err,res){		
				console.table(res);
				connection.end();
				});
    			break;
    		case "Create New Department":

    		  	inquirer.prompt([{
				    name: "name",
				    type: "input",
				    message: "Department Name:"
				  }, {
				    name: "overhead",
				    type: "input",
				    message: "Overhead Costs:"
				  }]).then(function(answer) {
				    connection.query("INSERT INTO departments SET ?", {
				      department_name: answer.name,
				      over_head_costs: answer.overhead
				    }, function(err, res) {
				      console.log("Department created successfully!");
				      connection.end();
				    });
				  });

    			break;

    		default:
    			console.log("An error occurred.");
    			connection.end();
    	}//end switch	

  });  	
		