import {Id} from "@/models/idType";

export class Director {
    id: Id = null;
    displayName = '';
    email = '';
    sessionIds: Id[] = [];

    public constructor(init?: Partial<Director>) {
        Object.assign(this, init);
    }

    public update(updateData: Partial<Director>) {
        Object.assign(this, updateData);
    }
}