const GetData = require('./GetData.js');
const {colored} = require("asciichart");
const {green, red} = require("asciichart");
let priceNow;
var chart ;
let dates = [];
let histPrices = [];
var USDyou;

let details = function() {
    GetData.coinDeskGet('https://api.coindesk.com/v1/bpi/currentprice/usd.json', function (info) {
        getCurrent(info);
    }); //current price (USD)
    GetData.coinDeskGet('https://api.coindesk.com/v1/bpi/historical/close.json', function (info) {
        historicalGraph(info);
    });// last 30 days
}

function getCurrent(price) {//updated, rate
    priceNow = (price["bpi"]["USD"]["rate"]);
    var t1 = priceNow.substr(0,1);
    var t2 = priceNow.substr(2,priceNow.length);
    priceNow = parseInt(t1+t2);
}

//plotting graph
function historicalGraph(history) {
    let histData = history['bpi'];

    //add dates to date array
    for (var i in histData) {
        dates.push(i);
    }

    //historical prices 31 days
    for (let i = 0; i < dates.length; i++) {
        histPrices.push(histData[dates[i]]);
    }
    var asciichart = require ('asciichart')
    var s0 = new Array (31)
    for (i = 0; i < s0.length; i++)
        s0[i] = histPrices[i];

    //compare price to previous days (<) ? red:green
    console.log(priceNow, histPrices[histPrices.length-1])
    if (priceNow < histPrices[histPrices.length-1]) {
        var config = {
            height:[
                10
            ],
            colors: [
                asciichart.red,
            ]
        }
    }
    else if (priceNow === histPrices[histPrices.length-1]) {
        var config = {
            height:[
                10
            ],
            colors: [
                asciichart.darkgray,
            ]
        }
    }
    else
    {
        var config = {
            height:[
                10
            ],
            colors: [
                asciichart.green,
            ]
        }
    }
    chart = (asciichart.plot (s0, config));
}
//output and text stuff
setTimeout(function () {
    const fs = require('fs')

    fs.readFile(__dirname+"/holdingsBTC","utf8", (err, data) => {
        if (err) {
            console.error(err)
            return
        }
        var holding = parseFloat(data); // read from file and assign
        USDyou = holding * priceNow; // how much USD you're worth

    })
}, 1000);

setTimeout(function () {
    console.clear();
    console.log("                   BTC Tracker       ")
    console.log("              "+new Date().toLocaleString()+"       ")
    if (priceNow < histPrices[histPrices.length - 1])// price has decreased
    {
        var decrease = histPrices[histPrices.length - 1] - priceNow;
        var percentageChange = ((decrease / histPrices[histPrices.length - 1]) * 100).toFixed(2);
        process.stdout.write(chart + "USD   : $" + priceNow + "\n" +
            "    Current-Value: $"+(USDyou.toFixed(2)+"                 %24hr : " + colored("-"+percentageChange+"%", red))+"\n");

    } else {
        var increase = priceNow - histPrices[histPrices.length - 1];
        var percentageChange = (increase / histPrices[histPrices.length - 1] * 100).toFixed(2);
        process.stdout.write(chart + "USD   : $" + priceNow + "\n" +
            "    Current-Value: $"+(USDyou.toFixed(2)+"                 %24hr : " + colored("+"+percentageChange+"%", green))+"\n");
    }
}, 4000);

details();