export class Content {
    body!: string;
    msgtype!: string;
    url!: string;
    info!: {
        h: number;
        mimetype: string;
        size: number;
        w: number;
    }
    'm.relates_to'!: {
        rel_type: string;
        event_id: string;
    }

}