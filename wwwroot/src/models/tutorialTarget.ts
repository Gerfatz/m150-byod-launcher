import {Target} from "@/models/target";
import {Id} from "@/models/idType";

export class TutorialTarget extends Target {
    stepIds: Id[] = [];

    public constructor(init?: Partial<TutorialTarget>) {
        super();
        Object.assign(this, init);
    }

    update(updateData: Partial<TutorialTarget>) {
        Object.assign(this, updateData);
    }
}