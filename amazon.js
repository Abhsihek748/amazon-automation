const pup = require("puppeteer");                                     
let id = "ajaa.kajj@gmail.com";
let password = "123456";
let tab;
let browser;

let address = [["random"],
              ["9965847515"],
              ["400064"],
              ["49 , B.j. Ind Estate "],
              ["Kanch Pada"],
              [" Exn Ramchandra Lane, Malad"],
              ["MUMBAI"]]

let products = [["Milton Thermosteel Flip Lid Flask, 1000 milliliters, Silver"],
                ["Mi Smart Band 5 – India’s No. 1 Fitness Band"],
                ["Nilkamal Inspiron Portable Laptop Table (Walnut)"],
                ["D-Link DIR-615 Wireless-N300 Router (Black, Not a Modem)"]] 

let productCount = 0;
                
async function main(){
    browser = await pup.launch({
    headless : false,
    defaultViewport: false ,
    args :["--start-maximized"]
});

let pages = await browser.pages();
 tab = pages[0];
await tab.goto("https://www.amazon.in");

await login();
await addAddress();
await addToCart();
tab.close() ;
}

async function login(){
    let signButton =await tab.$$(".nav-a.nav-a-2.nav-progressive-attribute");
    signButton[1].click();
   await tab.waitForSelector(".a-row.a-spacing-base");
   await tab.type(".a-row.a-spacing-base input",id);
   await tab.click(".a-button.a-button-span12.a-button-primary")
   await tab.waitForSelector(".a-section.a-spacing-large");
   await tab.type(".a-section.a-spacing-large input",password);
   await tab.click("#signInSubmit");
   await tab.waitForSelector(".nav-a.nav-a-2.nav-progressive-attribute");
   await tab.goto("https://www.amazon.in/gp/cart/view.html?");
   await tab.waitForTimeout(1000);

 
}
async function addAddress(){
    await tab.goto("https://www.amazon.in/a/addresses/add?ref=ya_address_book_add_button");
    await tab.waitForSelector(".a-section.a-spacing-micro.adddress-ui-widgets-form-field-container.address-ui-widgets-desktop-form-field");
    let addressButtons = await tab.$$(".a-section.a-spacing-micro.adddress-ui-widgets-form-field-container.address-ui-widgets-desktop-form-field input");
      
    for(let i in addressButtons){
        if(i < 6){
         await addressButtons[i].type(address[i]);
         await tab.waitForTimeout(1000)
        }
    }
     
   await tab.click(".a-button-input");
   await tab.waitForTimeout(1000);
}

async function addToCart(){
    for(let i in products){
        addProduct(products[i],await browser.newPage());
    }
    console.log("x");
}
async function addProduct(productName,tab){
  
        await tab.goto("https://www.amazon.in");
        await tab.waitForSelector("#twotabsearchtextbox",productName);
        await tab.type("#twotabsearchtextbox",productName);
        await tab.keyboard.down("Enter");
        await tab.waitForSelector(".a-link-normal.a-text-normal");
        let product = await tab.$$(".a-link-normal.a-text-normal");
        let url = await tab.evaluate(function(ele){
        return ele.getAttribute("href");
        },product[0]);
        tab.goto("https://www.amazon.in"+ url);
        await tab.waitForSelector("#add-to-cart-button");
        await tab.click("#add-to-cart-button");
        await tab.waitForTimeout(1000);
        productCount++;
        if(productCount == products.length){
            checkout(await browser.newPage());
        }
     tab.close();
}

async function checkout(tab){
    await tab.waitForTimeout(1000);
    await tab.goto("https://www.amazon.in/gp/cart/view.html?");
    await tab.waitForSelector(".a-button-input");
    let checkOutButton = await tab.$$(".a-button-input");
    await checkOutButton[0].click();
    await tab.waitForSelector(".a-declarative.a-button-text");
    let deliverButton = await tab.$$(".a-button-inner a");
    await deliverButton[0].click();
    await tab.waitForSelector(".a-button-text");
    let continueButton = await tab.$$(".a-button-text");
    await continueButton[0].click();
    await tab.waitForSelector(".a-box-inner.a-padding-small");
    let CODButton = await tab.$$(".a-box-inner.a-padding-small");
    CODButton[4].click();
     continueButton = await tab.$$(".a-button.a-button-span12.a-button-primary.pmts-button-input");
    await continueButton[0].click();
    await tab.waitForSelector("#placeYourOrder");
    let placeOrderButton = await tab.$$("#placeYourOrder");
    await placeOrderButton[0].click();    
   
}
main()


