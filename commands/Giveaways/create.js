const Command = require("../../Base/Command");
const ms = require("ms");
const num = require("num-parse");

class GCreate extends Command {
    constructor(client) {
        super(client, {
            name: "create",
            description: "*Permet de crée un giveaway*",
            usage: ["create <time> <winners> <prize>"],
            aliases: ["g-create", "create-giveaway", "giveaway-create", "gcreate", "start"]
        });
    }

    async run(message, args, Discord) {
        if (!message.member.hasPermission("MANAGE_GUILD") && !message.member.roles.cache.some(r => r.name.toLowerCase() === "giveaway")) return message.channel.send("*Permissions manquantes.*");
        if (this.client.GiveawayManager.giveaways.filter((g) => g.guildID === message.guild.id && !g.ended).length + 1 > 3) return message.channel.send("*Impossible de crée plus de 3 giveaway.*");
        let time = args[0];
        if (!time) return message.channel.send("*Mauvais usage de la commande, faîtes : #create <temps> <winner> <price>.*");
        if (ms(time) > ms("10d")) {
            return message.channel.send("*Le giveaway ne peut pas durée plus de 10 jours.*");
        }
        let winners = args[1];
        if (!winners) return message.channel.send("*Mauvais usage de la commande, indiquez le nombre de gagnant(s).*");
        winners = num(winners, 1);
        if (winners > 15) return message.channel.send("*Il est impossible de faire gagner plus de 15 personnes.*");
        let prize = args.slice(2).join(" ");
        if (!prize) return message.channel.send("*Mauvais usage de la commande, indiquez le cadeau.*");

        this.client.GiveawayManager.start(message.channel, {
            time: ms(time),
            winnerCount: winners,
            prize: prize,
            hostedBy: message.author,
            messages: {
                giveaway: "🎁 **Giveaway** 🎁",
                giveawayEnded: "🎊 **Giveaway fini!** 🎊",
                timeRemaining: "Temps restant : **{duration}**!",
                inviteToParticipate: "Clique sur \"🎁\" pour participer!",
                winMessage: "🎊 Bravo, {winners} a gagné **{prize}**!",
                embedFooter: `${this.client.user.tag}`,
                noWinner: "*Aucune personne a gagné le giveaway, car personne a participé.*",
                hostedBy: "Crée par : {user}",
                winners: "gagnant(s)",
                endedAt: "Fini à",
                units: {
                    seconds: "secondes",
                    minutes: "minutes",
                    hours: "heures",
                    days: "jours"
                }
            }
        });
        if (message.deletable) message.delete();
        return;
    }
}

module.exports = GCreate;
