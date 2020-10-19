import {HubConnectionBuilder, LogLevel} from "@aspnet/signalr";
import {MutationPayload} from "vuex";
import {Id} from "@/models/idType";
import router from "@/router/index";
import {TargetResultData} from "@/models/types";
import {sessionIdentifiers} from "@/store/newModules/session";
import {attendSessionIdentifiers} from "@/store/newModules/attendSession";
import {signalRIdentifiers} from "@/store/newModules/signalR";
import {orchestrateSessionIdentifiers} from "@/store/newModules/orchestrateSession";

const client = new HubConnectionBuilder()
    .configureLogging(LogLevel[process.env.VUE_APP_SIGNALR_LOG_LEVEL as keyof typeof LogLevel])
    .withUrl(process.env.VUE_APP_SIGNALR_HUB_URL as string)
    .build();

export default function createSignalRPlugin() {
    return (store: any) => {
        client.on('stateChanged', (oldState, newState) => {
            const state = oldState !== newState && newState !== 'Connected' ? 'connectionClosed' : 'connectionOpened';
            store.dispatch(signalRIdentifiers.actions[state]);
        });

        client.on('StartSession', (sessionId: Id) => {
            store.dispatch(sessionIdentifiers.actions.downloadAllData, sessionId)
                .then(() => {
                    router.push({name: 'orchestrate session'});
                })
        });

        client.on('JoinSession', (sessionId: Id, participantId: Id, displayName: string) => {
            store.dispatch(attendSessionIdentifiers.actions.setParticipantId, participantId)
                .then(() => {
                    return store.dispatch(attendSessionIdentifiers.actions.setDisplayName, displayName);
                })
                .then(() => {
                    return store.dispatch(sessionIdentifiers.actions.downloadAllData, sessionId);
                })
                .then(() => {
                    store.dispatch(attendSessionIdentifiers.actions.updateStageNumber)
                })
                .then(() => {
                    router.push({name: "attend session"});
                });
        });

        client.on('ParticipantJoinedSession', (participantId: string, displayName: string) => {
            store.dispatch(orchestrateSessionIdentifiers.actions.participantJoined, {participantId, displayName});
        });

        client.on('ParticipantLeftSession', (participantId: string) => {
            store.dispatch(orchestrateSessionIdentifiers.actions.participantLeft, participantId);
        })

        client.on('ReceiveTargetResult', (targetId: string, participantId: string, success: boolean, details: string) => {
            store.dispatch(orchestrateSessionIdentifiers.actions.addTargetResult, {
                targetId,
                participantId,
                success,
                details
            } as TargetResultData);
        });

        client.on('RemoveTargetResult', (targetId: string, participantId: string) => {
            store.dispatch(orchestrateSessionIdentifiers.actions.removeTargetResult, {targetId, participantId});
        })

        client.on('UpdateStageNumber', (stageNumber: number) => {
            store.dispatch(attendSessionIdentifiers.actions.updateStageNumber, stageNumber);
        });

        client.start()
            .then(() => {
                store.dispatch(signalRIdentifiers.actions.connectionOpened);
            })
            .catch(error => {
                store.dispatch(signalRIdentifiers.actions.connectionError, error);
            });

        store.subscribe((mutation: MutationPayload, state: any) => {
            if (state.signalR.connected) {
                switch (mutation.type) {
                    case signalRIdentifiers.mutations.startSession:
                        client.invoke('StartSession', mutation.payload);
                        break;
                    case signalRIdentifiers.mutations.joinSession:
                        client.invoke('JoinSession', ...mutation.payload);
                        break;
                    case signalRIdentifiers.mutations.joinSessionAsParticipant:
                        client.invoke('JoinSessionAsParticipant', state.signalR.participantId);
                        break;
                    case orchestrateSessionIdentifiers.mutations.updateCurrentStageNumber:
                        client.invoke('UpdateStageNumber', state.signalR.sessionId, mutation.payload);
                        break;
                }
            }
        })
    }
}