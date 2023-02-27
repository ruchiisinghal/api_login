const express = require('express');
const router = express.Router();
const aws = require('aws-sdk');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const JWT_SECRET= require('../config/config.env');

aws.config.update({
  accessKeyId: process.env.AKIAXYFUA64FGSGZYNT5,
  secretAccessKey: process.env.YFeYlNVf0p9TmbYjYbnVrMCY817b8goozc1EJDLS,
  region: process.env.us-east-1
});

const sns = new aws.SNS();

// Generate OTP and send SMS via AWS SNS
router.post('/login', async (req, res) => {
  const { phoneNumber } = req.body;

  try {
    const user = await User.findOne({ phoneNumber });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

    const params = {
      Message: `Your OTP is ${otp}`,
      PhoneNumber: `+${phoneNumber}`
    };

    sns.publish(params, (err, data) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: 'Failed to send OTP' });
      }

      // Generate JWT token and send in response
      const token = jwt.sign({ phoneNumber },process.env.JWT_SECRET, { expiresIn: '15m' });
      return res.json({ message: 'OTP sent successfully', token });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Verify OTP and return JWT token
router.post('/verify', async (req, res) => {
  const { phoneNumber, otp } = req.body;

  try {
    const user = await User.findOne({ phoneNumber });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify OTP
    if (otp !== user.otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    const token = jwt.sign({ phoneNumber }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'OTP verified successfully', token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
