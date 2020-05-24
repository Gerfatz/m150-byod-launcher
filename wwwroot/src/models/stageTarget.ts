import {Id} from "@/models/idType";

export class StageTarget {
    stageId: Id = null;
    targetId: Id = null;

    public constructor(init?: Partial<StageTarget>) {
        Object.assign(this, init);
    }
}