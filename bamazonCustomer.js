
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

    var productDisplayArr = [];

    productIdArr.forEach( (product) => {
        let str = `ID: ${product.item_id}  |  `
            + `Name: ${product.product_name}  |  `
            + `Price: ${product.price}`;
        productDisplayArr.push(str);
    });

    console.log("Product ID ================================================");
    console.log( productIdArr );

    console.log("Product Display ===========================================");
    console.log( productDisplayArr );

    

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

