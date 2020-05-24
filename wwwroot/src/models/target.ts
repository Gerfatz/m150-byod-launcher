import {Id} from "@/models/idType";

export class Target {
    id: Id = null;
    title = '';
    description = '';
    categoryId: Id = null;
    
    public constructor(init?: Partial<Target>){
        Object.assign(this, init);
    }
}