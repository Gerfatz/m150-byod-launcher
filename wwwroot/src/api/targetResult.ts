import Api from "@/api/api";
import {AxiosError, AxiosRequestConfig, AxiosResponse} from "axios";
import {TargetResultData} from "@/models/types";

class TargetResultApi extends Api {
    public constructor(config: AxiosRequestConfig) {
        super(config);
    }

    public createTargetResult(targetResult: TargetResultData): Promise<TargetResultData> {
        return this.post<TargetResultData>(`targetResult`, JSON.stringify(targetResult))
            .then((result: AxiosResponse<TargetResultData>) => {
                return result.data;
            })
            .catch((error: AxiosError) => {
                throw error;
            });
    }

    public removeTargetResult(targetResult: TargetResultData): Promise<TargetResultData> {
        const url = `targetResult?targetId=${targetResult.targetId}&participantId=${targetResult.participantId}`;
        return this.delete<TargetResultData>(url)
            .then((result: AxiosResponse<TargetResultData>) => {
                return result.data;
            })
            .catch((error: AxiosError) => {
                throw error;
            })
    }
}

export const targetResultApi = new TargetResultApi({});