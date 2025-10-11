module.exports.config = {
  name: "groupLeaders",
  version: "1.2.0",
  hasPermssion: 0,
  credits: "SaGor",
  description: "সভাপতি ও গ্রুপ লিডারদের প্রোফাইল লিংক ও ইনবক্স বাটন পাঠাবে",
  commandCategory: "group",
  usages: "সভাপতি | গ্রুপ লিডার ১ | গ্রুপ লিডার ২ | গ্রুপ লিডার ৩",
  cooldowns: 3,
};

// এখানে আসল ফেসবুক ইউজারনেম বা আইডি বসাও
const leaders = {
  "সভাপতি": {
    name: "সভাপতি মাহবুব রহমান",
    id: "Islamic.Fundation" // Username বা numeric ID
  },
  "গ্রুপ লিডার ১": {
    name: "গ্রুপ লিডার রানা",
    id: "jsjakariyasony"
  },
  "গ্রুপ লিডার ২": {
    name: "গ্রুপ লিডার সাগর",
    id: "rajababu.7381"
  },
  "গ্রুপ লিডার ৩": {
    name: "গ্রুপ লিডার শামীম",
    id: "shamim.mp123"
  }
};

// --- Anti Spam System ---
const talkedRecently = new Set();

module.exports.handleEvent = async function({ api, event }) {
  const { threadID, messageID, senderID, body } = event;
  if (!body) return;

  // স্প্যাম প্রটেকশন (৩ সেকেন্ড)
  if (talkedRecently.has(senderID)) return;
  talkedRecently.add(senderID);
  setTimeout(() => talkedRecently.delete(senderID), 3 * 1000);

  const text = body.toLowerCase().trim();
  let selected = null;

  // কোন লিডারের নাম এসেছে সেটা চেক করা
  for (const key in leaders) {
    if (text === key.toLowerCase()) {
      selected = leaders[key];
      break;
    }
  }

  // কিছু না পেলে কিছু করবে না
  if (!selected) return;

  // প্রোফাইল ও মেসেঞ্জার লিংক তৈরি
  const profileLink = `https://www.facebook.com/${selected.id}`;
  const messengerLink = `https://m.me/${selected.id}`;

  // মেসেজ পাঠানো
  const msg = {
    body: `👤 ${selected.name}\n🔗 প্রোফাইল: ${profileLink}`,
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

module.exports.run = function({ api, event }) {
  api.sendMessage(
    "এই বট 'সভাপতি' বা 'গ্রুপ লিডার ১/২/৩' লিখলে সংশ্লিষ্ট আইডির প্রোফাইল ও মেসেজ অপশন পাঠাবে ✅",
    event.threadID
  );
};
