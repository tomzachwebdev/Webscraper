const cheerio = require("cheerio");
const axios = require("axios");
const { replace, result } = require("lodash");
const { retry } = require("statuses");
const puppeteer = require("puppeteer");

const searchString = "google";
const encodedString = encodeURI(searchString);

const AXIOS_OPTIONS = {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36",
  },
};

function getOrganicResults(searchString = "silan") {

  const searchParams = {"q": searchString, "hl": "en", 'gl': 'us', 'tbm': 'shop'};
  

  

  return axios
    .get(
    //   `https://www.google.com/search?q=${encodedString}&hl=en&gl=us`,
    `https://google.com/search?tbm=shop&q=${searchString}&hl=en&gl=us`,
      AXIOS_OPTIONS
    )
}


async function runIterations(iterations = 10){
    const functionCalls = Array(iterations).fill(getOrganicResults());

    return await Promise.all(functionCalls).then((results) => {
        console.log("results.length: " + results.length);
        var prices = [];

        console.log("results.length: " + results.length);
        results.forEach((result) => {
          $ = cheerio.load(result);
          console.log("result: " + JSON.stringify($().html()));
          $(".sh-np__click-target").each((el,i) => {
            console.log("el; " + el);
          })
        
        })
    
        // results.forEach((result) => {
        //     let $ = cheerio.load(result);
        //     console.log($(".logo .doodle").length);
        // })

        // console.log("first result: " + JSON.stringify(results[0]));

        // var prices = results.map((data)=>{

        //     let $ = cheerio.load(data);
    
        //     var prices = [];
      
        //     console.log("before going inside: " + $().html());
        //     $(".OFFNJ").each((i, el) => {
        //       if(i > 5){
        //           return 
        //       }
        //       prices[i] = Number($(el).text().replace("$",""));
        //       console.log("price: " + prices[i]);
        //     });
      
      
        //       const average = prices.reduce((a,b) => { return a + b})/prices.length;
        //       return average;
           
        // })

        let mf = 1;
        let m = 0;
        let item;

        // prices.forEach((price) => {
        //     console.log("price: " + JSON.stringify(price));
        // })

        // for (let i=0; i<prices.length; i++){
        //     for (let j=i; j<prices.length; j++){
        //         if (prices[i] == prices[j])
        //              m++;
        //             if (mf<m){
        //                 mf=m; 
        //                 item = prices[i];
        //             }
        //     }
        //     m=0;
        // }
        // console.log(item);
        return item;
    }).catch((err) => {
        console.log("err making call: " + err);
        return err;
    })
}

async function manualIteration(){
    try{
        const res1 = await axios.get("https://www.google.com/search?tbm=shop&q=silan&hl=en&gl=us&near=newyork,+ny",AXIOS_OPTIONS)
        // $ = cheerio.load(res1);
        // console.log($().html());
        console.log("res1; " + JSON.stringify(res1));
    }catch(err){
        console.log("Err: " + err);
        return err;
    }
}

manualIteration()
// runIterations(1);

// getOrganicResults();
// runIterations(5)