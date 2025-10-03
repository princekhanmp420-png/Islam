module.exports.config = {
	name: "info",
	version: "1.0.1", 
	hasPermssion: 0,
	credits: "JOY",
	description: "Admin and Bot info.",
	commandCategory: "...",
	cooldowns: 1,
	dependencies: 
	{
    "request":"",
    "fs-extra":"",
    "axios":""
  }
};
module.exports.run = async function({ api,event,args,client,Users,Threads,__GLOBAL,Currencies }) {
const axios = global.nodemodule["axios"];
const request = global.nodemodule["request"];
const fs = global.nodemodule["fs-extra"];
const time = process.uptime(),
		hours = Math.floor(time / (60 * 60)),
		minutes = Math.floor((time % (60 * 60)) / 60),
		seconds = Math.floor(time % 60);
const moment = require("moment-timezone");
var juswa = moment.tz("Asia/Dhaka").format("『D/MM/YYYY』 【HH:mm:ss】");
var link =                                     
["https://i.imgur.com/FJpu40m.jpeg"];
var callback = () => api.sendMessage({body:` 𝐀𝐃𝐌𝐈𝐍 𝐀𝐍𝐃 𝐁𝐎𝐓 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍 


𝐁𝐎𝐓 𝐍𝐀𝐌𝐄 : ${global.config.BOTNAME}

𝐁𝐎𝐓 𝐀𝐃𝐌𝐈𝐍 : আত- তাক্বওয়া ফাউন্ডেশন

𝐅𝐀𝐂𝐄𝐁𝐎𝐎𝐊 : https://www.facebook.com/Islamic.Fundation🖤

𝐀𝐃𝐃𝐑𝐄𝐒𝐒 : ফেসবুকে ইসলামিক কাজের জন্য সবাইকে আমন্ত্রণ জানানো হলো 🥰

𝐎𝐓𝐇𝐄𝐑 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐍𝐓𝐈𝐎𝐍

✧══════•❁❀❁•══════✧

𝐁𝐎𝐓 𝐏𝐑𝐄𝐅𝐈𝐗 : ${global.config.PREFIX}

𝐁𝐎𝐓 𝐎𝐖𝐍𝐄𝐑 : আত- তাক্বওয়া ফাউন্ডেশন

🥳𝐔𝐏𝐓𝐈𝐌𝐄🥳

🌪️𝐓𝐨𝐝𝐚𝐲 𝐢𝐬🌪️ ☞︎︎︎☜︎︎︎✰ ${juswa} 

⚡𝐁𝐨𝐭 𝐢𝐬 𝐑𝐮𝐧𝐧𝐢𝐧𝐠⚡ ${hours}:${minutes}:${seconds}.

✅𝐓𝐡𝐚𝐧𝐤𝐬 𝐅𝐨𝐫 𝐔𝐬𝐢𝐧𝐠 ${global.config.BOTNAME} Bot🖤





`,attachment: fs.createReadStream(__dirname + "/cache/juswa.jpg")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/juswa.jpg")); 
      return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache/juswa.jpg")).on("close",() => callback());
   };
