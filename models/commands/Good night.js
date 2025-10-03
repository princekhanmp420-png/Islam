module.exports.config = {
    name: "AIGoodNight",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "SaGor",
    description: "কেউ গুড নাইট লিখলে নাম মেনশন করে রিপ্লাই ও রিয়েক্ট দিবে (Spam Fixed)",
    commandCategory: "AI",
    usages: "auto goodnight",
    cooldowns: 5,
};

// --- Anti Spam System ---
const talkedRecently = new Set();

module.exports.handleEvent = function ({ api, event }) {
    const { threadID, messageID, senderID, body } = event;
    if (!body) return;

    // --- Anti Spam Check ---
    if (talkedRecently.has(senderID)) return;

    const text = body.toLowerCase();

    // "good night" বা "গুড নাইট" চেক
    if (text.includes("good night") || text.includes("গুড নাইট") || text.includes("Gd n8")) {
        api.getUserInfo(senderID, (err, info) => {
            if (err) return;
            const userName = info[senderID].name;

            // রিপ্লাই মেসেজ লিস্ট
            const replies = [
                `নামাজ না পড়লে নামাজ পড়ে ঘুমাবেন ${userName}, আল্লাহ আপনার ঘুমকে আরামদায়ক করবে ✨`,
                `এশার নামাজ না পড়লে নামাজ পড়ে ঘুমাবেন ${userName}, কে জানে আপনার হয়তো এই শেষ ঘুম হতে পারে 💖`,
                `ঘুমানোর আগে অবশ্যই নামাজ পড়ে ঘুমের দোয়া পড়ে ঘুমাবেন ${userName},  আপনার শরীর নিরাপদ থাকবে`,
                `আপনি কি এশারের নামাজ পড়েছেন না পড়লে পরে ঘুমাবেন ${userName}, এবং ঘুমের দোয়া পড়ে ঘুমাবেন☀️`
            ];

            const reply = replies[Math.floor(Math.random() * replies.length)];

            api.sendMessage(
                {
                    body: reply,
                    mentions: [{ tag: userName, id: senderID }]
                },
                threadID,
                (err, infoMsg) => {
                    if (!err) {
                        // রিয়েক্ট দিবে 🌙
                        api.setMessageReaction("🌙", messageID, (err) => {}, true);
                    }
                },
                messageID
            );

            // --- Anti Spam Timer (10 সেকেন্ড) ---
            talkedRecently.add(senderID);
            setTimeout(() => {
                talkedRecently.delete(senderID);
            }, 10000);
        });
    }
};

module.exports.run = async function () {
    // এই কমান্ড আলাদা করে রান করার দরকার নেই
    return;
};
