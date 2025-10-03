const remindedRecently = new Set();

module.exports.config = {
  name: "payAI_natural",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "SaGor + AI",
  description: "কৃত্রিম বুদ্ধিমত্তার মত বাক্য থেকেও বিকাশ/নগদ/রকেট চিনে নম্বর দিবে",
  commandCategory: "utility",
  usages: "বিকাশ | নগদ | রকেট | বাক্য",
  cooldowns: 5
};

// এখানে নিজের নাম্বার বসান
const SERVICE_NUMBERS = {
  nagad: "01XXXXXXXXX",
  bkash: "01YYYYYYYYY",
  rocket: "01ZZZZZZZZZ"
};

// ফ্লেক্সিবল কীওয়ার্ড (বাংলা + ইংরেজি + ভ্যারিয়েশন)
const patterns = {
  nagad: /(নগদ|nagad|nagadh?|নগদে|nagad(e|er)?)/i,
  bkash: /(বিকাশ|বিক্যাশ|বিকাশে|বিকাশের?|bkash|b[\s-]?kash)/i,
  rocket: /(রকেট|rocket|roket|রকেটে|rocket(e|er)?)/i
};

module.exports.handleEvent = function({ api, event }) {
  try {
    const { threadID, messageID, senderID, body } = event;
    if (!body) return;

    const text = body.trim();

    // anti-spam (একই ইউজার 10 সেকেন্ডে একবারই পাবে)
    const key = `${threadID}_${senderID}`;
    if (remindedRecently.has(key)) return;

    // কোন সার্ভিস match করছে?
    let matched = null;
    if (patterns.nagad.test(text)) matched = "nagad";
    else if (patterns.bkash.test(text)) matched = "bkash";
    else if (patterns.rocket.test(text)) matched = "rocket";

    if (!matched) return;

    const number = SERVICE_NUMBERS[matched] || "❌ নম্বর সেট করা হয়নি। অ্যাডমিনের সাথে যোগাযোগ করুন।";

    // ইউজারের নাম নিয়ে natural response
    api.getUserInfo(senderID, (err, info) => {
      const userName = (!err && info && info[senderID]?.name) 
        ? info[senderID].name 
        : "বন্ধু";

      const serviceLabel =
        matched === "nagad" ? "নগদ" :
        matched === "bkash" ? "বিকাশ" : "রকেট";

      // natural AI-style রিপ্লাই
      const responses = [
        `😊 ${userName}, মনে হচ্ছে আপনি ${serviceLabel} এর নম্বর জানতে চাইছেন।\n\n📱 ${number}`,
        `🤖 ${userName}, ${serviceLabel} ব্যবহার করতে চাইলে এই নাম্বারটি ব্যবহার করতে পারেন:\n\n👉 ${number}`,
        `📌 ${serviceLabel} নম্বরটি হলো:\n\n${number}\n\nআপনার জন্য শেয়ার করলাম, ${userName}!`
      ];

      // র‍্যান্ডম উত্তর বেছে নেওয়া (AI style)
      const msg = responses[Math.floor(Math.random() * responses.length)];

      api.sendMessage(msg, threadID, (sendErr) => {
        if (!sendErr) {
          try {
            const reactions = { nagad: "💸", bkash: "🟣", rocket: "🚀" };
            api.setMessageReaction(reactions[matched] || "✅", messageID, () => {}, true);
          } catch (e) {}
        }
      });
    });

    remindedRecently.add(key);
    setTimeout(() => remindedRecently.delete(key), 10000);

  } catch (e) {
    console.error("payAI_natural module error:", e);
  }
};

module.exports.run = function() {};
