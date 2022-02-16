const SerpApi = require('google-search-results-nodejs');
const fs = require('fs')
const csv = require('csv-parser');
const { Module } = require('module');
const search = new SerpApi.GoogleSearch("766c06ffa652f3abbca080827200471be8ead299fe66d30551f98849bf1b1123");

const api_key = "766c06ffa652f3abbca080827200471be8ead299fe66d30551f98849bf1b1123"

const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const { title } = require('process');

const csvWriter = createCsvWriter({
    path: './output-file.csv',
    header: [
        {id: 'Code', title: 'Code'},
        {id: 'Barcode', title: 'Barcode'},
        {id: 'Description', title: 'Description'},
        {id: 'Product Weight', title: 'Product Weight'},
        {id: 'Price/Unit', title: 'Price/Unit'},
        {id: 'Price/Case', title: 'Price/Case'},
        {id: "Unit Quantity", title: "Unit Quantity"},
        {id: "Supervision", title: "Supervision"},
        {id: "google_price", title: "google_price"}
    ]
});

const params = {
    engine: "google",
    q: "silan",
    location: "New York, New York, United States",
    google_domain: "google.com",
    gl: "us",
    hl: "en",
    num: "1",
    tbm: "shop",
  };

function median(values){
if(values.length ===0) throw new Error("No inputs");

values.sort(function(a,b){
    return a-b;
});

var half = Math.floor(values.length / 2);

if (values.length % 2)
    return values[half];

return (values[half - 1] + values[half]) / 2.0;
}


var rows = [];
var products = [];

const readCSV = async () => {
    
    

    fs.createReadStream('test-csv.csv')
    .pipe(csv())
    .on('data', (row) => {
        rows.push(row);
        
    })
    .on('end', () => {
        // console.table(products);
        // TODO: SAVE users data to another file
        console.table(rows);
        rows.forEach((r) => {
            var weight = r["Product Weight"];
            var weight = Math.round(weight.split(" ")[0].match(/\d+/g)[0]) + " " + weight.match(/[a-zA-Z]+/g)[0];
            // var weight = row["Product Weight"]
            var description = r.Description;
            // console.log("weight: " + weight);
            // console.log("description: " + description);
            const searchString = description + " " + weight;
            params.q = searchString;
            // params.row = row;

            const callback = function(data,row) {
                // console.log(data['shopping_results']);
                var prices = [];
                var titles = [];
                console.log("row to search: " + JSON.stringify(row));
                const productTitle = row["Description"].toLowerCase();
                // console.log("weifht: " + weight);
                // console.log("Search: " + searchString);

                if(!data.hasOwnProperty('shopping_results')){
                    console.log("no results returned: " + productTitle);
                    console.log("data: " + JSON.stringify(data));
                    csvWriter.writeRecords([row])       // returns a promise
                    .then(() => {
                     
                    }).catch((error) => {
                        console.log("error writing rows: " + error);
                    });
                    return;
                }
                
        
                data['shopping_results'].forEach(result => {
                    const title = result.title.toLowerCase();
                    // console.log("result.title: " + title + " contains: " + title.toLowerCase().includes("silan"));
                    // console.log("search string: " + searchString);
                    // console.log("price: " + result.extracted_price);
                    
                    console.log("is included title: " + title + "\t search string: " + productTitle + "\t is included: " + title.toLowerCase().includes(description));
                    if(title.toLowerCase().includes(productTitle)){
                        prices.push(result.extracted_price);
                    }
                    
                });
                if(prices.length != 0){
                 
                    prices = prices.splice(0,5);
                    var average = Math.round((prices.reduce((a,b) => {return a+b})/prices.length)*100)/100;
                    var med = median(prices);
                    // console.log("prices: " + prices);
                    // console.log("median: " + med);
                    // console.log("average: " + average);
                    console.log("smaller: " + Math.min(med,average));
                    const smaller =  Math.min(med,average)
                    row.google_price = smaller;
                }else{
                    row.google_price = 0;
                }
                // rows.push({"Description":title, "google_price":smaller});
                products.push(row);
                console.log("total rows: " + products.length);
                csvWriter.writeRecords([row])       // returns a promise
                .then(() => {
                 
                }).catch((error) => {
                    console.log("error writing rows: " + error);
                });
               
            };
            search.json(params, callback, r);
        })
            


    return rows;
    })
}

readCSV();

