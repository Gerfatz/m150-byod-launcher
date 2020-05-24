import Api from "@/api/api";
import {AxiosError, AxiosRequestConfig, AxiosResponse} from "axios";
import {Id} from "@/models/idType";
import {Stage} from "@/models/stage";

class StageApi extends Api {
    public constructor(config: AxiosRequestConfig) {
        super(config);

        this.createStage = this.createStage.bind(this);
    }

    public getStages(sessionId: Id = null): Promise<Stage[]> {
        return this.get<Stage[]>(`session/${sessionId}/stage`)
            .then((response: AxiosResponse<Stage[]>) => {
                return response.data;
            })
            .catch((error: AxiosError) => {
                throw error;
            });
    }

    public createStage(sessionId: Id, stage: Stage): Promise<Stage> {
        return this.post<Stage>(`session/${sessionId}/stage`, JSON.stringify(stage))
            .then((response: AxiosResponse<Stage>) => {
                return response.data;
            })
            .catch((error: AxiosError) => {
                throw error;
            });
    }

    public updateStage(stage: Stage): Promise<Stage> {
        return this.put<Stage>(`session/${stage.sessionId}/stage/${stage.id}`, JSON.stringify(stage))
            .then((response: AxiosResponse<Stage>) => {
                return response.data;
            })
            .catch((error: AxiosError) => {
                throw error;
            })
    }

    public deleteStage(stage: Stage): Promise<Stage> {
        return this.delete<Stage>(`session/${stage.sessionId}/stage/${stage.id}`)
            .then((response: AxiosResponse<Stage>) => {
                return response.data;
            })
            .catch((error: AxiosError) => {
                throw error;
            })
    }
}

export const stageApi = new StageApi({});