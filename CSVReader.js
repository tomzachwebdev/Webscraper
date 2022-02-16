const fs = require('fs')
const csv = require('csv-parser');
const { Module } = require('module');


const readCSV = () => {
    const products = [];

    fs.createReadStream('inventory.csv')
    .pipe(csv())
    .on('data', (row) => {

        const title = row.Description
        const weight = row["Product Weight"];

        
        // const product = {
        //     title: title,
        //     weight: weight
        // };

        products.push(row);
        // if(product.title !== '' && product.weight !== ''){
        //     products.push(product);
        //     // products.push(row);
        // }
    })
    .on('end', () => {
        // console.table(products);
        // TODO: SAVE users data to another file
        return products;
        })

        // return products;
}

// console.table(readCSV());

exports.readCSV = readCSV;
