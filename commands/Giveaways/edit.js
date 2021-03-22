const Command = require("../../Base/Command");
const ms = require("ms");
const num = require("num-parse");

class GEdit extends Command {
    constructor(client) {
        super(client, {
            name: "edit",
            description: "*Permet d'éditer un giveaway.*",
            usage: ["edit <giveaway_id> <time> <winners> <prize>"],
            aliases: ["g-edit", "edit-giveaway", "giveaway-edit", "gedit"]
        });
    }

    async run(message, args, Discord) {
        if (!message.member.hasPermission("MANAGE_GUILD") && !message.member.roles.cache.some(r => r.name.toLowerCase() === "giveaway")) return message.channel.send("*Permissions manquantes.*");
        let id = args[0];
        if (!id) return message.channel.send("*Il faut indiquer l'identifient du giveaway.*");
        let hasGiveaway = this.client.GiveawayManager.giveaways.find((g) => g.messageID === id);
        if (!hasGiveaway) {
            return message.channel('*Impossible de trouver un giveaway avec comme id :`' + id + '`.*');
        }
        let time = args[1];
        if (!time) return message.channel.send("*Mauvais usage de la commande, indiquez le nouveau temps de giveaway.*");
        if (ms(time) > ms("10d")) {
            return message.channel.send("*Le giveaway ne peut pas durée plus de 10 jours.*");
        }
        let winners = args[2];
        if (!winners) return message.channel.send("*Mauvais usage de la commande, indiquez le nombre de gagnant(s).*");
        num(winners, 1);
        if (winners > 15) return message.channel.send("*Il est impossible de faire gagner plus de 15 personnes.*");
        let prize = args.slice(3).join(" ");
        if (!prize) return message.channel.send("*Mauvais usage de la commande, indiquez le cadeau.*");

        this.client.GiveawayManager.edit(hasGiveaway.messageID, {
            addTime: ms(time),
            newWinnerCount: parseInt(winners),
            newPrize: prize,
        })
        .then(() => {
            if (message.deletable) message.delete();
            return;
        }).catch((err) => {
            message.channel.send("*Aucun giveaway trouvé pour : `"+id+"`.*");
        });
    }
}

module.exports = GEdit;
