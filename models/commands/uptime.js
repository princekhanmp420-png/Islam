const o = require("os");
const p = require("process");

module.exports.config = {
  name: "uptime",
  version: "0.0.1",
  hasPermssion: 0,
  credits: "ArYAN",
  description: "Shows bot and system uptime with detailed info",
  commandCategory: "system",
  usages: "{pn}",
  cooldowns: 5
};

module.exports.run = async function({ api, event }) {
  const m = await api.sendMessage("🔎 | Checking...", event.threadID, event.messageID);

  try {
    const nix = "─".repeat(40);

    const sT = Date.now();
    await api.sendMessage("⏱️", event.threadID);
    const pi = Date.now() - sT;

    const uT = p.uptime() * 1000;
    const tS = Math.floor(uT / 1000);
    const dd = Math.floor(tS / (3600 * 24));
    const hh = Math.floor((tS % (3600 * 24)) / 3600);
    const mm = Math.floor((tS % 3600) / 60);
    const ss = tS % 60;
    const rt = `${dd}d ${hh}h ${mm}m ${ss}s`;

    const ot = o.type();
    const oa = o.arch();
    const v = p.version;
    const c = o.cpus()[0]?.model || "Unknown CPU";

    const tm = (o.totalmem() / 1024 / 1024).toFixed(2);
    const fm = (o.freemem() / 1024 / 1024).toFixed(2);
    const ru = (p.memoryUsage().rss / 1024 / 1024).toFixed(2);

    const nw = new Date();
    const dt = nw.toLocaleDateString("en-US", { timeZone: "Asia/Dhaka" });
    const tt = nw.toLocaleTimeString("en-US", { hour12: false, timeZone: "Asia/Dhaka" });

    const uC = global.data?.allUserID?.length || 0;
    const tC = global.data?.allThreadID?.length || 0;

    const info = `
♡   ∩_∩
 （„• ֊ •„)♡
╭─∪∪────────────⟡
│𝙿𝚁𝙸𝙽𝙲𝙴 𝙱𝙾𝚃 𝚄𝙿𝚃𝙸𝙼𝙴 𝙸𝙽𝙵𝙾
├${nix}⟡
│ ⏰ 𝗥𝗨𝗡𝗧𝗜𝗠𝗘
│  ${rt}
├${nix}⟡
│ 👑 𝗦𝗬𝗦𝗧𝗘𝗠 𝗜𝗡𝗙𝗢
│𝙾𝚂: ${ot} ${oa}
│𝙻𝙰𝙽𝙶 𝚅𝙴𝚁: ${v}
│𝙲𝙿𝚄 𝙼𝙾𝙳𝙴𝙻: ${c}
│𝚁𝙰𝙼 𝚄𝚂𝙀: ${ru} MB
│𝚃𝙾𝚃𝙰𝙻 𝚁𝙰𝙼: ${tm} MB
│𝙵𝚁𝙴𝙴 𝚁𝙰𝙼: ${fm} MB
├${nix}⟡
│ ✅ 𝗢𝗧𝗛𝗘𝗥 𝙸𝙽𝗙𝗢
│𝙳𝙰𝚃𝙴: ${dt}
│𝚃𝙸𝙼𝙴: ${tt}
│𝙿𝙸𝙽𝙶: ${pi}ms
│𝚄𝚂𝙴𝚁𝚂: ${uC}
│𝚃𝙷𝚁𝙴𝙰𝙳𝚂: ${tC}
│𝚂𝚃𝙰𝚃𝚄𝚂: ✅ | Smooth System
╰${nix}⟡
`;

    if (m?.messageID) api.unsendMessage(m.messageID);
    api.sendMessage(info, event.threadID, event.messageID);

  } catch (e) {
    if (m?.messageID) api.unsendMessage(m.messageID);
    api.sendMessage("❌", event.threadID, event.messageID);
  }
};
