module.exports.config = {
  name: "payNumber",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "SaGor",
  description: "নগদ/বিকাশ/রকেট লেখা হলে তাদের নম্বর দেখাবে (বাংলা/ইংরেজি সমর্থন)",
  commandCategory: "utility",
  usages: "নগদ|bKash|rocket",
  cooldowns: 5
};

const remindedRecently = new Set();

// এখানে প্রতি সার্ভিসের নম্বর দিন — উদাহরণ হিসেবে দেওয়া
const SERVICE_NUMBERS = {
  nagad: "01615101797",   // উদাহরণ: নগদ নম্বর
  bkash: "01615101797",   // উদাহরণ: বিকাশ নম্বর
  rocket: "01615101797"   // উদাহরণ: রকেট নম্বর
};

// বিভিন্ন বাংলা/ইংরেজি ফর্ম ধরার regex
const patterns = {
  nagad: /\b(নগদ|nagad|nagadh?)\b/i,
  bkash: /\b(বিকাশ|bkash|b-kash|b kash)\b/i,
  rocket: /\b(রকেট|rocket)\b/i
};

module.exports.handleEvent = function ({ api, event }) {
  try {
    const { threadID, messageID, senderID, body } = event;
    if (!body) return;

    const text = body.trim();

    // anti-spam per user per thread
    const key = `${threadID}_${senderID}`;
    if (remindedRecently.has(key)) return;

    // কোন সার্ভিস match করছে দেখুন
    let matched = null;
    if (patterns.nagad.test(text)) matched = "nagad";
    else if (patterns.bkash.test(text)) matched = "bkash";
    else if (patterns.rocket.test(text)) matched = "rocket";

    if (!matched) return;

    // নম্বর বের করুন (না থাকলে ডিফল্ট ম্যাসেজ)
    const number = SERVICE_NUMBERS[matched] || "নম্বর পাওয়া যায়নি। অ্যাডমিনের সাথে যোগাযোগ করুন।";

    // ইউজারের নাম নিয়ে সুন্দর রেসপন্স (getUserInfo থেকে নাম নেব)
    api.getUserInfo(senderID, (err, info) => {
      const userName = (!err && info && info[senderID] && info[senderID].name) ? info[senderID].name : "বন্ধু";
      const serviceLabel = matched === "nagad" ? "নগদ" : (matched === "bkash" ? "বিকাশ" : "রকেট");

      const msg = `🔔 ${userName}, নিচে ${serviceLabel} নম্বর:\n\n📱 ${number}\n\n👉 প্রয়োজনে নম্বর কপি করে ব্যবহার করুন।`;

      // Send message and react (reaction optional)
      api.sendMessage(msg, threadID, (sendErr) => {
        if (sendErr) {
          console.error("sendMessage error:", sendErr);
        } else {
          // message reaction — যদি API সমর্থন করে
          try { api.setMessageReaction("✅", messageID, () => {}, true); } catch (e) {}
        }
      });
    });

    // Anti-spam টাইমআউট (10 সেকেন্ড)
    remindedRecently.add(key);
    setTimeout(() => remindedRecently.delete(key), 10000);

  } catch (e) {
    console.error("payNumber module error:", e);
  }
};

module.exports.run = function () {};
