module.exports.config = {
  name: "groupLeaders",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "SaGor",
  description: "সভাপতি ও একাধিক গ্রুপ লিডারের লিংক পাঠাবে",
  commandCategory: "group",
  usages: "সভাপতি / গ্রুপ লিডার ১ / গ্রুপ লিডার ২ / গ্রুপ লিডার ৩",
  cooldowns: 3,
};

// ---- এখানে তোমার লিংকগুলো বসাও ----
const PRESIDENT_LINK = "https://www.facebook.com/Islamic.Fundation"; // সভাপতি
const LEADER_ONE_LINK = "https://www.facebook.com/jsjakariyasony"; // গ্রুপ লিডার ১
const LEADER_TWO_LINK = "https://www.facebook.com/rajababu.7381"; // গ্রুপ লিডার ২
const LEADER_THREE_LINK = "https://www.facebook.com/shamim.mp123"; // গ্রুপ লিডার ৩

// --- Anti Spam System ---
const talkedRecently = new Set();

module.exports.handleEvent = function({ api, event }) {
  const { threadID, messageID, senderID, body } = event;
  if (!body) return;

  // স্প্যাম প্রটেকশন (২ সেকেন্ডে একবার কাজ করবে)
  if (talkedRecently.has(senderID)) return;
  talkedRecently.add(senderID);
  setTimeout(() => talkedRecently.delete(senderID), 2 * 1000);

  const text = body.toLowerCase().trim();

  // ---- সভাপতি ----
  if (text === "সভাপতি" || text === "president") {
    return api.sendMessage(
      `🔰 আমাদের ফাউন্ডেশন গ্রুপের সভাপতি:\n${PRESIDENT_LINK}`,
      threadID,
      messageID
    );
  }

  // ---- গ্রুপ লিডার ১ ----
  if (text === "গ্রুপ লিডার ১" || text === "গ্রুপ লিডার one" || text === "leader 1") {
    return api.sendMessage(
      `👤 আমাদের ফাউন্ডেশনের গ্রুপ লিডার ১:\n${LEADER_ONE_LINK}`,
      threadID,
      messageID
    );
  }

  // ---- গ্রুপ লিডার ২ ----
  if (text === "গ্রুপ লিডার ২" || text === "গ্রুপ লিডার two" || text === "leader 2") {
    return api.sendMessage(
      `👥 আমাদের ফাউন্ডেশনের গ্রুপ লিডার ২:\n${LEADER_TWO_LINK}`,
      threadID,
      messageID
    );
  }

  // ---- গ্রুপ লিডার ৩ ----
  if (text === "গ্রুপ লিডার ৩" || text === "গ্রুপ লিডার three" || text === "leader 3") {
    return api.sendMessage(
      `💫 আমাদের ফাউন্ডেশনের গ্রুপ লিডার ৩:\n${LEADER_THREE_LINK}`,
      threadID,
      messageID
    );
  }
};

module.exports.run = function({ api, event }) {
  api.sendMessage(
    "এই ফাইলটি স্বয়ংক্রিয়ভাবে 'সভাপতি' বা 'গ্রুপ লিডার ১/২/৩' মেসেজে লিংক পাঠাবে ✅",
    event.threadID
  );
};
