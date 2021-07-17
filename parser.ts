import MessageType from "./message-type";
import {
    ConfigMessage,
    Message,
    PingMessage,
    PlayerNumberMessage,
    RawMessage,
    UnknownMessage,
} from "./message-interfaces";

export default class Parser {
    private static stringToList(table: string[]) {
        let events: any = {};

        for (const event of table) {
            const splitEvent: any = event.split(":");

            let depth = 0;
            let eventDive = events;
            while (splitEvent[depth + 2] !== undefined) {
                splitEvent[depth] = parseInt(splitEvent[depth]) || splitEvent[depth];

                if (eventDive[splitEvent[depth]] === undefined) eventDive[splitEvent[depth]] = {};
                eventDive = eventDive[splitEvent[depth]];

                depth += 1;
            }

            splitEvent[depth] = parseInt(splitEvent[depth]) || splitEvent[depth];

            if (splitEvent[depth + 1] === "t") eventDive[splitEvent[depth]] = true;
            else if (splitEvent[depth + 1] === "f") eventDive[splitEvent[depth]] = false;
            else eventDive[splitEvent[depth]] = parseInt(splitEvent[depth + 1]) || splitEvent[depth + 1];
        }

        return events;
    }

    private static listToString(data: any, header: string = "") {
        let string = "";

        if (typeof data === "object") {
            for (const key in data) {
                const value = data[key];

                const newHeader = header === "" ? key : `${header}:${key}`;
                string += Parser.listToString(value, newHeader) + ",";
            }
            string = string.slice(0, -1);
        } else if (data === true) {
            string = header + ":" + "t";
        } else if (data === false) {
            string = header + ":" + "f";
        } else {
            string = header + ":" + data;
        }

        return string;
    }

    public static Decode(data: string): Message {
        let string = data.slice(1).trim();
        const type = data[0] as MessageType;
        const params = string.split(",");

        switch (type) {
            /** Ram Event */
            case MessageType.RamEvent:
                let rMsg = {} as RawMessage;
                rMsg.type = type;
                rMsg.sender = params[0] as string;
                rMsg.data = Parser.stringToList(params.slice(1));
                return rMsg;

            /** Player List */
            case MessageType.PlayerList:
                let lMsg = {} as RawMessage;
                lMsg.type = type;
                lMsg.sender = params[0] as string;
                lMsg.data = Parser.stringToList(params.slice(1));
                return lMsg;

            /** Config */
            case MessageType.Config:
                let cMsg = {} as ConfigMessage;
                cMsg.type = type;
                cMsg.sender = params[0] as string;
                cMsg.hash = params[1] as string;
                cMsg.name = params[2] as string;
                cMsg.ramConfig = params[3];
                return cMsg;

            /** Ping */
            case MessageType.Ping:
                let pMsg = {} as PingMessage;
                pMsg.type = type;
                pMsg.sender = params[0] as string;
                return pMsg;

            /** Player Number */
            case MessageType.PlayerNumber:
                let nMsg = {} as PlayerNumberMessage;
                nMsg.type = type;
                nMsg.sender = params[0] as string;
                nMsg.name = params[1] as string;
                nMsg.number = parseInt(params[2] as string);
                if (isNaN(nMsg.number)) nMsg.number = 1;
                return nMsg;

            /** Anything else? */
            default:
                let uMsg = {} as UnknownMessage;
                uMsg.type = type;
                uMsg.sender = params[0] as string;
                uMsg.params = params.slice(1);
                return uMsg;
        }
    }

    public static Encode(message: Message) {
        let string = message.type as string;

        switch (message.type) {
            /** Config */
            case MessageType.Config:
                string += `${message.sender},${message["hash"]}`;
                if (message["name"]) string += `,${message["name"]}`;
                if (message["ramConfig"]) string += `,${message["ramConfig"]}`;
                break;

            /** Player Number */
            case MessageType.PlayerNumber:
                string += `${message.sender},${message["name"]}`;
                if (message["number"]) string += `,${message["number"]}`;
                break;

            /** Ping */
            case MessageType.Ping:
                string += `${message.sender}`;
                break;

            /** Ram Event */
            case MessageType.PlayerList:
            case MessageType.RamEvent:
                string += `${message.sender},${Parser.listToString(message["data"])}`;
                break;
        }

        return string + "\n";
    }
}
