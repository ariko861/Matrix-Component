import { Content } from "./content.model";

export class Message {
    age!: number;
    event_id!: string;
    sender!: string;
    type!: string;
    content!: Content;
    origin_server_ts!: Date;
}