import Api from "@/api/api";
import {AxiosError, AxiosRequestConfig, AxiosResponse} from "axios";
import {TutorialStep} from "@/models/tutorialStep";
import {Id} from "@/models/idType";

class TutorialStepApi extends Api {

    public constructor(config: AxiosRequestConfig) {
        super(config);

    }

    public getTutorialSteps(tutorialTargetId: Id): Promise<TutorialStep[]> {
        return this.get<TutorialStep[]>(`target/${tutorialTargetId}/tutorialStep`)
            .then((response: AxiosResponse<TutorialStep[]>) => {
                return response.data;
            })
            .catch((error: AxiosError) => {
                throw error;
            });
    }

    public addTutorialStep(tutorialStep: TutorialStep): Promise<TutorialStep> {
        return this.post<TutorialStep>(`target/${tutorialStep.tutorialTargetId}/tutorialStep`, JSON.stringify(tutorialStep))
            .then(TutorialStepApi.then)
            .catch(TutorialStepApi.catch);
    }

    public updateTutorialStep(tutorialStep: TutorialStep): Promise<TutorialStep> {
        return this.put<TutorialStep>(`target/${tutorialStep.tutorialTargetId}/tutorialStep/${tutorialStep.id}`, JSON.stringify(tutorialStep))
            .then(TutorialStepApi.then)
            .catch(TutorialStepApi.catch);
    }

    public deleteTutorialStep(tutorialStep: TutorialStep): Promise<TutorialStep> {
        return this.delete<TutorialStep>(`target/${tutorialStep.tutorialTargetId}/tutorialStep/${tutorialStep.id}`)
            .then(TutorialStepApi.then)
            .catch(TutorialStepApi.catch);
    }

    private static then(response: AxiosResponse<TutorialStep>) {
        return response.data;
    }

    private static catch(error: AxiosError): TutorialStep {
        throw error;
    }
}

export const tutorialStepApi = new TutorialStepApi({});