export class Filter {
    types!: string[];
    contains_url!: boolean;
    not_senders!: string[];

    print(): string {
        let filter = "";
        return JSON.stringify(this);
    }

}