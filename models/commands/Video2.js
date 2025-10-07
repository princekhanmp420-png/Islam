module.exports.config = {
  name: "video",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "SAGOR",
  description: "কেউ যদি ভিডিও লিখে, বট ফাউন্ডেশনের ভিডিও লিংক দিবে",
  commandCategory: "other",
  usages: "video",
  cooldowns: 5,
};

module.exports.run = async ({ api, event, args }) => {
  try {
    // ✅ ফাউন্ডেশনের ভিডিও লিংক
    const videoLink = "https://www.facebook.com/share/v/1Z2uXFZm8r/"; // এখানে তোমার ভিডিও URL বসাও

    // কেউ যদি "ভিডিও" লিখে
    if (args.join("Apps").toLowerCase() === "ভিডিও" || args.join("apk").toLowerCase() === "video") {
      return api.sendMessage({
        body: "🎬 ফাউন্ডেশনের ভিডিও এখানে:",
        attachment: await global.nodemodule["axios"]
          .get(videoLink, { responseType: "arraybuffer" })
          .then(res => Buffer.from(res.data, "utf-8"))
      }, event.threadID, event.messageID);
    } else {
      return api.sendMessage("ভিডিও পাঠানোর জন্য শুধু 'ভিডিও' লিখুন।", event.threadID, event.messageID);
    }

  } catch (err) {
    console.error(err);
    return api.sendMessage("⚠️ ভিডিও পাঠানো যায়নি। পরে আবার চেষ্টা করুন।", event.threadID, event.messageID);
  }
};
