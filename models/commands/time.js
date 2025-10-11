const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "hourlyclock",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "Joy",
  description: "Every hour send the Islamic time template message to configured chats.",
  commandCategory: "system",
  usages: "setclock | unsetclock | clockstatus",
  cooldowns: 5
};

const DATA_FILE = path.join(__dirname, "hourlyclock_targets.json");

function loadTargets() {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8")) || [];
  } catch (e) {
    return [];
  }
}
function saveTargets(arr) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(Array.from(new Set(arr)), null, 2));
}

function bnDigits(numStr) {
  // Convert western digits to Bengali digits
  const map = {0:'০',1:'১',2:'২',3:'৩',4:'৪',5:'৫',6:'৬',7:'৭',8:'৮',9:'৯'};
  return String(numStr).split("").map(ch => map[ch] ?? ch).join("");
}

function buildMessage() {
  const now = new Date();
  const engDate = now.getDate();
  const engMonth = now.toLocaleString("en-US", { month: "long" });
  const weekday = now.toLocaleString("en-US", { weekday: "long" });
  // Bengali numerals for day and time
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  const bnHourStr = bnDigits(hour12);
  const bnMinStr = bnDigits(minutes.toString().padStart(2, "0"));
  const bnDate = bnDigits(engDate);

  // NOTE: Bangla month (Bangla calendar) conversion is complex. 
  // We'll show English month name and also let you edit template easily.
  const message =
`======= 𝗧𝗜𝗠𝗘 =======
📅 ইংরেজি তারিখ: ${engDate}
🗒️ মাস : ${engMonth}
📛 দিন: ${weekday}
🗓️ (বাংলা মাস/তারিখ প্রয়োজন হলে কনফিগার করুন)
🕒 সময়: ${hour12}:${String(minutes).padStart(2,"0")} ${ampm}
━━━━━━━━━━━━━━━
উচ্চারন:- লা-ইলা-হা ইল্লাল্লাহু-মুহাম্মাদুর রাসূলুল্লাহ
⋆✦⋆⎯⎯⎯⎯⎯⎯⎯⎯⋆✦⋆
অর্থ:- আল্লাহ ব্যতীত অন্য কোন উপাস্য নাই, মুহাম্মদ (সঃ) আল্লাহর রাসূল।
𝐂𝐫𝐞𝐚𝐭𝐨𝐫 ━➢ আত-তাক্বওয়া ফাউন্ডেশন

(বাংলা সংখ্যায়: ${bnDate}, সময়: ${bnHourStr}:${bnMinStr} ${ampm})`;

  return message;
}

// Keep track to avoid duplicate sends within same hour
let lastSentAtHour = null;
let timer = null;

module.exports.onLoad = function ({ api }) {
  const targets = loadTargets();
  // schedule check every 20 seconds
  timer = setInterval(() => {
    try {
      const now = new Date();
      const m = now.getMinutes();
      const s = now.getSeconds();
      const h = now.getHours();
      // trigger when minute === 0 and seconds between 0..20 and not sent yet this hour
      if (m === 0 && s < 25 && lastSentAtHour !== h) {
        lastSentAtHour = h;
        const msg = buildMessage();
        for (const tid of targets) {
          // each target may be {threadID} string or number
          try {
            api.sendMessage(msg, tid);
          } catch (e) {
            console.error("hourlyclock: failed send to", tid, e);
          }
        }
      }
    } catch (err) {
      console.error("hourlyclock error:", err);
    }
  }, 20000);
  console.log("[hourlyclock] Loaded. Targets:", targets.length);
};

module.exports.onUnLoad = function () {
  if (timer) clearInterval(timer);
  console.log("[hourlyclock] Unloaded.");
};

module.exports.run = async function ({ api, event, args, Users }) {
  const { senderID, threadID } = event;
  const sub = args[0] ? args[0].toLowerCase() : "";

  let targets = loadTargets();

  if (sub === "setclock") {
    if (!targets.includes(threadID)) {
      targets.push(threadID);
      saveTargets(targets);
      return api.sendMessage("✅ এই চ্যাটে প্রতি ঘন্টায় সময় পাঠানো চালু করা হল।\nবন্ধ করতে: `unsetclock`", threadID);
    } else {
      return api.sendMessage("এই চ্যাটে আগেই চালু আছে।", threadID);
    }
  }

  if (sub === "unsetclock") {
    if (targets.includes(threadID)) {
      targets = targets.filter(t => t !== threadID);
      saveTargets(targets);
      return api.sendMessage("⛔ এই চ্যাটের ঘন্টার বার্তা বন্ধ করা হয়েছে।", threadID);
    } else {
      return api.sendMessage("এই চ্যাটে তো চালু নেই।", threadID);
    }
  }

  if (sub === "clockstatus") {
    const list = targets.length ? targets.map((t, i) => `${i+1}. ${t}`).join("\n") : "কোনো চ্যানেলে চালু নেই।";
    return api.sendMessage(`📌 HourlyClock targets:\n${list}`, threadID);
  }

  // If no subcommand, show help
  return api.sendMessage(
    "HourlyClock module\n\nCommands:\n• setclock — এই চ্যাঁটে প্রতি ঘন্টায় বার্তা পাঠাবেন\n• unsetclock — বন্ধ করতে\n• clockstatus — চালু চ্যানেলগুলো দেখবে\n\nউদাহরণ: `setclock`", threadID
  );
};
