import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';

const apiDomain = process.env.VUE_APP_API_HOST;
const apiPath = process.env.VUE_APP_API_PATH;

export default class Api {
    private api: AxiosInstance;

    private static defaultConfig = {
        baseURL: `${apiDomain}${apiPath}`,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        timeout: 7500,
    };
    

    public constructor(config: AxiosRequestConfig) {
        const mergedConfig = {...Api.defaultConfig, ...config};
        this.api = axios.create(mergedConfig);
        this.api.interceptors.request.use((param: AxiosRequestConfig) => ({
            ...param
        }));
    }

    public getUri(config?: AxiosRequestConfig): string {
        return this.api.getUri(config);
    }

    public get<T, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
        return this.api.get(url, config);
    }

    public post<T, R = AxiosResponse<T>>(url: string, data?: string, config?: AxiosRequestConfig): Promise<R> {
        return this.api.post(url, data, config);
    }

    public put<T, R = AxiosResponse<T>>(url: string, data?: string, config?: AxiosRequestConfig): Promise<R> {
        return this.api.put(url, data, config);
    }

    public delete<T, R = AxiosResponse<T>>(url: string, config?: AxiosRequestConfig): Promise<R> {
        return this.api.delete(url, config);
    }

}