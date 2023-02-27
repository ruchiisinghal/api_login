const User = require('../models/user');
const { generateToken } = require('../models/jwt');
const sendSMS = require('../models/sms');
const ErrorResponse = require('../utils/errorResponse');

const signup = async (req, res, next) => {
  try {
    const { phoneNumber, password } = req.body;
    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(409).json({ error: 'Phone number is already registered' });
    }
    const user = new User({ phoneNumber, password });
    await user.save();
    const token = generateToken(user);
    res.json({ token });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { phoneNumber, password } = req.body;
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(401).json({ error: 'Invalid phone number or password' });
    }
    const isValidPassword = await user.isValidPassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid phone number or password' });
    }
    const token = generateToken(user);
    res.json({ token });
  } catch (error) {
    next(error);
  }
};

