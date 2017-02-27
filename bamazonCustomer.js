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
	connection.query("SELECT price, stock_quantity, product_sales FROM products WHERE item_id = " + itemId, function(err,res){
		if (res[0].stock_quantity < requestQuantity){
			console.log("Insufficient Quantity!");
			connection.end();
		}//end if
		else {
			var total_cost = res[0].price*requestQuantity;
			connection.query("UPDATE products SET ? WHERE ?",[{
				stock_quantity: res[0].stock_quantity - requestQuantity,
				product_sales: res[0].product_sales + total_cost
			}, {
				item_id: itemId
			}], function(err, res){
				console.log("Order Filled! Your purchase total: $" + total_cost);
				connection.end();
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