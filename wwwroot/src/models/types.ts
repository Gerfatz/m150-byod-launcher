import {Id} from "@/models/idType";

export type TargetResult = {
    success: boolean,
    details: string
}

// first key is targetId; second key is participantId
export type TargetResultCollection = {
    [key: string]: {
        [key: string]: TargetResult
    }
}

// key is targetId
export type ParticipantTargetResults = {
    [key: string]: TargetResult
}

export interface TargetResultData {
    targetId: Id,
    participantId: Id,
    success: boolean,
    details: string,
}

export type ParticipantCreationObject = {
    displayName: string,
    username: string,
    password: string,
}