import {AxiosError, AxiosRequestConfig, AxiosResponse} from "axios";
import Api from "@/api/api";
import {Director} from "@/models/director";

class DirectorApi extends Api {

    public constructor(config: AxiosRequestConfig) {
        super(config);

        this.createDirector = this.createDirector.bind(this);
        this.updateDirector = this.updateDirector.bind(this);
    }

    public createDirector(director: Director): Promise<Director> {
        return this.post<Director>('director', JSON.stringify(director))
            .then((response: AxiosResponse<Director>) => {
                return response.data;
            })
            .catch((error: AxiosError) => {
                throw error;
            });
    }

    public updateDirector(director: Director): Promise<Director> {
        return this.put<Director>(`director/${director.id}`, JSON.stringify(director))
            .then((response: AxiosResponse<Director>) => {
                return response.data;
            })
            .catch((error: AxiosError) => {
                throw error;
            })
    }
}

export const directorApi = new DirectorApi({});