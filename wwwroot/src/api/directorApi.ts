import {AxiosError, AxiosRequestConfig, AxiosResponse} from "axios";
import Api from "@/api/api";
import {Director} from "@/models/director";
import {Id} from "@/models/idType";

class DirectorApi extends Api {

    public constructor(config: AxiosRequestConfig) {
        super(config);

        this.createDirector = this.createDirector.bind(this);
        this.updateDirector = this.updateDirector.bind(this);
    }

    public getDirector(directorId: Id): Promise<Director> {
        return this.get<Director>(`director/${directorId}`)
            .then((response: AxiosResponse) => {
                return response.data;
            })
            .catch((error: AxiosError) => {
                throw error;
            })
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