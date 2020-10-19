import axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from "axios";
import Api from "@/api/api";
import {Target} from "@/models/target";
import {Id} from "@/models/idType";

const downloadScriptUriPattern = process.env.VUE_APP_SCRIPT_DOWNLOAD_URI_PATTERN as string;
const downloadScriptTargetIdPlaceholder = process.env.VUE_APP_SCRIPT_DOWNLOAD_TARGET_ID_PLACEHOLDER as string;

class TargetApi extends Api {

    public constructor(config: AxiosRequestConfig) {
        super(config);

        this.getTargets = this.getTargets.bind(this);
    }

    public getTargets(): Promise<Target[]> {
        return this.get<Target[]>('target')
            .then((response: AxiosResponse<Target[]>) => {
                return response.data;
            })
            .catch((error: AxiosError) => {
                throw error;
            });
    }

    public createTarget(target: Target): Promise<Target> {
        return this.post<Target>('target', JSON.stringify(target))
            .then((response: AxiosResponse<Target>) => {
                return response.data;
            })
            .catch((error: AxiosError) => {
                throw error;
            });
    }

    public updateTarget(target: Target): Promise<Target> {
        return this.put<Target>(`target/${target.id}`, JSON.stringify(target))
            .then((response: AxiosResponse<Target>) => {
                return response.data;
            })
            .catch((error: AxiosError) => {
                throw error;
            });
    }

    public downloadInstaller(targetId: Id) {
        return axios({
            url: downloadScriptUriPattern.replace(downloadScriptTargetIdPlaceholder, targetId as string),
            method: "GET",
            responseType: "blob"
        }).then((response) => {
            const fileUrl = window.URL.createObjectURL(new Blob([response.data]));
            const fileLink = document.createElement('a');
            const disposition = response.headers['content-disposition'];
            const filename = decodeURI(disposition.match(/filename="(.*)"/)[1]);
            
            fileLink.href = fileUrl;
            fileLink.setAttribute('download', filename);
            document.body.appendChild(fileLink);
            fileLink.click();
        });
    }

}

export const targetApi = new TargetApi({});