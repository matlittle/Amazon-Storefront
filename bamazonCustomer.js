
const MySQL = require('mysql');
const Inquirer = require('inquirer');

const sqlCredentials = require('./sqlCredentials');
const connection = MySQL.createConnection(sqlCredentials);


purchaseProduct();


async function purchaseProduct() {
    const productArr = await getProductList().catch( (err) => {
        console.error(err)
    });

    const choices = buildProductQuestions(productArr);
    
    const answer = await productSelectionPrompt(choices).catch( (err) => {
        console.error(err);
    });

    const product = productArr.find( (obj) => {
        return obj.item_id === answer.item;
    });

    const numInStock = await checkStock(answer.item);

    if( numInStock > parseInt(answer.count) ) {
        await performTransaction(answer, numInStock);
        let total = (parseInt(answer.count) * product.price).toFixed(2);;
        console.log(`\nYour total will be $${total}\n`);
    } else {
        console.log("\nInsufficent quantity in stock!\n");
    }

    const another = await newTransactionPrompt()
    console.log('\n');

    if(another.bool) {
        return purchaseProduct();
    }

    return endConnection();
}

async function getProductList() {
    const query = 'SELECT item_id, product_name, price FROM products';

    return new Promise( ( resolve, reject ) => {
        connection.query(query, async (err, res) => {
            if(err) reject(err);

            resolve(res);
        });
    });
}

function buildProductQuestions(arr) {
    let qArr = [];
    
    arr.forEach( (p) => {
        let obj = {
            name: `${p.product_name.padEnd(15)}   `
                + `$${p.price.toFixed(2)}`,
            value: p.item_id
        };

        qArr.push(obj);
    });

    return qArr;
}

async function productSelectionPrompt(choices) {
    const questions = [{
        message: "Which item would you like to purchase?",
        type: "list", 
        choices: choices,
        name: "item",
        pageSize: 15
    },
    {
        message: "How many would you like to purchase?",
        type: "input", 
        name: "count"
    }];

    return Inquirer.prompt(questions);
}

async function checkStock(id) {
    const query = 'SELECT stock_quantity FROM products WHERE item_id = ?';
    
    return new Promise( ( resolve, reject ) => {
        connection.query(query, [id], async (err, res) => {
            if(err) reject(err);

            resolve(res[0].stock_quantity);
        });
    });
}

async function performTransaction(answer, stock) {
    const query = `UPDATE products
                    SET stock_quantity=${stock - parseInt(answer.count)}
                    WHERE item_id=${answer.item}`;
    
    return new Promise ( (resolve, reject) => {
        connection.query(query, async (err, res) => {
            if(err) reject(err);
            resolve(true);
        });
    });
}

async function newTransactionPrompt() {
    const questions = [{
        message: "Would you like to purchase another item?",
        type: "confirm", 
        name: "bool"
    }];

    return Inquirer.prompt(questions);
}


function endConnection() {
    connection.end( (err) => {
        if(err) console.error(err);
    });
}

