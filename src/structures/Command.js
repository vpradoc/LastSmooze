module.exports = class Command {
    constructor(client) {
        this.client = client

        this.name = "Nome"
        this.category = "Categoria"
        this.description = "Descrição"
        this.usage = "Sem Informação"
        this.aliases = ["Sem alternativas!"]

        this.enabled = true
        this.guildOnly = true
    }
    async run() {}
}