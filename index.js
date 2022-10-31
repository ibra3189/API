const fs = require("fs");
const http = require("http");
const url = require("url");

///////////////////////////////////////FILES
////////////////////////////// Synchronous //////////////////////////////////

/*This is Synchronous Code (Blocking code one by one )

const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
console.log(textIn);



const textOut = `This is what we are learning about this class: ${textIn}.\nCreated Here ${Date.now()}`;
fs.writeFileSync("./txt/output.txt", textOut);
console.log("File has been written");

//This is Synchronous Code
*/

////////////////////////////// ASynchronous //////////////////////////////////

/*This is ASynchronous Code, work on background and send call back function once done and will not block others from running code 

to Implment the Non-blocking I/O model 
This is why we use so many callback functions in Node.JS

Callbacks != Asynch
*/

// Callback HELL  --> user Promises or Async/Await

/*
fs.readFile("./txt/start.txt", "utf-8", (err, data) => {
  // Args can be called whatever (err, text) ....etc
    console.log(data);
});

console.log("Will read file!"); // this will show first because of the code is non-blocked


*/

/* Sample Output

Will read file!
read-this
*/
/*
fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
  // Args can be called whatever (err, text) ....etc
  if (err) return console.log("ERROR! 💣");
  fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
    // Args can be called whatever (err, text) ....etc
    console.log(data2);
    fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
      // Args can be called whatever (err, text) ....etc
      console.log(data3);
      fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
        console.log("your file has been written 🍭");
      });
    });
  });
});
console.log("Rreading the file! 📖"); // this will show first because of the code is non-blocked
*/

///////////////////////////////////////SERVER
////////////////////////////// SERVER //////////////////////////////////
const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic)
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  // this is needed to retunr the output
  return output;
};

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  //console.log(req);
  console.log(req.url);
  const pathName = req.url;

  // Overview Page
  if (pathName === "/" || pathName === "/overview") {
    res.writeHead(200, { "Content-Type": "text/html" });

    // The below will loop using map() method and then for each Item will use callback
    // function to replaceTemplate with tempCard and el

    //      .join(""); to empty string to conver the arry into string
    const cardHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");

    const output = tempOverview.replace(/{%PRODUCTCARD%}/g, cardHtml);
    //console.log(cardHtml);

    // Below to put the tempalte into the page
    res.end(output);
  }
  // product page
  else if (pathName === "/product") {
    res.end("This is PRODUCT !");
  }

  //API Pages
  else if (pathName === "/api") {
    //////////
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(data);
  }
  // NOT found error
  else {
    res.writeHead(404, {
      "Content-Type": "text/html",
      "my-own-header": "HELLLLLLO",
    });
    res.end("<h1>This page not found !!</h1>");
  }

  //res.end("Hello from the Server!");
});

server.listen(3000, "127.0.0.1", () => {
  console.log("Server is listening on port 3000");
});
