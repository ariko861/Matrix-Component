export class Config {
    homeserver!: string;
    roomId!: string;
    mediaGallery: boolean = false;
    carousel: boolean = false;
    fromStart: boolean = false;
    senderFilter: null | string[] = null;
}