import * as net from "net";
import * as fs from "fs";

import Room from "./room";
import { Message, RawMessage } from "./message-interfaces";
import Player from "./player";
import Parser from "./parser";
import MessageType from "./message-type";

// Create our TCP server backend.
const server = net.createServer();

// Listen for TCP events.
server.on("connection", handleConnection);
server.listen(50_000, () => console.log("Listening for TCP connections on port 50000"));

// Our game for this event.
const room = new Room("PharAsync", "4444");

save();

/**
 * Intercept any connections and validate them.
 * @param socket
 */
function handleConnection(socket: net.Socket): void {
    socket.on("data", (data) => {
        const event = Parser.Decode(`${data}`);
        const name = event.sender.slice(0, 8);
        const player = room.players.get(name);

        // Do not continue if this player does not exist.
        if (player === undefined) return;

        switch (event.type) {
            case MessageType.Config:
                validate(socket, event, room, player);
                break;

            case MessageType.PlayerNumber:
                connect(socket, room, player);
                break;

            case MessageType.Ping:
                player.refreshTimeout();
                socket.write(Parser.Encode({ type: MessageType.Ping, sender: room.id }));
                break;

            case MessageType.Quit:
                player.disconnect();
                break;

            // Ignore this type.
            case MessageType.PlayerStatus:
            case MessageType.PlayerList:
                break;

            default:
                forward(player, data, room);
        }

        save();
    });
}

function save() {
    // For debug purposes, let's output the current room information.
    console.clear();
    console.log(`${room}`);

    // Save to file.
    fs.writeFileSync(
        "./data.json",
        JSON.stringify(
            room,
            (_, v) => {
                if (v instanceof Map) {
                    const players = [];

                    for (const player of v.values()) {
                        players.push({
                            id: player.id,
                            name: player.name,
                            queue: player.queue,
                        });
                    }

                    return players;
                }

                return v;
            },
            2,
        ),
        "utf-8",
    );
}

/**
 * Validate any connection and connect.
 * @param socket
 * @param event
 * @param room
 * @param player
 */
function validate(socket: net.Socket, event: Message, room: Room, player?: Player): boolean {
    // If the player does not exist in our room, do not allow them to join.
    if (player === undefined) {
        socket.write(Parser.Encode({ type: MessageType.Error, sender: room.id }));
        return false;
    }

    // Destroy any active socket.
    if (player.active) {
        player.disconnect();
    }

    // Establish a relationship between this player and socket.
    player.socket = socket;

    // Send our response back.
    player.socket.write(
        Parser.Encode({
            type: MessageType.Config,
            sender: room.id,
            hash: event["hash"],
            ramConfig: `${room.players.size}`,
        }),
    );

    // Return that we validated successfully!
    return true;
}

/**
 * Connect to the server and get the player list.
 * @param socket
 * @param room
 * @param player
 */
function connect(socket: net.Socket, room: Room, player: Player): void {
    // Send this player their identifier.
    socket.write(
        Parser.Encode({
            type: MessageType.PlayerNumber,
            sender: room.id,
            name: room.id,
            number: 0,
        }),
    );

    // Prepare our response object.
    const playerList: RawMessage = {
        type: MessageType.PlayerList,
        sender: room.id,
        data: { l: {} },
    };

    // Get the current status of every player connected.
    for (const other of room.players.values()) {
        playerList.data.l[other.name] = {
            status: other.active ? "Ready" : "Unready",
            num: other.id,
        };
    }

    // Send this player the player list.
    socket.write(Parser.Encode(playerList));

    // Send this spooky message. I don't know what it means.
    socket.write(`r${room.id},i:0:1\n`);

    for (const other of room.players.values()) {
        // We don't need to send our own player name.
        if (other.name !== player.name) {
            socket.write(
                Parser.Encode({
                    type: MessageType.RamEvent,
                    sender: other.name,
                    data: { n: other.id },
                }),
            );
        }

        // Tell the other players that we connected.
        if (other.active) {
            other.socket?.write(`s${player.name},${player.name},Ready\n`);
        }
    }

    // Check for queued events.
    if (player.queued) {
        player.dequeueAll();
    }

    // Set timeout.
    player.refreshTimeout();
}

/**
 * Forward an event to all connected players.
 * @param player
 * @param event
 * @param room
 */
function forward(player: Player, event: Buffer, room: Room) {
    for (const other of room.players.values()) {
        // Do not send ourselves the message we JUST received.
        if (other.name === player.name) continue;

        // If the player is connected, send the event immediately. Otherwise, enqueue it.
        if (other.active) {
            other.socket?.write(event);
        } else {
            other.enqueue(`${event}`);
        }
    }
}
