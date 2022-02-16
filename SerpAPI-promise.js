const axios = require("axios");
const { Minimatch } = require("minimatch");
const { title } = require("process");
const querystring = require('querystring');
const { URLSearchParams } = require("url");
const mathHelpers = require("./math-helpers")

const api_key = "766c06ffa652f3abbca080827200471be8ead299fe66d30551f98849bf1b1123"

var parameters = {
    engine: "google",
    location: "New York, New York, United States",
    google_domain: "google.com",
    gl: "us",
    hl: "en",
    num: "10",
    tbm: "shop",
    api_key: api_key
  };

  const performRequest = async (row) => {

    if(row == undefined){
      console.log("\n row is undefined \n: " + row);
    }

    console.log("row recieved: " + JSON.stringify(row));

    if(!row.hasOwnProperty("Description")){
      console.log("Row does not have property description: " + JSON.stringify(row));
      return {};
    }

    const description = row["Description"].toLowerCase();
    // console.log("row: " + JSON.stringify(row));
    var weight = row["Product Weight"];
    var weightAmt = 0;
    var weightUnits = "";

    var searchString = description

    if(weight && !/^\s*$/.test(weight) && weight.length > -1 && weight.split(" ").length > -1){
      if(weight.split(" ")[0].match(/\d+/g) != null){
        console.log("not null 1: " + weight.split(" ")[0].match(/\d+/g)[0]);
        weightAmt = Math.round(weight.split(" ")[0].match(/\d+/g)[0]);
      }

      // console.log("weight amount: " + weightAmt);
   
      
      if(weight.split(" ")[0].match(/[a-zA-Z]+/g) != null){
        console.log("not null 2: " + weight.match(/[a-zA-Z]+/g))
        weightUnits += weight.match(/[a-zA-Z]+/g)[0];
      }

      // console.log("weight units: " + weightUnits);

      weight = weightAmt + " " + weightUnits;

      // console.log("weight: " + weight);

      searchString += " " + weight;
    }
    

     

    const base_params = {
      "source": "nodejs",
      "output":"json",
      "api_key":"766c06ffa652f3abbca080827200471be8ead299fe66d30551f98849bf1b1123",
      "engine":'google'
    }

    const search_params = {
      q: searchString,
      num: "10"
    };

    const params = {
      ...parameters,
      ...base_params,
      ...search_params,
    }

    
  

    var searchParams = new URLSearchParams(params)

    const url = "https://serpapi.com/search?" //+ searchParams.toString();
    // console.log("url: " + searchParams);
    try{
      const res =  await axios.get(url, {params: searchParams});
      const data = res.data['shopping_results'];
      
      if(data == undefined){
        console.log("data was not found for row: " + JSON.stringify(row));
        row.google_average_price = 0
        row.google_min_price = 0 
        row.google_max_price = 0
        row.num_competitors = 0
        row.total_checked = 0
        return row;
      }

      var prices = data.filter((product)=>{return mathHelpers.contains(product.title,description)}).map((product) => {
        // console.log("product title: " + product.title + " description: " + description + " includes: "  + mathHelpers.contains(product.title, description) + " price: " + product.extracted_price);
          return Number(product.extracted_price)
      })
      // console.table(prices);
      // console.table(res);

      const median = mathHelpers.median(prices)
      // console.log("median: " + median);
      const avg = mathHelpers.average(prices)
      // console.log("avg: " + avg);
      const average = median == 0 ? avg : Math.min(median,avg);
      // console.log("average: " + average);
      row.google_average_price = Math.round(average*100)/100;
      row.google_min_price = Math.min.apply(Math,prices);
      row.google_max_price = Math.max.apply(Math,prices);
      row.num_competitors = prices.length;
      row.total_checked = data.length;
      // console.log("min: " + Math.min(mathHelpers.average(prices),mathHelpers.median(prices)));
      // console.log("median: " + mathHelpers.median(prices));
      // console.log("average: " + mathHelpers.average(prices));
      // console.log("num competitors: " + row.num_competitors + " total: " + data.length);
      return row;
    }catch(err){
      console.log("error performing request: " + err);
    }
  }

const runTest = async (row) => {
  // console.log("row after: " + JSON.stringify(await performRequest({"Description":"silan","Product Weight":"12 oz"})));
  console.log("row after: " + JSON.stringify(await performRequest(row)));
}

runTest({"Description": "Baking Almond Extract","Product Weight": "50ml"});

exports.performRequest = performRequest;


