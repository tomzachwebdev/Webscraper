const cheerio = require("cheerio");
const axios = require("axios");
const retry = require('retry-axios');
const { title } = require("process");
const { result } = require("lodash");

const searchString = "silan";
const encodedString = encodeURI(searchString);

const AXIOS_OPTIONS = {
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.157 Safari/537.36",
  },
};

const params = {
    responsive: true,
    destination: 'New+York%2C+New+York',
    latLong: '40.75668%2C-73.98647',
    regionId: 178293, 
    startDate: '01%2F20%2F2019', 
    endDate: '01%2F21%2F2019',  rooms: 1, 
    adults: 2,
    timezoneOffset: 19800000,
    langid: 1033,
    hsrIdentifier: 'HSR',
    page: 7
  }
  
  const raxConfig = {
    backoffType: 'exponential',
    onRetryAttempt: (err) => {
      const cfg = rax.getConfig(err);
      const status = err.response.status;
      console.log(`🔄 [${status}] Retry attempt #${cfg.currentRetryAttempt}`);
    }
  }
  
  
function getOrganicResults(searchString) {
    // const searchString = "silan 12 oz";
    const encodedString = encodeURI(searchString);
    console.log(`ecnoded string: ${encodedString}`)
    const searchURL = `https://www.google.com/search?tbm=shop&q=${encodedString}&hl=en&gl=us&near=newyork,+ny`
    console.log("searchURL: " + searchURL);
  return axios
    .get(
    //   `https://www.google.com/search?q=${encodedString}&hl=en&gl=us`,
    // `https://www.google.com/search?tbm=shop&${encodedString}`,
    searchURL,

    
      AXIOS_OPTIONS,
      {
          params,
          raxConfig
      }
    )
    .then(function ({ data }) {
      let $ = cheerio.load(data);

      const links = [];
      const titles = [];
      const snippets = [];


      const sellers = [];

      const prices = [];

    //   $(".KZmu8e .sh-np__product-title").each((i,el) => {
        $(".Xjkr3b").each((i,el) => {
        if(i >= 5){
            return
        }
        titles[i] = $(el).text();
      });

    //   $(".hn9kf > .T14wmb").each((i,el) => {
    //       prices[i] = $(el).text();
    //       console.log("prices: " + prices[i]);
    //   })

    $(".a8Pemb.OFFNJ").each((i,el) => {
        if(i >= 5){
            return;
        }
        // console.log("price from website: " + $(el).text());
        prices[i] = $(el).text();
    })

    console.log("prices: " + prices);

    $(".sh-np__click-target").each((i,el) => {
        if(i >= 5){
            return
        }
        links[i] = $(el).attr("href");
    })

    $(".E5ocAb").each((i,el) => {
        if(i >= 5){
            return
        }
        sellers[i] = $(el).text();
    })

    //   $(".sh-np__product-title").each((i, el) => {
    //     links[i] = $(el).attr("href");
    //   });
    //   $(".yuRUbf > a > h3").each((i, el) => {
    //     titles[i] = $(el).text();
    //   });
    //   $(".IsZvec").each((i, el) => {
    //     snippets[i] = $(el).text().trim();
    //   });


    //   const result = [];
    //   for (let i = 0; i < titles.length; i++) {
    //     result[i] = {
    //       link: links[i],
    //       title: titles[i],
    //       snippet: snippets[i],
    //       price: prices[i].reduce((p,c) => {return p+c})/prices.length,
    //       seller: sellers[i]
    //     };
    //   }
    //   console.log("description: " + searchString + "\ttitle: " + result.title +"\tprice: " + result.price)

    prices = prices.map((price) => { return Number(element.price.replace("$",""))})
    console.log("prices: " + prices);
      return {price:prices.reduce((p,c) => {return p+c})/prices.length};
    // return {"price":"$5.00"}
    });
}

const getAveragePrice = async (searchString) => {

    try{
        // const results = await getOrganicResults(searchString);
        // var sum = 0

        // results.forEach(element => {
        //     console.log("price: " + element.price);
        //     sum += Number(element.price.replace("$",""));
        // });
        // console.log("result sum: " + sum);
        // console.log("result.length: " + results.length); 
        // return sum/results.length;
        return await getOrganicResults(searchString);
    } catch(err){
        throw err
    } 
}

const printAverage = async () => {

    var functionCalls = Array(100).fill(averagePrice("silan 12 oz"))
    const average = Promise.all(functionCalls).then((results) => {
        const sum = results.reduce((p,c) => {
            return p + c;
        })
        // console.log("sum: " + sum);
        // console.log(sum/results.length)
        const average = sum/results.length;
        return Math.round(average * 100) / 100;
    }).catch((err) =>{
        console.log("error: " + err);
        return err;
    });
    
    console.log(await average);

}

const iterativeAverage = async (row, iterations = 5) => {

    const searchString = row.Description //+ " " + row["Product Weight"];
    // const searchString = row.Description 

    try{
        
        // var results = await Promise.all(Array(iterations).fill(getAveragePrice(searchString)));
        // const average = results.reduce((p,c) => {
        //     p + c
        // })/results.length;
        const average = await getAveragePrice(searchString);
        // console.log("average: " + average); 
        const roundedAverage = Math.round(average * 100) / 100;
        row.average = average;
        return row;
    }catch(err){
        return err;
    }

//     var functionCalls = Array(iterations).fill(getAveragePrice(searchString));
//    console.log("function calls length: " + functionCalls.length);
//     try{
//         return await Promise.all(functionCalls).then((results) => {
//             const sum = results.reduce((p,c) => {
//                 return p + c;
//             })
//             const average = sum/results.length;
//             const roundedAverage = Math.round(average * 100) / 100;

//             row.averagePrice = "$" + String(roundedAverage)
//             return row;
//         }).catch((err) =>{
//             console.log("error: " + err);
//             return err;
//         });
//     }
//     catch(err){
//         return err;
//     }

}


exports.printAverage = printAverage;
exports.getAveragePrice = getAveragePrice;

exports.iterativeAverage = iterativeAverage;

const testIA = async () => {
   const average = await iterativeAverage("silan 12 oz",10).then((res) => {
    //    console.log("res: " + res);
       return res;
   }).catch((err) => {
       return  err;
   });
    console.log("final average: " + average)
};

// testIA();

// getOrganicResults("silan 12 oz")
// printAverage();

// getOrganicResults();

// getAveragePrice("silan 12 oz");

const searchFor = async () => {
        const data = await axios.get("https://www.google.com/search?tbm=shop&q=silan&hl=en",AXIOS_OPTIONS).then((data) => {
            let $ = cheerio.load(data);
            var prices = [];
            console.log("inside: " +  $.html());
            $(".T14wmb").each((i,el) => {
                if(i >= 5){
                    return;
                }
                console.log("price from website: " + $(el).text());
                prices[i] = $(el).text();
            })

            prices.forEach((price) => {
                console.log("price: " + price);
            })

            return prices;

        }).catch((err) =>{
            console.log("error: " + err);
            return err;
        });
}

searchFor();