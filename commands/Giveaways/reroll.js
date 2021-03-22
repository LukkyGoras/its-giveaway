const Command = require("../../Base/Command");
const ms = require("ms");

class Reroll extends Command {
    constructor(client) {
        super(client, {
            name: "reroll",
            description: "*Permet de reroll le giveaway.*",
            usage: ["reroll <giveaway_id>"],
            aliases: ["g-reroll", "reroll-giveaway", "giveaway-reroll", "greroll"]
        });
    }

    async run(message, args, Discord) {
        if (!message.member.hasPermission("MANAGE_GUILD") && !message.member.roles.cache.some(r => r.name.toLowerCase() === "giveaway")) return message.channel.send("❌ | You don't have `MANAGE_GUILD` permission or `Giveaway` role to manage giveaways!");
        let id = args[0];
        if (!id) return message.channel.send("*Il faut indiquer l'identifient du giveaway.*");
        let hasGiveaway = this.client.GiveawayManager.giveaways.find((g) => g.messageID === id);
        if (!hasGiveaway) {
            return message.channel('*Impossible de trouver un giveaway avec comme id :`' + id + '`.*');
        }
        this.client.GiveawayManager.reroll(hasGiveaway.messageID, {
            messages: {
                congrat: "🎉 Nouveau gagnant(s) : {winners}! 🎉",
                error: "*Participation invalide.*"
            }
        })
            .then(() => {
                if (message.deletable) message.delete();
            })
            .catch((e) => {
                message.channel.send("*Aucun giveaway trouvé pour : `"+id+"`.*");
            });
    }
}

module.exports = Reroll;
