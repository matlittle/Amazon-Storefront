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
        name: "View Product Sales by Department",
        value: "sales"
    },
    {
        name: "Create New Department",
        value: "create"
    }];
}

async function handleAction(action) {
    switch(action) {
        case "sales":
            const sales = await selectDepartmentSales().catch(logError);
            return displayTable(sales);
        case "create":
            return addNewDepartment();
    }
}

async function selectDepartmentSales() {
    const query = 
    `SELECT d.department_id,  d.department_name, d.over_head_costs, 
        SUM(p.product_sales) AS product_sales, SUM(p.product_sales) - d.over_head_costs AS total_profit
        FROM departments AS d
        LEFT JOIN products AS p ON d.department_name = p.department_name
        GROUP BY p.department_name`;

    return new Promise( (resolve, reject) => {
        connection.query(query, async (err, res) => {
            if(err) reject(err);
            resolve(res);
        });
    });
}

async function addNewDepartment() {
    const department = await newDepartmentPrompt().catch(logError);

    department.over_head_costs = parseFloat(department.over_head_costs);

    await insertNewDepartment(department).catch(logError);

    return console.log(`\nNew department '${department.department_name}' added.\n`);
}

async function newDepartmentPrompt() {
    const questions = [{
        message: "New department name",
        type: "input", 
        name: "department_name"
    },
    {
        message: "New department overhead costs",
        type: "input", 
        name: "over_head_costs"
    }];

    return Inquirer.prompt(questions);
}

async function insertNewDepartment(department) {
    const query = `INSERT INTO departments SET ?`;

    return new Promise( (resolve, reject) => {
        connection.query(query, [department], async (err, res) => {
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
