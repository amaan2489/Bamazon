var mysql = require('mysql');
const prompts = require('prompts');

var sql = "Select * from products";


var connection = mysql.createConnection({
  host: 'localhost',
  database: 'bamazon',
  user: 'root',
  password: 'salesforce',
});

let questions = [
  {
    type: 'text',
    name: 'id',
    message: 'Which product you would like to buy? Enter the id:'
  },
  {
    type: 'number',
    name: 'quantity',
    message: 'How much would you like to buy?'
  }];

const start = async function (a, b) {


  connection.query(sql, function (err, result) {
    if (err) throw err;

    result.forEach((result) => {
      console.log(`${result.item_id} | ${result.product_name} | ${result.department_name} | ${result.price} | ${result.stock_quantity}`);
      console.log("---------------------------------------------------------------------\n");
    });
  });



  let response = await prompts(questions);

  var id = response.id;
  var quantity = response.quantity;

  connection.query('select price, stock_quantity, product_name from products where item_id = ?', id, function (err, result) {
    if (err) throw err;



    calculate_quantity(id, response.quantity, result[0].stock_quantity, result[0].price, result[0].product_name);

  });

}



function calculate_quantity(id, customerInputQuantity, DBQuantity, productPrice, productname) {


  if (customerInputQuantity > DBQuantity) {

    console.log("Insufficient Quantity!!");

  }

  else if (customerInputQuantity <= DBQuantity) {

    var remainingQuantity = DBQuantity - customerInputQuantity;
    var amountCharged = productPrice * customerInputQuantity;

    connection.query('UPDATE products SET stock_quantity = ? WHERE item_id = ? ', [remainingQuantity, id], function (err, result) {
      if (err) throw err;
      console.log("---------------------------------------------------------------------\n");

      console.log("Your purchase is successfull, Thank you for placing an order with us!");
      console.log("Here is your purchase Summary: Item - " + productname + "| Quantity - " + customerInputQuantity + "| Total Price - " + amountCharged);
      connection.end();

    });

  }
}

start();

