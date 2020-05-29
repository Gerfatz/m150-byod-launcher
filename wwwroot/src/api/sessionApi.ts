import {AxiosError, AxiosRequestConfig, AxiosResponse} from "axios";
import Api from "@/api/api";
import {Session} from "@/models/session";
import {Id} from "@/models/idType";

class SessionApi extends Api {

    public constructor(config: AxiosRequestConfig) {
        super(config);

        this.createSession = this.createSession.bind(this);
        this.updateSession = this.updateSession.bind(this);
    }

    public createSession(session: Session): Promise<Session> {
        return this.post<Session>('session', JSON.stringify(session))
            .then((response: AxiosResponse<Session>) => {
                return response.data;
            })
            .catch((error: AxiosError) => {
                throw error;
            });
    }

    public updateSession(session: Session): Promise<Session> {
        return this.put<Session>(`session/${session.id}`, JSON.stringify(session))
            .then((response: AxiosResponse<Session>) => {
                return response.data;
            })
            .catch((error: AxiosError) => {
                throw error;
            });
    }

    public getSession(sessionId: Id): Promise<Session> {
        return this.get<Session>(`session/${sessionId}`)
            .then((response: AxiosResponse<Session>) => {
                return response.data;
            })
            .catch((error: AxiosError) => {
                throw error;
            });
    }

    public getByAccessCode(accessCode: string): Promise<Session[]> {
        return this.get<Session[]>(`session?accessCode=${accessCode}`)
            .then((response: AxiosResponse<Session[]>) => {
                return response.data;
            })
            .catch((error: AxiosError) => {
                throw error;
            });
    }

    public getByEditCode(editCode: string): Promise<Session[]> {
        return this.get<Session[]>(`session?editCode=${editCode}`)
            .then((response: AxiosResponse<Session[]>) => {
                return response.data;
            })
            .catch((error: AxiosError) => {
                throw error;
            });
    }
}

export const sessionApi = new SessionApi({});