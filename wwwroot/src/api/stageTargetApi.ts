import Api from "@/api/api";
import {AxiosError, AxiosRequestConfig, AxiosResponse} from "axios";
import {Target} from "@/models/target";
import {StageTarget} from "@/models/stageTarget";
import {Id} from "@/models/idType";

class StageTargetApi extends Api {
    public constructor(config: AxiosRequestConfig) {
        super(config);
    }

    public getStageTargets(stageId: Id): Promise<Target[]> {
        return this.get<Target[]>(`stage/${stageId}/stageTarget`)
            .then((response: AxiosResponse<Target[]>) => {
                return response.data;
            })
            .catch((error: AxiosError) => {
                throw error;
            });
    }

    public addStageTarget(stageTarget: StageTarget): Promise<Target> {
        return this.post<Target>(`stage/${stageTarget.stageId}/stageTarget`, JSON.stringify(stageTarget))
            .then((response: AxiosResponse<Target>) => {
                return response.data;
            })
            .catch((error: AxiosError) => {
                throw error;
            });
    }

    public removeStageTarget(stageTarget: StageTarget): Promise<Target> {
        return this.delete<Target>(`stage/${stageTarget.stageId}/stageTarget/${stageTarget.targetId}`)
            .then((response: AxiosResponse<Target>) => {
                return response.data;
            })
            .catch((error: AxiosError) => {
                throw error;
            });
    }
}

export const stageTargetApi = new StageTargetApi({});