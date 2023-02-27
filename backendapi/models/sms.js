const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const sns = new AWS.SNS();

const sendSMS = async (phoneNumber, otp) => {
  try {
    const params = {
      Message: `Your OTP is ${otp}`,
      PhoneNumber: phoneNumber,
    };
    await sns.publish(params).promise();
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = sendSMS;
