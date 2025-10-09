const axios = require("axios");
const apiUrl = "https://baby-apis-nix.vercel.app";

const initialReplies = [
  "ওয়ালাইকুম আসসালাম", 
  "ওয়ালাইকুম আসসালাম😚", 
  "ওয়ালাইকুম আসসালাম😘",
  "ওয়ালাইকুম আসসালাম🥰", 
  "ওয়ালাইকুম আসসালাম🤗", 
  "ওয়ালাইকুম আসসালাম", 
  "ওয়ালাইকুম আসসালাম🫶🥀",
];

const getRand = () => initialReplies[Math.floor(Math.random() * initialReplies.length)];

module.exports.config = {
  name: "baby",
  version: "2.1.0",
  hasPermssion: 0,
  credits: "ArYAN",
  description: "AI chat bot with learning",
  commandCategory: "CHAT",
  usages: "[message/query]\n[msg]\nteach [msg] - [reply1, reply2]\nteach react [msg] - [react1, react2]\nremove [msg]\nrm [msg] - [index or reply]\nlist all\nlist\nedit [msg] - [oldReply] - [newReply]",
  cooldowns: 0,
  prefix: false
};

async function handleReplyMsg(api, event, text) {
  try {
    const res = await axios.get(`${apiUrl}/baby?text=${encodeURIComponent(text)}&senderID=${event.senderID}&font=1`);
    const rep = res?.data?.reply;
    
    if (rep && typeof rep === 'string' && rep.trim().length > 0) {
      api.sendMessage(rep, event.threadID, (err, info) => {
        if (!err) {
          global.client.handleReply.push({
            name: module.exports.config.name,
            messageID: info.messageID,
            author: event.senderID,
            type: "baby"
          });
        }
      }, event.messageID);
    } else {
      api.sendMessage("❌ | No response found. Please teach me!", event.threadID, event.messageID);
    }
  } catch (e) {
    console.error("Baby API error:", e);
    api.sendMessage("❌ | Failed to fetch reply from API.", event.threadID, event.messageID);
  }
}

module.exports.run = async function ({ api, event, args, Users }) {
  try {
    const uid = event.senderID;
    const senderName = await Users.getNameUser(uid);
    const query = args.join(" ").trim();

    if (!query) {
      const randomReply = getRand();
      return api.sendMessage({
        body: `${senderName}, ${randomReply}`,
        mentions: [{ tag: `${senderName}`, id: uid }]
      }, event.threadID, (err, info) => {
        if (!err) {
          global.client.handleReply.push({
            name: module.exports.config.name,
            messageID: info.messageID,
            author: event.senderID,
            type: "baby"
          });
        }
      }, event.messageID);
    }

    if (args[0] === "remove") {
      const key = query.slice(7).trim();
      if (!key) return api.sendMessage("❌ | Use: remove [msg]", event.threadID, event.messageID);
      const res = await axios.get(`${apiUrl}/baby-remove?key=${encodeURIComponent(key)}`);
      return api.sendMessage(res.data.message || "Removed", event.threadID, event.messageID);
    }

    if (args[0] === "rm") {
      const parts = query.slice(3).split(/\s*-\s*/).map(p => p.trim());
      const key = parts[0];
      const repOrIdx = parts[1];

      if (!key || repOrIdx === undefined) {
        return api.sendMessage("❌ | Use: rm [msg] - [reply/index]", event.threadID, event.messageID);
      }
      
      const param = (!isNaN(parseInt(repOrIdx)) && String(parseInt(repOrIdx)) === repOrIdx && parseInt(repOrIdx) > 0)
          ? `index=${encodeURIComponent(repOrIdx)}`
          : `reply=${encodeURIComponent(repOrIdx)}`;

      const res = await axios.get(`${apiUrl}/baby-remove?key=${encodeURIComponent(key)}&${param}`);
      return api.sendMessage(res.data.message || "Removed", event.threadID, event.messageID);
    }

    if (args[0] === "list") {
      if (args[1] === "all") {
        const tRes = await axios.get(`${apiUrl}/teachers`);
        const teachers = tRes.data.teachers || {};
        const sorted = Object.keys(teachers).sort((a, b) => teachers[b] - teachers[a]);
        const list = await Promise.all(sorted.map(async id => {
          const name = await Users.getNameUser(id).catch(() => id);
          return `• ${name}: ${teachers[id]}`;
        }));
        return api.sendMessage(`👑 | Top Teachers:\n${list.join("\n")}`, event.threadID, event.messageID);
      } else {
        const infoRes = await axios.get(`${apiUrl}/baby-info`);
        return api.sendMessage(
          `❇️ | Total Keys Taught = ${infoRes.data.totalKeys || "api off"}\n♻️ | Total Responses = ${infoRes.data.totalReplies || "api off"}`,
          event.threadID,
          event.messageID
        );
      }
    }

    if (args[0] === "edit") {
      const parts = query.split(/\s*-\s*/).map(p => p.trim()); 
      
      if (parts.length < 3) {
        return api.sendMessage("❌ | Use: edit [msg] - [oldReply] - [newReply]", event.threadID, event.messageID);
      }
      
      const oldMsg = parts[0].replace("edit", "").trim();
      const oldReply = parts[1];
      const newReply = parts[2];
      
      if (!oldMsg || !oldReply || !newReply) {
         return api.sendMessage("❌ | Use: edit [msg] - [oldReply] - [newReply]", event.threadID, event.messageID);
      }
      
      const res = await axios.get(`${apiUrl}/baby-edit?key=${encodeURIComponent(oldMsg)}&oldReply=${encodeURIComponent(oldReply)}&newReply=${encodeURIComponent(newReply)}&senderID=${uid}`);
      return api.sendMessage(res.data.message || "Edited successfully.", event.threadID, event.messageID);
    }

    if (args[0] === "teach" && args[1] === "react") {
      const parts = query.split(/\s*-\s*/).map(p => p.trim());
      const final = parts[0].replace("teach react", "").trim();
      const cmd = parts[1];
      
      if (!final || !cmd) {
        return api.sendMessage("❌ | Invalid format! Use: teach react [msg] - [react1, react2]", event.threadID, event.messageID);
      }
      const res = await axios.get(`${apiUrl}/baby?teach=${encodeURIComponent(final)}&react=${encodeURIComponent(cmd)}&senderID=${uid}`);
      return api.sendMessage(`✅ Replies added ${res.data.message}`, event.threadID, event.messageID);
    }

    if (args[0] === "teach") {
      const parts = query.split(/\s*-\s*/).map(p => p.trim());
      const final = parts[0].replace("teach", "").trim();
      const cmd = parts[1];
      
      if (!final || !cmd) {
        return api.sendMessage("❌ | Invalid format! Use: teach [msg] - [reply1, reply2]", event.threadID, event.messageID);
      }
      
      const res = await axios.get(`${apiUrl}/baby?teach=${encodeURIComponent(final)}&reply=${encodeURIComponent(cmd)}&senderID=${uid}`);
      const teacher = await Users.getNameUser(uid).catch(() => uid);
      
      if (res.data.addedReplies?.length === 0) {
        const existingMsg = res.data.existingReplies?.join(", ") || "all replies";
        return api.sendMessage(`❌ | All replies already exist for this question.\nExisting: ${existingMsg}`, event.threadID, event.messageID);
      }
      
      const teachsRes = await axios.get(`${apiUrl}/teachers`);
      const teachCount = teachsRes.data.teachers?.[uid] || 0;
      const addedReplies = res.data.addedReplies?.join(", ") || cmd;
      
      return api.sendMessage(`✅ | Replies added "${addedReplies}" to "${final}".\nTeacher: ${teacher}\nTeachs: ${teachCount}`, event.threadID, event.messageID);
    }

    handleReplyMsg(api, event, query);
  } catch (err) {
    console.error("Error in baby command:", err);
    return api.sendMessage(`❌ | Error in baby command: ${err.message}`, event.threadID, event.messageID);
  }
};

module.exports.handleReply = async function ({ api, event }) {
  if (!event.body) return;
  handleReplyMsg(api, event, event.body.toLowerCase());
};

module.exports.handleEvent = async function ({ api, event, Users }) {
  try {
    if (!event.body) return;
    const raw = event.body.toLowerCase().trim();
    const senderName = await Users.getNameUser(event.senderID);
    const senderID = event.senderID;
    
    const match = raw.match(/^(আসসালামুয়ালাইকুম|আসসালামু আলাইকুম|Asalamualaikum |আসসালামু আলাইকুম|সালাম|Salam|asalamualaikum|Asalamualaikum 🖤|আসসালামু আলাইকুম🥰|আসসালামু আলাইকুম)\s*(.*)/);
    if (!match) return;
    
    const rest = match[2]?.trim();
    
    if (!rest) {
      const randomReply = getRand();
      return api.sendMessage({
        body: `${randomReply} @${senderName}`,
        mentions: [{ tag: `@${senderName}`, id: senderID }]
      }, event.threadID, (err, info) => {
        if (!err) {
          global.client.handleReply.push({
            name: module.exports.config.name,
            messageID: info.messageID,
            author: event.senderID,
            type: "baby"
          });
        }
      }, event.messageID);
    }
    
    handleReplyMsg(api, event, rest);
  } catch (err) {
    console.error("Error in handleEvent:", err);
    return api.sendMessage(`❌ | Error in handleEvent: ${err.message}`, event.threadID, event.messageID);
  }
};
