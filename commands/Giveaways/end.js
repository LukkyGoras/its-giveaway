const Command = require("../../Base/Command");
const ms = require("ms");

class GEnd extends Command {
    constructor(client) {
        super(client, {
            name: "end",
            description: "*Permet de mettre fin au giveaway.*",
            usage: ["end <giveaway_id>"],
            aliases: ["g-end", "end-giveaway", "giveaway-end", "gend", "stop"]
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
        this.client.GiveawayManager.edit(hasGiveaway.messageID, {
            setEndTimestamp: Date.now()
        })
        .then(() => {
            message.channel.send('*Giveaway fini dans ' + (this.client.GiveawayManager.options.updateCountdownEvery / 1000) + ' secondes...*').then(m => m.delete({ timeout: 2000 }));
        })
        .catch((e) => {
            message.channel.send("*Une erreur est survenue :* ```js\n"+e.message + "```");
        });
        if (message.deletable) message.delete();
        return;
    }
}

module.exports = GEnd;
