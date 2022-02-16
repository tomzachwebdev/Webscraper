const puppeteer = require('puppeteer');

/**
 * Require the cheerio library.
 * https://www.google.com/search?tbm=shop&q=silan&hl=en&gl=us&near=newyork,+ny
 */
const cheerio = require('cheerio');
const { retry } = require('statuses');
const { title } = require('process');

async function averagePrice(searchString = "silan") {

    const encodedString = encodeURI(searchString);
    const searchURL = `https://www.google.com/search?tbm=shop&q=${encodedString}&hl=en&gl=us&near=newyork,+ny&tbs=vw:g`
    console.log("searchURL: " + searchURL);

try{
  const browser = await puppeteer.launch({
    /**
     * Use the default headless mode (don't show the browser).
     */
    headless: false 
  });

  const page = await browser.newPage();

  await page.goto(searchURL);

  /**
   * Get page content as HTML.
   */
  const content = await page.content();

  /**
   * Load content in cheerio.
   */
  const $ = cheerio.load(content);


  /**
   * Create an array to save the article titles.
   */
  const prices = [];
  const titles = [];

  /**
   * Access `storylink` class. slice() is used to access
   * only he first 5 HTML elements that have `storylink` class.
   * We iterate each of those 5 elements using each() method.
   */

  $(".sh-np__click-target").slice(0,5).children().each((idx,elem) => {
    // console.log("theres something here");
        /**
     * Get the inner HTML which corresponds to the title in text format.
     */

        $(elem).find(".sh-np__product-title").slice(0,1).each((i,el) => {
          const title = $(el).text();
          titles.push(title);
          // console.log("first title: " + title);
        })

        $(elem).find("b").slice(0,1).each((i,el) => {
          const price = $(el).text();
          prices.push(price);
          // console.log("first price: " + price);
        })
              
        // console.log($(elem).text());
  })

  var products = prices.map((price,i) => {
      return {
        "price": price,
        "title" : titles[i]
      }
    })

    // console.log("products: " + JSON.stringify(products));


    $('.sh-dgr__content').children().slice(0,5).each((idx,elem) => {
      var t = [];
      $(elem).find('.Lq5OHe.eaGTj h4').slice(0,1).each((i,el) => {
        // console.log("other title: " + $(el).text());
        t.push($(el).text());
      })

      $(elem).find('span.kHxwFf span').slice(0,1).each((i,el) => {
        // console.log("other price: " + $(el).text());
        products[t[i]] = $(el).text();
      })
    })

    products = products.slice(0,5);
  // $('.a8Pemb.OFFNJ').slice(0, 10).each((idx, elem) => {
  //   /**
  //    * Get the inner HTML which corresponds to the title in text format.
  //    */
  //   const price = $(elem).text();
    
    
  //   /**
  //    * Push the title in titles array.
  //    */
  //   prices[idx] = price
  // })

  // $(".Xjkr3b").slice(0,10).each((idx,elem) => {
  //     const title = $(elem).text()
  //     titles[idx] = title;
  // })

  

  prices.filter((price,i) => {
    // console.log(titles[i])
    return titles[i].includes(searchString) && titles[i].includes("12")
  });

  // browser.close();
  
  /**
   * Log the array of titles.
   */
  // console.log(prices);
  const numPrices = prices.map((price) => {return Number(price.replace("$",""))});
  // console.log("num Prices: " + numPrices);
  const average = numPrices.reduce((p,c)=>{return p + c})/prices.length;
  // console.log("average: " + Math.round(average *100)/100);
  return average;
}
catch(err){
    console.log("err: " + err);
}
}

// const runIterations = async () => {
//   var functionCalls = Array(5).fill(averagePrice());

//   Promise.all([averagePrice(),averagePrice(),averagePrice(),averagePrice(),averagePrice()]).then((res) => {
//     console.log("res: " + res);
//     var average = res.reduce((a,b) => {a+b})/res.length;
//     average = Math.round(average * 100/100);
//     return average;
//   }).catch((err)=> {
//     console.log("Error in promise.all: " + err);
//     return err;
//   })
// }

averagePrice()

// runIterations()