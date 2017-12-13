
const MySQL = require('mysql');
const Inquirer = require('inquirer');

const sqlCredentials = require('./sqlCredentials');
const connection = MySQL.createConnection(sqlCredentials);


purchaseProduct().then(function() {
    console.log("done");
});


async function purchaseProduct() {
    const productIdArr = await getProductId().catch( (err) => {
        console.error(err)
    });

    console.log("Product ID ===============");
    console.log( productIdArr );

    

    return;
}

async function getProductId() {
    const query = 'SELECT item_id, product_name, price FROM products';

    var result = new Promise( ( resolve, reject ) => {
        connection.query(query, async function(err, res){
            if(err) reject(err);

            resolve(res);
        });
    });

    return result;
}

