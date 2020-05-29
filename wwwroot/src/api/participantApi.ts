import {AxiosError, AxiosRequestConfig, AxiosResponse} from "axios";
import Api from "@/api/api";
import {Id} from "@/models/idType";
import {ParticipantCreationObject} from "@/models/types";

class ParticipantApi extends Api {

    public constructor(config: AxiosRequestConfig) {
        super(config);
    }

    public createParticipant(sessionId: Id, participantData: ParticipantCreationObject): Promise<string> {
        return this.post<string>(`session/${sessionId}/participant`, JSON.stringify(participantData))
            .then((response: AxiosResponse) => {
                return response.data;
            })
            .catch((error: AxiosError) => {
                throw error;
            })
    }
}

export const participantApi = new ParticipantApi({});