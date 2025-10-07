const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = {
  config: {
    name: "foundationFBVideo",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "JOY",
    description: "গ্রুপে কেউ ভিডিও লিখলে ফেসবুক ভিডিও ডাউনলোড করে দিবে",
    commandCategory: "Media",
    usages: "ভিডিও",
    cooldowns: 5,
  },

  run: async function ({ api, event }) {
    try {
      const message = event.body.toLowerCase();

      if (message.includes("ভিডিও")) {
        // ফেসবুক ভিডিও লিংক
        const fbVideoUrl = "https://www.facebook.com/Islamic.Fundation/videos/619308543949326/?mibextid=rS40aB7S9Ucbxw6v"; // এখানে ফেসবুক ভিডিও লিংক দিন

        // ভিডিও ডাউনলোড করার জন্য ফেসবুক ডাউনলোড API
        const apiUrl = `https://www.getfvid.com/downloader?url=${encodeURIComponent(fbVideoUrl)}`;

        // ইউজারকে জানান হচ্ছে ডাউনলোড হচ্ছে
        const processingMessage = await api.sendMessage("⌛ ভিডিও ডাউনলোড হচ্ছে, দয়া করে অপেক্ষা করুন...", event.threadID, event.messageID);

        // API থেকে ডাউনলোড লিংক পাওয়া
        const response = await axios.get(apiUrl);
        // এখানে ধরে নিচ্ছি API response থেকে direct download URL পাওয়া যাচ্ছে
        const downloadUrl = response.data.downloadUrl;

        if (!downloadUrl) {
          api.sendMessage("❌ ভিডিও ডাউনলোড করতে সমস্যা হয়েছে।", event.threadID, event.messageID);
          return;
        }

        // ফাইল ডাউনলোড এবং পাঠানো
        const downloadDir = path.join(__dirname, "cache");
        if (!fs.existsSync(downloadDir)) fs.mkdirSync(downloadDir, { recursive: true });

        const filePath = path.join(downloadDir, `foundation_fb_video.mp4`);
        const writer = fs.createWriteStream(filePath);

        const videoResponse = await axios({
          url: downloadUrl,
          method: "GET",
          responseType: "stream",
        });

        videoResponse.data.pipe(writer);

        writer.on("finish", async () => {
          await api.sendMessage(
            { body: "🎬 ফাউন্ডেশনের ফেসবুক ভিডিও:", attachment: fs.createReadStream(filePath) },
            event.threadID,
            async () => {
              fs.unlinkSync(filePath); // ভিডিও পাঠানোর পর ফাইল মুছে দেওয়া
              api.unsendMessage(processingMessage.messageID); // প্রসেসিং মেসেজ মুছে দেওয়া
            },
            event.messageID
          );
        });

        writer.on("error", (err) => {
          console.error(err);
          api.sendMessage("❌ ভিডিও ডাউনলোড করতে সমস্যা হয়েছে।", event.threadID, event.messageID);
        });
      }
    } catch (err) {
      console.error(err);
      api.sendMessage("❌ ভিডিও পাঠাতে সমস্যা হয়েছে।", event.threadID, event.messageID);
    }
  },
};
