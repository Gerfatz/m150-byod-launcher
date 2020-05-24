import {HubConnectionBuilder, LogLevel} from "@aspnet/signalr";

const connection = new HubConnectionBuilder()
    .withUrl(process.env.VUE_APP_SIGNALR_HUB_URL as string)
    .configureLogging(LogLevel[process.env.VUE_APP_SIGNALR_LOG_LEVEL as keyof typeof LogLevel])
    .build();

connection.start();
