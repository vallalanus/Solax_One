const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();
const InverterData = require('./models/InverterData');

const app = express();
const port = process.env.PORT || 3003;

app.use(express.json());

MONGO_URI='mongodb+srv://panchadsharamanusha:1234@cluster0.38fjgnz.mongodb.net/solaxRealData'

// MongoDB connection
mongoose.connect(MONGO_URI , { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// Fetch Solax inverter data and store it in MongoDB
async function fetchAndStoreInverterData() {
    try {
        // Build the request payload
        const payload = {
            wifiSn: process.env.WIFI_SN
        };

        // Set the request headers
        const headers = {
            'Content-Type': 'application/json',
            'tokenId': process.env.TOKEN_ID  // Custom header for tokenId
        };

        // Make the request to the Solax API
        const response = await axios.post(`${process.env.API_ADDRESS}/api/v2/dataAccess/realtimeInfo/get`, payload, { headers });

        // Use object destructuring to access 'data' directly
        const { data } = response;

        // Check if the response is successful
        if (data.success) {
            const newData = new InverterData({
                inverterSn: data.result.inverterSn,
                sn: data.result.sn,
                data: data.result // Store all the data
            });

            await newData.save();
            console.log('Inverter data saved:', newData);
        } else {
            console.error('Failed to fetch data:', data.exception);
        }
    } catch (error) {
        console.error('Error fetching inverter data:', error.message);
    }
}

// Fetch and store data every 30 seconds
setInterval(fetchAndStoreInverterData, 30000);  // 30,000 milliseconds = 30 seconds

app.get('/', (req, res) => {
    res.send('Solax Inverter Backend Running');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
