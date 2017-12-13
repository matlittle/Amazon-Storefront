
const MySQL = require('mysql');
const Inquirer = require('inquirer');

const sqlCredentials = require('./sqlCredentials');
const connection = MySQL.createConnection(sqlCredentials);


purchaseProduct().then(function() {
    console.log("done");
});


async function purchaseProduct() {
    const productId = await getProductId();

    console.log("Product ID ===============");
    console.log( productId );

    return;
}

async function getProductId() {
    const query = 'SELECT item_id, product_name, price FROM products';

    var result = new Promise(resolve => {
        connection.query(query, async function(err, res){
            if(err) reject(err);

            resolve(res);
        });
    }, reject => { });
    
    return result;
}
