const SerpApi = require('google-search-results-nodejs');
const { lowerCase } = require('lodash');
const { title } = require('process');
const search = new SerpApi.GoogleSearch("766c06ffa652f3abbca080827200471be8ead299fe66d30551f98849bf1b1123");
const util = require('util');
const { resourceLimits } = require('worker_threads');

const api_key = "766c06ffa652f3abbca080827200471be8ead299fe66d30551f98849bf1b1123"

const params = {
    engine: "google",
    q: "silan",
    location: "New York, New York, United States",
    google_domain: "google.com",
    gl: "us",
    hl: "en",
    num: "5",
    tbm: "shop"
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
  
  // Show result as JSON

  function searchForProduct(searchString,weight,row = {}){
    params.q = "Honey 12 oz" //searchString + " " + weight;

    const callback = function(data) {
        // console.log(data['shopping_results']);
        var prices = [];
        var titles = [];
        // console.log("weifht: " + weight);
        // console.log("Search: " + searchString);

        data['shopping_results'].forEach(result => {
            const title = result.title;
            console.log("result.title: " + title + " contains: " + title.toLowerCase().includes("silan"));
            console.log("search string: " + searchString);
            console.log("price: " + result.extracted_price);
            

            if(title.toLowerCase().includes(searchString)){
               prices.push(result.extracted_price);
            }
            
        });
        prices = prices.splice(0,5);
        var average = Math.round((prices.reduce((a,b) => {return a+b})/prices.length)*100)/100;
        var med = median(prices);
        // console.log("prices: " + prices);
        // console.log("median: " + med);
        // console.log("average: " + average);
        console.log("smaller: " + Math.min(med,average));
        const smaller =  Math.min(med,average)
        row.google_price = smaller;
        rows.push(row);
      };

    search.json(params, callback);
  }

  

  searchForProduct("honey","12");
  