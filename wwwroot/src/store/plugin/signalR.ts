import {HubConnectionBuilder, LogLevel} from "@aspnet/signalr";
import {MutationPayload} from "vuex";
import {Id} from "@/models/idType";
import router from "@/router/index";
import {TargetResultData} from "@/models/types";

const client = new HubConnectionBuilder()
    .configureLogging(LogLevel[process.env.VUE_APP_SIGNALR_LOG_LEVEL as keyof typeof LogLevel])
    .withUrl(process.env.VUE_APP_SIGNALR_HUB_URL as string)
    .build();

export default function createSignalRPlugin() {
    return (store: any) => {
        client.on('stateChanged', (oldState, newState) => {
            const state = oldState !== newState && newState !== 'Connected' ? 'connectionClosed' : 'connectionOpened';
            store.dispatch(`signalR/${state}`);
        });

        client.on('StartSession', (sessionId: Id) => {
            store.dispatch('orchestrateSession/downloadSessionData', sessionId)
                .then(() => {
                    router.push({name: 'orchestrate session'});
                })
        });

        client.on('JoinSession', (sessionId: Id, participantId: Id, displayName: string) => {
            store.dispatch('attendSession/setParticipantId', participantId)
                .then(() => {
                    store.dispatch('attendSession/setDisplayName', displayName);
                })
                .then(() => {
                    store.dispatch('attendSession/downloadSessionData', sessionId)
                        .then(() => {
                            router.push({name: "attend session"});
                        });
                })
        });

        client.on('ParticipantJoinedSession', (participantId: string, displayName: string) => {
            store.dispatch('orchestrateSession/participantJoined', {participantId, displayName});
        });

        client.on('ParticipantLeftSession', (participantId: string) => {
            store.dispatch('orchestrateSession/participantLeft', participantId);
        })

        client.on('ReceiveTargetResult', (targetId: string, participantId: string, success: boolean, details: string) => {
            store.dispatch('orchestrateSession/addTargetResult', {
                targetId,
                participantId,
                success,
                details
            } as TargetResultData);
        });

        client.on('RemoveTargetResult', (targetId: string, participantId: string) => {
            store.dispatch('orchestrateSession/removeTargetResult', {targetId, participantId});
        })

        client.on('UpdateStageNumber', (stageNumber: number) => {
            store.dispatch('attendSession/updateStageNumber', stageNumber);
        });

        client.start()
            .then(() => {
                store.dispatch('signalR/connectionOpened');
            })
            .catch(error => {
                store.dispatch('signalR/connectionError', error);
            });

        store.subscribe((mutation: MutationPayload, state: any) => {
            if (state.signalR.connected) {
                switch (mutation.type) {
                    case 'signalR/START_SESSION':
                        client.invoke('StartSession', mutation.payload);
                        break;
                    case 'signalR/JOIN_SESSION':
                        client.invoke('JoinSession', ...mutation.payload);
                        break;
                    case 'signalR/JOIN_SESSION_AS_PARTICIPANT':
                        client.invoke('JoinSessionAsParticipant', state.signalR.participantId);
                        break;
                    case 'orchestrateSession/UPDATE_CURRENT_STAGE_NUMBER':
                        client.invoke('UpdateStageNumber', state.signalR.sessionId, mutation.payload);
                        break;
                }
            }
        })
    }
}