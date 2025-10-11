module.exports.config = {
    name: "mentionReply",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "SaGor",
    description: "নির্দিষ্ট আইডি mention করলে বট আলাদা আলাদা রিপ্লাই দিবে",
    commandCategory: "group",
    usages: "auto mention reply",
    cooldowns: 5,
};

module.exports.run = async function () {
    // এখানে কিছু লাগবে না
};

module.exports.handleEvent = async function ({ api, event }) {
    try {
        // ✅ এখানে UID + Reply Message সেট করুন
        const targetUsers = {
            "100061238340438": "👉 {name}\n😎 তুমি হলেন ফাউন্ডেশন এর গ্রুপ লিডার আপনার সকল কথা উনার সাথে শেয়ার করতে পারেন",
            "61567612797403": "👉 {name}\n🥰 উনি হলেন ফাউন্ডেশন এর গ্রুপ লিডার আপনার কোন কিছু জানার থাকলে অবশ্যই বলবেন",
            "100055252026779": "👉 {name}\n🤧 ফাউন্ডেশনের যেকোনো পরামর্শে আমরা আপনাদের সাথে আছি"
        };

        const mentions = Object.keys(event.mentions || {});
        if (mentions.length > 0) {
            for (let uid of mentions) {
                if (targetUsers[uid]) {
                    let name = event.mentions[uid];
                    let replyMsg = targetUsers[uid].replace("{name}", name);

                    return api.sendMessage(replyMsg, event.threadID, event.messageID);
                }
            }
        }
    } catch (err) {
        console.error("mentionReply error:", err);
    }
};
