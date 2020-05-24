import {Id} from "@/models/idType";

export class Stage {
    id: Id = null;
    sequenceNumber = 0;
    title = '';
    sessionId: Id = null;
    targetIds: Id[] = [];

    public constructor(init?: Partial<Stage>) {
        Object.assign(this, init);
    }

    public update(updateData: Partial<Stage>) {
        Object.assign(this, updateData);
    }
}