var admin = require("firebase-admin");

var serviceAccount = require("../config/firebase.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://my-m4y-default-rtdb.asia-southeast1.firebasedatabase.app",
});

exports.pushNotification = async (message, tokens) => {
  await admin.messaging().sendToDevice(tokens, message, {
    priority: "high",
    timeToLive: 60 * 60 * 24,
  });
};
