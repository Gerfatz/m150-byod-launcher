import {Id} from "@/models/idType";

export class Session {
    id: Id = null;
    title = '';
    accessCode = '';
    editCode = '';
    requiresCredentials = false;
    currentStage = 0;
    directorId: Id = null;

    public constructor(init?: Partial<Session>) {
        Object.assign(this, init);
    }

    public update(updateData: Partial<Session>) {
        Object.assign(this, updateData);
    }
}