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
      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
      message: "Type the number of the function that you would like to do:"
    }).then(function(answer) {
    	console.log(answer.choice);
    	switch (answer.choice) {
    		case "View Products for Sale":
    			connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function(err,res){		
				console.table(res);
				connection.end();
				});
    			break;
    		case "View Low Inventory":
    		    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products WHERE stock_quantity < 5", function(err,res){		

				if (res.length > 0) {
					console.table(res);
				}
				else {
					console.log("No items with low inventory!")
				}
				connection.end();
				});

    			break;
    		case "Add to Inventory":

    			connection.query("SELECT item_id, product_name, price FROM products", function(err,res){		
					console.table(res);

	  				inquirer.prompt([{
	    				name: "item",
	    				type: "input",
	    				message: "Enter the ID number of the item you would like to update:"
	  					}, {
	    				name: "quantity",
	    				type: "input",
	    				message: "Type in the correct stock quantity:"
	  				}]).then(function(answer) {
	  					connection.query("UPDATE products SET ? WHERE ?",[{
							stock_quantity: answer.quantity
							}, {
							item_id: answer.item
							}], function(err, res){
								console.log("Stock quantity updated!");
								connection.end();
							});
 						});
				});	

    			break;
    		case "Add New Product":

    		  	inquirer.prompt([{
				    name: "item",
				    type: "input",
				    message: "Product Name:"
				  }, {
				    name: "department",
				    type: "input",
				    message: "Product Department:"
				  }, {
				    name: "price",
				    type: "input",
				    message: "Price:"
				  }, {
				  	name: "quantity",
				  	type: "input",
				  	message: "Quantity:"
				  

				  }]).then(function(answer) {

	  					//check to see if the department specified is in the departments table - if it is proceed, otherwise tell them to get
	  					// a supervisor to add the new department
	  					connection.query("SELECT * FROM departments WHERE department_name = '" + answer.department + "'", function(err, res){
	  						if (res.length > 0 ){
	  							connection.query("INSERT INTO products SET ?", {
				      			product_name: answer.item,
				      			department_name: answer.department,
				      			price: answer.price,
				      			stock_quantity: answer.quantity
				    			}, function(err, res) {
				      				console.log("Product created successfully!");
				     				connection.end();
				    			});
	  						}
	  						else {
	  							console.log("Invalid Department. See your Supervisor to add a new department.");
	  							connection.end();
	  						}

	  					});
				  });

    			break;
    		default:
    			console.log("Invalid choice.");
    			connection.end();
    	}//end switch
    });