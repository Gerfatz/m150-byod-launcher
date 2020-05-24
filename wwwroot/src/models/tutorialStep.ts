import {Id} from "@/models/idType";

export class TutorialStep {
    id: Id = null;
    sequenceNumber = 0;
    title = '';
    instruction = '';
    tutorialTargetId: Id = null;

    public constructor(init?: Partial<TutorialStep>) {
        Object.assign(this, init);
    }

    public update(updateData: Partial<TutorialStep>) {
        Object.assign(this, updateData);
    }
}