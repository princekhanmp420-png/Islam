module.exports.config = {
  name: "foundationIdea",
  version: "1.0.0",
  author: "SaGor",
  description: "কেউ ফাউন্ডেশনের ধারণা লিখলে সবাইকে mention করে মেসেজ পাঠাবে",
  commandCategory: "group",
  cooldown: 30, // প্রতি ৩০ সেকেন্ডে একবার ট্রিগার হবে
};

module.exports.run = async function ({ api, event }) {
  // শুধু গ্রুপে কাজ করবে
  if (!event.isGroup) return api.sendMessage("❌ এই কমান্ড শুধু গ্রুপে কাজ করবে!", event.threadID);

  const text = event.body?.toLowerCase() || "";

  // ফাউন্ডেশন সম্পর্কিত শব্দ খোঁজা
  const keywords = ["ফাউন্ডেশনের ধারণা", "foundation idea", "foundation", "foundation plan", "foundation purpose"];
  const matched = keywords.some(k => text.includes(k));
  if (!matched) return; // কীওয়ার্ড না থাকলে কিছু করবে না

  try {
    // থ্রেড ইনফো আনা
    const threadInfo = await new Promise((resolve, reject) => {
      api.getThreadInfo(event.threadID, (err, info) => {
        if (err) return reject(err);
        resolve(info);
      });
    });

    const participantIDs = threadInfo.participantIDs || [];
    if (participantIDs.length === 0) return api.sendMessage("⚠️ সদস্যদের তথ্য পাওয়া যাচ্ছে না!", event.threadID);

    // mention বানানো
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

    // মূল মেসেজ
    const message = `
🌿 *ফাউন্ডেশনের ধারণা* 🌿

"${event.body}"

এই ধারণাটি সবার জন্য উন্মুক্ত আলোচনা।
আপনার মতামত জানাতে ভুলবেন না 💬

${mentionText}
    `;

    // পাঠাও
    api.sendMessage({ body: message, mentions }, event.threadID);

  } catch (err) {
    console.error(err);
    api.sendMessage("⚠️ কিছু সমস্যা হয়েছে! আবার চেষ্টা করুন।", event.threadID);
  }
};
