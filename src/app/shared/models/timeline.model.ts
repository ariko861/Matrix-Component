import { Message } from "./message.model";

export class Timeline {
    chunk!: Message[];
    end!: string;
    start!: string;
}