import MessageType from "./message-type";

export interface Message {
    type: MessageType | string;
    sender: string;
    [params: string]: any;
}

export interface ConfigMessage {
    type: MessageType.Config;
    sender: string;
    hash: string;
    name?: string;
    ramConfig?: string;
}

export interface RawMessage {
    type: MessageType.RamEvent | MessageType.PlayerList;
    sender: string;
    data: any;
}

export interface PingMessage {
    type: MessageType.Ping;
    sender: string;
}

export interface PlayerNumberMessage {
    type: MessageType.PlayerNumber;
    sender: string;
    name: string;
    number: number;
}

export interface UnknownMessage {
    type: string;
    sender: string;
    params: any[];
}
