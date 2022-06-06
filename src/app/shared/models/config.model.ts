export class Config {
    homeserver!: string;
    roomId!: string;
    mediaGallery: boolean = false;
    carousel: boolean = false;
    fromStart: boolean = false;
    senderFilter: null | string[] = null;
    parentId!: string;

    get isParentDisplayed(): boolean { // return true if the root space is displayed
        return this.roomId === this.parentId;
    }

    get urlParams() {
        return `?homeserver=${this.homeserver}&roomId=${this.roomId}&mediaGallery=${this.mediaGallery}&fromStart=${this.fromStart}`;
    }


}