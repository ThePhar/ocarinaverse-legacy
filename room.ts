import chalk from "chalk";
import dedent from "dedent";
import Player from "./player";

export default class Room {
    public id: string;
    public pass: string;
    public players: Map<string, Player> = new Map();

    public constructor(id: string, pass: string) {
        this.id = id;
        this.pass = pass;
    }

    public toString(): string {
        const room = dedent`
            Room: ${chalk.red(this.id)}
            Pass: ${chalk.red(this.pass)}
        `;

        let players = "";
        for (const player of this.players.values()) {
            players += dedent`
                ${chalk.yellowBright(
                    player.id.toString().padStart(this.players.size.toString().length),
                )}: "${chalk.whiteBright(player.name)}"
                    Queued: ${chalk.greenBright(player.queue.length)}
                    Active: ${player.active ? chalk.greenBright("True") : chalk.redBright("False")}\n
            `;
        }

        // Return this abomination.
        return `${room}\n\n${players}\n`;
    }

    /**
     * Add a player to our game and return the current room object.
     * @param name
     */
    public addPlayer(name: string): Room {
        this.players.set(name, new Player(this.players.size + 1, name, this));
        return this;
    }
}
