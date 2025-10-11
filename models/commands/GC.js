module.exports.config = {
  name: "groupLeaders",
  version: "1.1.0",
  hasPermssion: 0,
  credits: "SaGor",
  description: "সভাপতি ও একাধিক গ্রুপ লিডারের লিংক এবং মেসেজ অপশন পাঠাবে",
  commandCategory: "group",
  usages: "সভাপতি / গ্রুপ লিডার ১ / গ্রুপ লিডার ২ / গ্রুপ লিডার ৩",
  cooldowns: 3,
};

// ---- এখানে তোমার লিংকগুলো বসাও ----
const PRESIDENT_ID = "Islamic.Fundation"; // সভাপতি
const LEADER_ONE_ID = "jsjakariyasony"; // গ্রুপ লিডার ১
const LEADER_TWO_ID = "rajababu.7381"; // গ্রুপ লিডার ২
const LEADER_THREE_ID = "shamim.mp123"; // গ্রুপ লিডার ৩

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

  // ফাংশন: প্রোফাইল লিংক ও মেসেজ বাটন পাঠাবে
  const sendLeaderInfo = (name, id, emoji) => {
    const profileLink = `https://www.facebook.com/${id}`;
    const messengerLink = `https://m.me/${id}`;
    const msg = {
      body: `${emoji} ${name}\n🔗 প্রোফাইল: ${profileLink}`,
      buttons: [
        {
          type: "web_url",
          url: profileLink,
          title: "🌐 প্রোফাইল দেখুন"
        },
        {
          type: "web_url",
          url: messengerLink,
          title: "💬 ইনবক্সে মেসেজ করুন"
        }
      ]
    };
    api.sendMessage(msg, threadID, messageID);
  };

  // ---- সভাপতি ----
  if (text === "সভাপতি" || text === "president") {
    return sendLeaderInfo("আমাদের ফাউন্ডেশনের সভাপতি", PRESIDENT_ID, "🔰");
  }

  // ---- গ্রুপ লিডার ১ ----
  if (text === "গ্রুপ লিডার ১" || text === "leader 1" || text === "গ্রুপ লিডার one") {
    return sendLeaderInfo("গ্রুপ লিডার ১", LEADER_ONE_ID, "👤");
  }

  // ---- গ্রুপ লিডার ২ ----
  if (text === "গ্রুপ লিডার ২" || text === "leader 2" || text === "গ্রুপ লিডার two") {
    return sendLeaderInfo("গ্রুপ লিডার ২", LEADER_TWO_ID, "👥");
  }

  // ---- গ্রুপ লিডার ৩ ----
  if (text === "গ্রুপ লিডার ৩" || text === "leader 3" || text === "গ্রুপ লিডার three") {
    return sendLeaderInfo("গ্রুপ লিডার ৩", LEADER_THREE_ID, "💫");
  }
};

module.exports.run = function({ api, event }) {
  api.sendMessage(
    "এই ফাইলটি স্বয়ংক্রিয়ভাবে 'সভাপতি' বা 'গ্রুপ লিডার ১/২/৩' মেসেজে লিংক ও ইনবক্স অপশন পাঠাবে ✅",
    event.threadID
  );
};
