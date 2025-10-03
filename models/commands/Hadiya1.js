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
  nagad: "01615101797",
  bkash: "01615101797",
  rocket: "01615101797"
};

// ফ্লেক্সিবল কীওয়ার্ড (বাংলা + ইংরেজি + ভ্যারিয়েশন)
const patterns = {
  nagad: /(নগদ|nagad|nagadh?|নগদে|Nagad(e|er)?)/i,
  bkash: /(বিকাশ|বিক্যাশ|বিকাশে|বিকাশের?|Bkash|b[\s-]?kash)/i,
  rocket: /(রকেট|Rocket|roket|রকেটে|rocket(e|er)?)/i
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
        matched === "Nagad" ? "নগদ" :
        matched === "Bkash" ? "বিকাশ" : "রকেট";
         matched === "Rocket" ? "রকেট"

      // natural AI-style রিপ্লাই
      const responses = [
        `❤️ ${userName}, অবশ্যই আপনি স্ক্রিনশট দিবেন এবং শেষের নাম্বারটি বলবেন \n আপনি চাইলেন ${serviceLabel} এর নাম্বার\n\n📱 ${number}`,
        `❣️ ${userName}, অবশ্যই টাকা পাঠানোর পরে শেষের নাম্বার এবং স্ক্রিনশট দিবেন\n আপনি চেয়েছেন ${serviceLabel} এর নাম্বার:\n\n👉 ${number}`,
        `💖আপনাকে ${serviceLabel} নাম্বারটি দেয়া হলো:\n\n${number}\n\n অবশ্যই টাকা পাঠানোর পরে স্ক্রিনশট এবং কিসের নাম্বার বলবেন প্রিয়, ${userName}!`
      ];

      // র‍্যান্ডম উত্তর বেছে নেওয়া (AI style)
      const msg = responses[Math.floor(Math.random() * responses.length)];

      api.sendMessage(msg, threadID, (sendErr) => {
        if (!sendErr) {
          try {
            const reactions = { nagad: "🖤", bkash: "😍", rocket: "💖" };
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
