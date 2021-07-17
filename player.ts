import * as net from "net";

import Room from "./room";

export default class Player {
    public name: string;
    public id: number;
    public socket?: net.Socket;
    public room: Room;
    public queue: string[] = [];
    public timeout?: NodeJS.Timeout;

    public constructor(id: number, name: string, room: Room) {
        this.id = id;
        this.name = name.slice(0, 8);
        this.room = room;
    }

    /**
     * Push a new event to the queue stack.
     * @param event
     */
    public enqueue(event: string) {
        // If we sent a new event that already exists, we need to push it to the front instead.
        const previousEvent = this.queue.findIndex((e) => e === event);
        if (previousEvent !== -1) {
            this.queue = this.queue.splice(previousEvent, 1);
        }

        this.queue.push(event);
    }

    /**
     * Attempt to dequeue all events from this player while we are connected.
     */
    public dequeueAll() {
        while (this.queue && this.active) {
            this.socket?.write(this.queue.shift() as string);
        }
    }

    public disconnect() {
        this.socket?.destroy();
        this.socket = undefined;
    }

    public refreshTimeout() {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        // Create a new timeout.
        this.timeout = setTimeout(() => this.disconnect(), 60_000);
    }

    /**
     * Returns true if this socket is active and currently not destroyed.
     */
    public get active(): boolean {
        return this.socket !== undefined && !this.socket.destroyed;
    }

    /**
     * Returns true if there are any events queued for this player.
     */
    public get queued(): boolean {
        return this.queue.length > 0;
    }
}
