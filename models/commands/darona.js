module.exports.config = {
  name: "howAreYou",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "SaGor",
  description: "কেউ কেমন আছো বললে বট রিপ্লাই দিবে",
  commandCategory: "AI",
  usages: "auto how are you reply",
  cooldowns: 5,
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, senderID, body } = event;
  if (!body) return;

  const text = body.toLowerCase().trim();

  // --- কিওয়ার্ড তালিকা ---
  const keywords = [
    "কেমন আছো",
    "কেমন আছেন",
    "how are you",
    "how r u",
    "how are u",
    "keman acho",
    "তুমি কেমন আছো",
  ];

  // --- যদি মেসেজে কিওয়ার্ড থাকে
  if (keywords.some(word => text.includes(word))) {
    try {
      // ইউজারের নাম আনো
      const userInfo = await new Promise((resolve, reject) => {
        api.getUserInfo(senderID, (err, data) => {
          if (err) return reject(err);
          resolve(data[senderID]);
        });
      });

      const userName = userInfo.name || "বন্ধু";

      // --- রিপ্লাই বার্তা
      const reply = `
😊 আলহামদুলিল্লাহ আমি ভালো আছি, ${userName}!
তুমি কেমন আছো? 🌸

সবসময় হাসিখুশি থেকো ইনশাআল্লাহ 🤍
      `;

      // --- মেসেজ পাঠাও ও রিয়্যাকশন দাও
      api.sendMessage(reply, threadID, () => {
        api.setMessageReaction("💫", messageID, () => {}, true);
      });

    } catch (err) {
      console.error(err);
    }
  }
};

module.exports.run = function () {};
