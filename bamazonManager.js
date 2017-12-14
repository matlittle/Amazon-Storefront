
const MySQL = require('mysql');
const Inquirer = require('inquirer');

const sqlCredentials = require('./sqlCredentials');
const connection = MySQL.createConnection(sqlCredentials);

require('console.table');


init()

async function init() {
    console.log('\n');

    const answer = await getAction();

    await handleAction(answer.action).catch(logError);

    const another = await promptNewAction();

    if(another.bool) {
        return init();
    }

    return endConnection();
}


async function getAction() {
    const actions = buildActionChoices();

    const questions = [{
        message: "What would you like to do?",
        type: "list", 
        choices: actions,
        name: "action"
    }];

    return Inquirer.prompt(questions);
}

function buildActionChoices() {
    return [{
        name: "View Products for Sale",
        value: "products"
    },{
        name: "View Low Inventory",
        value: "low"
    },{
        name: "Add to Inventory",
        value: "addInv"
    },{
        name: "Add New Product",
        value: "addProd"
    }];
}

async function handleAction(action) {
    switch(action) {
        case "products":
            const products = await selectAllProducts().catch(logError);
            return displayTable(products);
        case "low":
            const lowInv = await showLowInventory().catch(logError);
            if(lowInv.length === 0) {
                return console.log("\nNo items with less than 5 in stock\n");
            }
            return displayTable(lowInv);
        case "addInv":
            return addInventory();
        case "addProd":
            return addNewProduct();
    }
}

async function selectAllProducts() {
    const query = `SELECT * FROM products`;

    return new Promise( (resolve, reject) => {
        connection.query(query, async (err, res) => {
            if(err) reject(err);
            resolve(res);
        });
    });
}

async function showLowInventory() {
    const query = `SELECT * FROM products WHERE stock_quantity < 5`;

    return new Promise( (resolve, reject) => {
        connection.query(query, async (err, res) => {
            if(err) reject(err);
            resolve(res);
        });
    });
}

async function addInventory() {
    const productArr = await selectAllProducts().catch(logError);
    const choices = buildProductList(productArr);

    const answer = await getProductSelection(choices);

    const product = productArr.find( (obj) => {
        return obj.item_id === answer.item;
    });

    const newTotal = parseInt(answer.count) + product.stock_quantity;

    await updateInventory(answer.item, newTotal).catch(logError);

    return console.log(`\nInventory added.\n` +
        `${product.product_name} - New Stock: ${newTotal}\n`);
}

async function addNewProduct() {
    const newProduct = await newProductPrompt();

    newProduct.price = parseFloat(newProduct.price);
    newProduct.stock_quantity = parseInt(newProduct.stock_quantity);

    await insertNewProduct(newProduct);

    return console.log(`\nNew product '${newProduct.product_name}' added.\n`);
}

function buildProductList(arr) {
    let qArr = [];
    
    arr.forEach( (p) => {
        qArr.push( {
            name: `Product: ${p.product_name.padEnd(10)}  |  `
                + `Stock: ${p.stock_quantity.toString().padEnd(3)}  `,
            value: p.item_id
        });
    });

    return qArr;
}

async function getProductSelection(choices) {
    const questions = [{
        message: "Which item would you like to add inventory to?",
        type: "list", 
        choices: choices,
        name: "item",
        pageSize: 15
    },
    {
        message: "How much would you like to add?",
        type: "input", 
        name: "count"
    }];

    return Inquirer.prompt(questions);
}

async function updateInventory(id, total) {
    const query = 
    `UPDATE products
        SET stock_quantity=${total}
        WHERE item_id=${id}`;

    return new Promise( (resolve, reject) => {
        connection.query(query, async (err, res) => {
            if(err) reject(err);
            resolve(res);
        });
    });
}

async function newProductPrompt() {
    const questions = [{
        message: "New product department",
        type: "input", 
        name: "department_name"
    },
    {
        message: "New product name",
        type: "input", 
        name: "product_name"
    },
    {
        message: "New product price (##.## format)",
        type: "input", 
        name: "price"
    },
    {
        message: "New product stock quantity",
        type: "input", 
        name: "stock_quantity"
    }];

    return Inquirer.prompt(questions);
}

async function insertNewProduct(product) {
    const query = `INSERT INTO products SET ?`;

    return new Promise( (resolve, reject) => {
        connection.query(query, [product], async (err, res) => {
            if(err) reject(err);
            resolve(res);
        });
    });
}

async function promptNewAction() {
    const question = [{
        message: "Would you like to do something else?",
        type: "confirm", 
        name: "bool"
    }];

    return Inquirer.prompt(question);
}


function displayTable(table) {
    console.log('\n');
    console.table(table);
    console.log('\n');
}

function logError(err) {
    console.error(err);
}

function endConnection() {
    connection.end( (err) => {
        if(err) console.error(err);
    });
}







