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




function processBuyRequest(itemId, requestQuantity){	
	//get stock quantity again in case some has been sold while customer was making decision
	connection.query("SELECT price, stock_quantity, product_sales, department_name FROM products WHERE item_id = " + itemId, function(err,res){
		if (res[0].stock_quantity < requestQuantity){
			console.log("Insufficient Quantity!");
			connection.end();
		}//end if
		else {
			var total_cost = res[0].price*requestQuantity;
			var dept = res[0].department_name;
			connection.query("UPDATE products SET ? WHERE ?",[{
				stock_quantity: res[0].stock_quantity - requestQuantity,
				product_sales: res[0].product_sales + total_cost
			}, {
				item_id: itemId
			}], function(err, res){
				console.log("Order Filled! Your purchase total: $" + total_cost);
				//get the total sales for the current department
				var query = "SELECT total_sales FROM departments WHERE department_name = '" + dept + "'";
				connection.query(query, function(err,result){
					//add current sale to total sales for the given department
					var total_sales_prev = result[0].total_sales;
					//update the department's total sales to reflect this purchase

					var new_total = total_cost + total_sales_prev;

					connection.query("UPDATE departments SET ? WHERE ?", [{
						total_sales: new_total
						},{
						department_name: dept
					}], function(err,res){
						console.log("total sales update in department table");
						connection.end();
					});
				});
				
			});
		}//end else
		});
} 


function start() {
	connection.query("SELECT item_id, product_name, price FROM products", function(err,res){		
		console.table(res);

	  	inquirer.prompt([{
	    	name: "item",
	    	type: "input",
	    	message: "Enter the ID number of the item you would like to purchase:"
	  	}, {
	    	name: "quantity",
	    	type: "input",
	    	message: "How many would you like to buy?"
	  	}]).then(function(answer) {
	  		processBuyRequest(answer.item, answer.quantity);
  			});
	});	
}

start();