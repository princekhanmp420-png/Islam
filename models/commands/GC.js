module.exports.config = {
  name: "groupLeaders",
  version: "2.5.0",
  hasPermssion: 0,
  credits: "SaGor",
  description: "সভাপতি ও একাধিক গ্রুপ লিডারের আইডি লিংক, Message ও Call বাটনসহ পাঠাবে",
  commandCategory: "group",
  usages: "সভাপতি / গ্রুপ লিডার ১ / গ্রুপ লিডার ২ / গ্রুপ লিডার ৩",
  cooldowns: 3,
};

// ---- এখানে তোমার সভাপতি ও লিডারদের তথ্য বসাও ----
const MEMBERS = {
  president: {
    name: "🔰 সভাপতি",
    fbId: "100037165421779", // সভাপতি আইডি
    link: "https://www.facebook.com/Islamic.Fundation"
  },
  leader1: {
    name: "👤 গ্রুপ লিডার ১",
    fbId: "100012345678901", // গ্রুপ লিডার ১ আইডি
    link: "https://www.facebook.com/jsjakariyasony"
  },
  leader2: {
    name: "👥 গ্রুপ লিডার ২",
    fbId: "100023456789012", // গ্রুপ লিডার ২ আইডি
    link: "https://www.facebook.com/rajababu.7381"
  },
  leader3: {
    name: "💫 গ্রুপ লিডার ৩",
    fbId: "100034567890123", // গ্রুপ লিডার ৩ আইডি
    link: "https://www.facebook.com/shamim.mp123"
  }
};

// --- Anti Spam System ---
const talkedRecently = new Set();

module.exports.handleEvent = async function({ api, event }) {
  const { threadID, messageID, senderID, body } = event;
  if (!body) return;

  const text = body.toLowerCase().trim();

  // স্প্যাম প্রটেকশন
  if (talkedRecently.has(senderID)) return;
  talkedRecently.add(senderID);
  setTimeout(() => talkedRecently.delete(senderID), 2000);

  let member;

  if (text === "সভাপতি" || text === "president") member = MEMBERS.president;
  else if (text === "গ্রুপ লিডার ১" || text === "leader 1") member = MEMBERS.leader1;
  else if (text === "গ্রুপ লিডার ২" || text === "leader 2") member = MEMBERS.leader2;
  else if (text === "গ্রুপ লিডার ৩" || text === "leader 3") member = MEMBERS.leader3;

  if (!member) return;

  const messageLink = `https://m.me/${member.fbId}`;
  const callLink = `https://m.me/${member.fbId}?call`;

  const messageText =
`⭐ ${member.name}
🔗 প্রোফাইল লিংক: ${member.link}
💬 Message: ${messageLink}
📞 Call: ${callLink}`;

  // ফেসবুক বাটনসহ পাঠানো
  const message = {
    body: messageText,
    attachment: [],
    mentions: [],
    buttons: [
      {
        type: "web_url",
        url: member.link,
        title: "🌐 Profile"
      },
      {
        type: "web_url",
        url: messageLink,
        title: "💬 Message"
      },
      {
        type: "web_url",
        url: callLink,
        title: "📞 Call"
      }
    ]
  };

  try {
    await api.sendMessage(message, threadID, messageID);
  } catch {
    api.sendMessage(messageText, threadID, messageID);
  }
};

module.exports.run = function({ api, event }) {
  api.sendMessage(
    "✅ এই বটটি নিচের কীওয়ার্ডে সভাপতি বা গ্রুপ লিডারের আইডি লিংক Message ও Call বাটনসহ পাঠাবে:\n\n" +
    "👉 সভাপতি\n👉 গ্রুপ লিডার ১\n👉 গ্রুপ লিডার ২\n👉 গ্রুপ লিডার ৩",
    event.threadID
  );
};
