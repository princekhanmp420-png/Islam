module.exports.config = {
  name: "everyone",
  version: "1.0.0",
  author: "SaGor",
  description: "কেউ 'everyone' বা '@everyone' লিখলে সবাইকে mention করে একটি মেসেজ পাঠাবে",
  commandCategory: "group",
  cooldown: 10,
};

module.exports.run = async function ({ api, event }) {
  if (!event.isGroup) return api.sendMessage("❌ এই কমান্ড শুধু গ্রুপে কাজ করবে!", event.threadID);

  const message = event.body.toLowerCase();
  if (message.includes("everyone") || message.includes("@everyone")) {
    try {
      const threadInfo = await new Promise((resolve, reject) => {
        api.getThreadInfo(event.threadID, (err, info) => {
          if (err) return reject(err);
          resolve(info);
        });
      });

      const participantIDs = threadInfo.participantIDs || [];
      if (participantIDs.length === 0) return api.sendMessage("⚠️ সদস্যদের তথ্য পাওয়া যায়নি!", event.threadID);

      const mentions = [];
      let mentionText = "";

      for (const id of participantIDs) {
        const userInfo = await new Promise((resolve, reject) => {
          api.getUserInfo(id, (err, data) => {
            if (err) return reject(err);
            resolve(data[id]);
          });
        });

        const name = userInfo.name || "Member";
        const tag = `@${name}`;
        mentionText += `${tag} `;
        mentions.push({ id, tag, fromIndex: mentionText.length - tag.length });
      }

      const finalMessage = {
        body: `📢 সবাই লক্ষ্য করুন!\n\nগ্রুপে একটি গুরুত্বপূর্ণ ঘোষণা দেওয়া হয়েছে। অনুগ্রহ করে মনোযোগ দিন 🫡\n\n${mentionText}`,
        mentions: mentions
      };

      api.sendMessage(finalMessage, event.threadID);

    } catch (err) {
      console.error(err);
      api.sendMessage("⚠️ মেসেজ পাঠাতে সমস্যা হয়েছে!", event.threadID);
    }
  }
};
