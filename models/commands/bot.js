const fs = global.nodemodule["fs-extra"];
module.exports.config = {
  name: "bot",
  version: "1.0.1",
  hasPermssion: 0,
 credits: "JOY",
  description: "goibot",
  commandCategory: "Noprefix",
  usages: "noprefix",
  cooldowns: 5,
};
module.exports.handleEvent = async function({ api, event, args, Threads, Users }) {
  var { threadID, messageID, reason } = event;
  const moment = require("moment-timezone");
  const time = moment.tz("Asia/Manila").format("HH:MM:ss L");
  var idgr = `${event.threadID}`;
  var id = event.senderID;
  var name = await Users.getNameUser(event.senderID);

  var tl = ["আপনি কি ফাউন্ডেশনের হাদিয়া পরিশোধ করতে চান তাহলে লিখুন 👉 বিকাশ নগদ রকেট 👈", "আপনি কি ফাউন্ডেশনের নিয়ম সম্পর্কে জানতে চান তাহলে লিখুন 👉Rules👈", "আপনি কি ফাউন্ডেশনের সম্পর্কে জানতে চান তাহলে অবশ্যই এডমিনের সাথে যোগাযোগ করুন", "আপনি কি ফাউন্ডেশনের উদ্দেশ্য এবং কাজ সম্পর্কে জানতে চান তাহলে লিখুন 👉 ফাউন্ডেশন এর ধারণা & ফাউন্ডেশন এর কাজ & ফাউন্ডেশনের উদ্দেশ্য 👈", "আপনি কি ফাউন্ডেশনের ফেসবুক গ্রুপ এবং ফেসবুক পেজের লিংক এবং এইগুলা সম্পর্কে জানতে চান তাহলে লিখুন 👉page link & gc link👈"];
  var rand = tl[Math.floor(Math.random() * tl.length)]
  if (event.body.indexOf("বট") == 0 || (event.body.indexOf("Bot") == 0)) {
    var msg = {
      body: `${name}, ${rand}`
    }
    return api.sendMessage(msg, threadID, messageID);
  };

}

module.exports.run = function({ api, event, client, __GLOBAL }) { }
  
