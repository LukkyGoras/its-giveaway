const Command = require("../../Base/Command");

class Help extends Command {
    constructor(client) {
        super(client, {
            name: "help",
            description: "*Permets de voir l'entièreté des commandes*",
            aliases: ["h", "commandes"],
            usage: ["help"]
        });
    }

    async run(message, args, Discord) {
        if (!args[0]) {
            const embed = new Discord.MessageEmbed()
                .setTitle(`**Commandes de 🎁・It's Giveaways :**`)
                .setFooter(
                    `Pour avoir une information sur une commande faîtes : ${this.client.prefix}help <commande>.`
                )
                
                .setDescription(
                    this.client.commands
                        .filter(c => c.help.category === "Giveaways")
                        .map(m => `\`${m.help.name}\``)
                        .join(", ")
                )
                .setColor("#fce803");
            return message.channel.send(embed);
        } else {
            let cmd = this.client.fetchCommand(args[0]);
            if (!cmd) return message.channel.send("*Commande invalide.*");
            const embed = new Discord.MessageEmbed()
                
                .setTitle(cmd.help.name)
                .setDescription(cmd.help.description)
                .addField("Category", cmd.help.category)
                .addField(
                    "**Aliases :**",
                    cmd.help.aliases.join(", ")
                )
                .addField(
                    "**Usage :**",
                    `${
                    cmd.help.usage[0].startsWith("No")
                        ? cmd.help.usage[0]
                        : cmd.help.usage.map(m => `${this.client.prefix}${m}`).join("\n")
                    }`
                )
                .setColor("#fce803")
                .setFooter(
                    `${this.client.user.username} - Commandes`,
                    this.client.user.displayAvatarURL({ dynamic: true })
                )
                .setTimestamp();
            return message.channel.send(embed);
        }
    }
}

module.exports = Help;
