// Code,Barcode,Description,Product Weight,Price/Unit,Price/Case,"Unit  
// Quantity",Supervison

// const webscaper = require("./WebScraper")

const { Module } = require('module');
const serpAPI = require('./SerpAPI-promise');
const csv = require('csvtojson');
const converter = require("json-2-csv");
const fs = require("fs");

const csvFilePath='./test-csv.csv'


const readWriteCSV = async () => {
 

    try{

        products = [];
        const jsonArray = await csv().fromFile(csvFilePath);
    
        let json2csvCallback = function (err, csv) {
            if (err) throw err;
            fs.writeFile('output-file.csv', csv, 'utf8', function(err) {
            if (err) {
                console.log('Some error occured - file either not saved or corrupted file saved.');
            } else {
                console.log('It\'s saved!');
            }
            });
        };
        

        const rows = await Promise.all(jsonArray.map((row)=>{return serpAPI.performRequest(row)})).then((rows)=>{
            // console.table(rows);
            // console.log("Rows returned from promise: " + rows);

            console.log("rows returned: " + rows.length);

            converter.json2csv(rows, json2csvCallback, {
                prependHeader: true     // removes the generated header of "value1,value2,value3,value4" (in case you don't want it)
            });

            return rows;
        }).catch((err) => {
            console.log("err in index read write: " + err);
            return err;
        })

        
        // console.log("rows: " + JSON.stringify(rows));

        // console.log("rows: " + rows);  
            
    }catch(err){
        console.log("error: " + err);
    }
    



 
}

// const readCSV = async () => {
//     var products = [];

//     fs.createReadStream('test-csv.csv')
//     .pipe(csv())
//     .on('data', (row) => {
//         products.push(row);
//     })
//     .on('end', () => {
//         // console.table(products);
//         // TODO: SAVE users data to another file

//         products = products.splice(0,10)
//         const promises = products.map((product) => {
//             return webscaper.iterativeAverage(product,1);
//         })

//         // console.table(promises);
//         Promise.all(promises).then((result) => {
//             console.table(result);
//         }).catch((err) => {
//             console.log("err: " + err);
//             return err;
//         })
//         return products;
//         })
// }

// readCSV(); 
readWriteCSV()

