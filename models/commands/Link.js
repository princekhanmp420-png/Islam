module.exports.config = {
    name: "linkShare",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "SaGor",
    description: "কেউ গ্রুপ বা পেজের লিংক চাইলে বট রিপ্লাই দিবে",
    commandCategory: "group",
    usages: "auto link reply (group/page)",
    cooldowns: 3,
};

module.exports.run = async function () {
    // এখানে কিছু লাগবে না
};

module.exports.handleEvent = async function ({ api, event }) {
    try {
        // 🔗 এখানে তোমার আসল গ্রুপ ও পেজ লিংক বসাও
        const groupLink = "https://www.facebook.com/groups/your-group-id";
        const pageLink = "https://www.facebook.com/your-page-id";

        const msg = event.body?.toLowerCase() || "";

        // ✅ গ্রুপ সম্পর্কিত শব্দ
        const groupKeywords = [
            "group link",
            "gc link",
            "গ্রুপ লিংক",
            "গ্রুপের লিংক",
            "গ্রুপ লিংক দাও",
            "group er link",
            "ফেসবুক গ্রুপের লিংক দাও",
            "Facebook group link"
        ];

        // ✅ পেজ সম্পর্কিত শব্দ
        const pageKeywords = [
            "Page link",
            "page dao",
            "ফেসবুক পেজ",
            "পেজ লিংক",
            "page er link",
            "ফেসবুক পেজের লিংক",
            "Facebook page link"
        ];

        // 🟩 গ্রুপ লিংক চাইলে
        if (groupKeywords.some(key => msg.includes(key))) {
            const reply = `এই নিন আমাদের Facebook Group লিংক:\n\n👉 ${https://facebook.com/groups/islamik.life1/} \nগ্রুপে জয়েন হয়ে\n বেশি বেশি ইসলামিক পোস্ট করুন এবং ইসলামকে বিশ্বের মাঝে ছড়িয়ে দিন🌸\n মনে রাখবেন আপনার একটি পোস্টে বদলে যেতে পারে একজন বেনামাজি এবং নাস্তিক এর জীবন🌸`;
            return api.sendMessage(reply, event.threadID, event.messageID);
        }

        // 🟦 পেজ লিংক চাইলে
        if (pageKeywords.some(key => msg.includes(key))) {
            const reply = `🌐 এই নিন আমাদের Facebook Page লিংক:\n\n👉 ${https://www.facebook.com/Islamic.Fundation}\n ফলো করে দিবেন\n অবশ্যই আমাদের সব ধরনের নিউজ এবং কি সব ধরনের খবর এই পেজে আমরা পোস্ট করবো সবাই লাইক কমেন্ট করে আমাদের উৎসাহিত করবেন💖 `;
            return api.sendMessage(reply, event.threadID, event.messageID);
        }

    } catch (err) {
        console.error("linkShare error:", err);
    }
};
