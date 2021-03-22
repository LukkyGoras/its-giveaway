class Command {
    /**
     *
     * @param {Client} client Discord Client
     * @param {Object} ootions command conf
     */
    constructor(
        client,
        {
            name = null,
            description = "*Aucune description fournise.*",
            category = "*Autre.*",
            usage = ["*Aucun usage fournis.**"],
            aliases = new Array()
        }
    ) {
        this.client = client;
        this.help = { name, description, category, usage, aliases };
    }
}
module.exports = Command;
