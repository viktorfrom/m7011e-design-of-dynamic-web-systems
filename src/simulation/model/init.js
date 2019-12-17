"use strict";

let House = require("./house.js");
let PowerPlant = require("./powerplant.js");
let Region = require("./region.js");
let MarketPrice = require("./marketprice.js");

module.exports = class init {

    constructor() {
    this.marketPrice = new MarketPrice("Norrbotten");
    this.region1 = new Region("Luleå");
    // this.region2 = new Region("Piteå");
    // this.region3 = new Region("Kalix");
    // this.region4 = new Region("Älvsbyn");
    // this.region5 = new Region("Boden");
    
    this.powerPlant = new PowerPlant("Porjus vattenkraftstation", this.marketPrice, this.region1, 0, 30);

    this.house1 = new House(this.powerPlant, this.marketPrice, this.region1, "Hasse", 2, 7);
    // this.house2 = new House(this.powerPlant, this.marketPrice, this.region2, "Agneta", 3, 10);
    // this.house3 = new House(this.powerPlant, this.marketPrice, this.region3, "Sten", 1, 7);

    // this.house4 = new House(this.powerPlant, this.marketPrice, this.region1, "Malin", 0, 0);
    // this.house5 = new House(this.powerPlant, this.marketPrice, this.region4, "Sara", 2, 5);
    // this.house6 = new House(this.powerPlant, this.marketPrice, this.region5, "Aron", 0, 0);
        
    this.timeSpan = 24 * 7;
    }

    timespan() {
        console.log("Simulation running...");
        for (let i = 0; i < this.timeSpan; i++) {
            setTimeout(() => {
                // console.clear();
                this.powerPlant.electricityProduction();

                this.region1.windspeed();
                // this.region2.windspeed();
                // this.region3.windspeed();
                // this.region4.windspeed();
                // this.region5.windspeed();

                this.house1.electricityConsumption();
                // this.house2.electricityConsumption();
                // this.house3.electricityConsumption();

                // this.house4.electricityConsumption();
                // this.house5.electricityConsumption();
                // this.house6.electricityConsumption();

                this.marketPrice.marketPrice(); // Needs to run last to get accurate readings.
            }, i * 1000)
        }
    }
}
