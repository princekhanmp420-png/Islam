const axios = require("axios");
const fs = require("fs");
const moment = require("moment-timezone");

module.exports.config = {
  name: "autoislamic24",
  version: "6.0.0",
  hasPermssion: 2,
  credits: "Joy Ahmed",
  description: "Sends Islamic time message automatically every hour in all groups.",
  commandCategory: "system",
  cooldowns: 5
};

// বাংলা সংখ্যা রূপান্তর
function bnDigits(str) {
  const map = {0:'০',1:'১',2:'২',3:'৩',4:'৪',5:'৫',6:'৬',7:'৭',8:'৮',9:'৯'};
  return String(str).split("").map(ch => map[ch] ?? ch).join("");
}

// বার্তা তৈরি ফাংশন
function buildMessage() {
  const now = moment().tz("Asia/Dhaka");
  const englishDate = now.date();
  const englishMonth = now.format("MMMM");
  const weekday = now.locale("bn").format("dddd");
  const hour = now.format("h");
  const minute = now.format("mm");
  const ampm = now.format("A");

  const banglaMonths = ["বৈশাখ", "জ্যৈষ্ঠ", "আষাঢ়", "শ্রাবণ", "ভাদ্র", "আশ্বিন", "কার্তিক", "অগ্রহায়ণ", "পৌষ", "মাঘ", "ফাল্গুন", "চৈত্র"];
  const hijriMonths = ["মুহাররম", "সফর", "রবিউল আউয়াল", "রবিউস সানি", "জমাদিউল আউয়াল", "জমাদিউস সানি", "রজব", "শাবান", "রমজান", "শাওয়াল", "জিলকদ", "জিলহজ্জ"];

  const banglaMonth = banglaMonths[(now.month() + 8) % 12];
  const hijriMonth = hijriMonths[(now.month() + 2) % 12];
  const banglaDate = bnDigits(englishDate);
  const hijriDate = bnDigits(((englishDate + 9) % 30) || 1);

  return `======= 𝗧𝗜𝗠𝗘 =======
📅 ইংরেজি তারিখ: ${englishDate}
🗒️ মাস: ${englishMonth}
📛 দিন: ${weekday}
🗓️ বাংলা মাস: ${banglaMonth} (${banglaDate})
🕌 ইসলামিক মাস: ${hijriMonth} (${hijriDate})
🕒 সময়: ${hour}:${minute} ${ampm}
━━━━━━━━━━━━━━━
উচ্চারন:- লা-ইলা-হা ইল্লাল্লাহু-মুহাম্মাদুর রাসূলুল্লাহ
⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆
অর্থ:- আল্লাহ ব্যতীত অন্য কোন উপাস্য নাই, মুহাম্মদ (সঃ) আল্লাহর রাসূল।
𝐂𝐫𝐞𝐚𝐭𝐨𝐫 ━➢ আত-তাক্বওয়া ফাউন্ডেশন
`;
}

let lastHourSent = null;

module.exports.onLoad = function ({ api }) {
  console.log("[autoislamic24] ✅ 24-hour Islamic auto message system running...");

  setInterval(async () => {
    const now = moment().tz("Asia/Dhaka");
    const hour = now.hour();
    const minute = now.minute();

    // প্রতি ঘন্টায় (minute === 0) একবার পাঠাবে
    if (minute === 0 && lastHourSent !== hour) {
      lastHourSent = hour;

      const msg = buildMessage();
      const imageUrl = "https://i.ibb.co/WsXh3yY/islamic-bg.jpg"; // ব্যাকগ্রাউন্ড ইমেজ
      const imagePath = __dirname + "/islamic.jpg";

      try {
        const img = await axios.get(imageUrl, { responseType: "arraybuffer" });
        fs.writeFileSync(imagePath, Buffer.from(img.data, "binary"));

        api.getThreadList(100, null, ["INBOX"], (err, list) => {
          if (err || !list) return console.error("[autoislamic24] Thread list error:", err);

          const groups = list.filter(t => t.isGroup).map(t => t.threadID);
          if (!groups.length) return console.log("[autoislamic24] ❌ No groups found.");

          console.log(`[autoislamic24] 🕋 Sending hourly message to ${groups.length} groups (hour: ${hour})`);

          for (const tid of groups) {
            api.sendMessage(
              { body: msg, attachment: fs.createReadStream(imagePath) },
              tid,
              e => {
                if (e) console.error(`[autoislamic24] ❌ Failed to send in ${tid}:`, e);
              }
            );
          }
        });
      } catch (err) {
        console.error("[autoislamic24] Image download error:", err);
      }
    }
  }, 20000); // প্রতি ২০ সেকেন্ডে চেক করবে
};

module.exports.run = () => {};
