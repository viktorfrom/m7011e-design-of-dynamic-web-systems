const express = require('express');
const router = express.Router();
const prompt = require('prompt');
const moment = require('moment');

const auth = require('../../config/auth.js')
const House = require('../../schemas/houseschema');

prompt.start();

// get single house
router.get('/users/oneHouse/:userEmail', auth.ensureAuthenticated, auth.check_user, async (req, res) => {
    try {
        // console.log(JSON.stringify(req.user));
        const house = await House.findOne({
            owner: req.params.userEmail
        }).sort({
            timestamp: -1
        })

        const result = {
            statusMessage: house.statusMessage
        };

        res.json(result);
    } catch (err) {
        res.json({
            message: err
        });
    }
    return
});

// get latest battery ratio
router.get('/users/latestBatteryRatio', auth.ensureAuthenticated, async (req, res) => {
    try {
        const house = await House.find({
            owner: req.user.email
        }).sort({
            timestamp: -1
        }).limit(1);

        const batteryRatio = house.map(x => x.batteryRatio);

        const result = {
            batteryRatio: batteryRatio[0] * 100
        };

        res.json(result);
    } catch (err) {
        res.json({
            message: err
        });
    }
    return;
});

// get 10 last houses
router.get('/users/houses/:userEmail', auth.ensureAuthenticated, async (req, res) => {
    try {
        // console.log(JSON.stringify(req.user));
        const houses = await House.find({
            owner: req.params.userEmail
        }).sort({
            timestamp: -1
        }).limit(10);

        // console.log(houses[0])

        houses.sort((a, b) => {
            if (a.timestamp < b.timestamp) {
                return -1;
            } else if (a.timestamp > b.timestamp) {

                return 1;
            }
            return 0;
        });

        const timestamp = houses.map(x => moment(x.timestamp).format('YYYY-MM-DD hh:mm:ss'));

        const maxCapacity = houses.map(x => x.battery.maxCapacity);
        const currentCapacity = houses.map(x => x.battery.currentCapacity);

        const currentPower = houses.map(x => x.windTurbine.currentPower);
        const maxPower = houses.map(x => x.windTurbine.maxPower);

        const maxHouseConsumption = houses.map(x => x.maxHouseConsumption);
        const houseConsumption = houses.map(x => x.houseConsumption);
        const netProduction = houses.map(x => x.netProduction);
        const statusMessage = houses.map(x => x.statusMessage);

        const result = {
            timestamp: timestamp,

            maxCapacity: maxCapacity,
            currentCapacity: currentCapacity,

            currentPower: currentPower,
            maxPower: maxPower,

            maxHouseConsumption: maxHouseConsumption,
            houseConsumption: houseConsumption,
            netProduction: netProduction,
            statusMessage: statusMessage
        };

        res.json(result);
    } catch (err) {
        res.json({
            message: err
        });
    }
    return;
});


// get all houses
router.get('/', auth.ensureAuthenticated, auth.check_user, async (req, res) => {
    try {
        const allHouses = await House.find();
        res.json(allHouses);
    } catch (err) {
        res.json({
            message: err
        });
    }
});

// post house
router.post('/', auth.ensureAuthenticated, auth.check_user, (req, res) => {
    const house = new House({
        powerPlant: req.body.powerPlant,
        marketPrice: req.body.marketPrice,
        region: req.body.region,
        owner: req.body.owner,
        batteryId: req.body.batteryId,
        windTurbineId: req.body.windTurbineId,
        maxHouseConsumption: req.body.maxHouseConsumption,
        minHouseConsumption: req.body.minHouseConsumption,
        houseConsumption: req.body.houseConsumption,
        statusMessage: req.body.statusMessage
    })

    house.save().then(data => {
        res.json(data);
    });
});

// delete house 
router.delete('/:houseId', auth.ensureAuthenticated, auth.check_user, async (req, res) => {
    try {
        const houseRemove = await House.remove({
            _id: req.params.houseId
        });
        res.json(houseRemove);
    } catch (err) {
        res.json({
            message: err
        });
    }
});

// update house
router.patch('/:houseId', auth.ensureAuthenticated, auth.check_user, async (req, res) => {
    try {
        const houseUpdate = await House.updateOne({
            _id: req.params.houseId
        }, {
            $set: {
                powerPlant: req.body.powerPlant,
                marketPrice: req.body.marketPrice,
                region: req.body.region,
                owner: req.body.owner,
                batteryId: req.body.batteryId,
                windTurbineId: req.body.windTurbineId,
                maxHouseConsumption: req.body.maxHouseConsumption,
                minHouseConsumption: req.body.minHouseConsumption,
                houseConsumption: req.body.houseConsumption,
                statusMessage: req.body.statusMessage
            }
        });
        res.json(houseUpdate);
    } catch (err) {
        res.json({
            message: err
        });
    }
});

module.exports = router;