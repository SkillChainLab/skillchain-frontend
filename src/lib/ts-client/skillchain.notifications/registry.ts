import { GeneratedType } from "@cosmjs/proto-signing";
import { QueryGetNotificationSettingsResponse } from "./types/skillchain/notifications/query";
import { MsgUpdateNotificationResponse } from "./types/skillchain/notifications/tx";
import { MsgUpdateNotificationSettingsResponse } from "./types/skillchain/notifications/tx";
import { MsgDeleteNotificationSettingsResponse } from "./types/skillchain/notifications/tx";
import { MsgDeleteNotification } from "./types/skillchain/notifications/tx";
import { MsgCreateNotificationSettingsResponse } from "./types/skillchain/notifications/tx";
import { QueryAllNotificationSettingsResponse } from "./types/skillchain/notifications/query";
import { MsgUpdateParamsResponse } from "./types/skillchain/notifications/tx";
import { MsgUpdateNotification } from "./types/skillchain/notifications/tx";
import { Params } from "./types/skillchain/notifications/params";
import { Notification } from "./types/skillchain/notifications/notification";
import { MsgUpdateNotificationSettings } from "./types/skillchain/notifications/tx";
import { MsgUpdateParams } from "./types/skillchain/notifications/tx";
import { QueryParamsRequest } from "./types/skillchain/notifications/query";
import { QueryParamsResponse } from "./types/skillchain/notifications/query";
import { QueryGetNotificationRequest } from "./types/skillchain/notifications/query";
import { QueryAllNotificationSettingsRequest } from "./types/skillchain/notifications/query";
import { MsgCreateNotificationResponse } from "./types/skillchain/notifications/tx";
import { MsgDeleteNotificationResponse } from "./types/skillchain/notifications/tx";
import { MsgCreateNotification } from "./types/skillchain/notifications/tx";
import { GenesisState } from "./types/skillchain/notifications/genesis";
import { MsgCreateNotificationSettings } from "./types/skillchain/notifications/tx";
import { MsgDeleteNotificationSettings } from "./types/skillchain/notifications/tx";
import { QueryAllNotificationRequest } from "./types/skillchain/notifications/query";
import { QueryAllNotificationResponse } from "./types/skillchain/notifications/query";
import { NotificationSettings } from "./types/skillchain/notifications/notification_settings";
import { QueryGetNotificationResponse } from "./types/skillchain/notifications/query";
import { QueryGetNotificationSettingsRequest } from "./types/skillchain/notifications/query";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/skillchain.notifications.QueryGetNotificationSettingsResponse", QueryGetNotificationSettingsResponse],
    ["/skillchain.notifications.MsgUpdateNotificationResponse", MsgUpdateNotificationResponse],
    ["/skillchain.notifications.MsgUpdateNotificationSettingsResponse", MsgUpdateNotificationSettingsResponse],
    ["/skillchain.notifications.MsgDeleteNotificationSettingsResponse", MsgDeleteNotificationSettingsResponse],
    ["/skillchain.notifications.MsgDeleteNotification", MsgDeleteNotification],
    ["/skillchain.notifications.MsgCreateNotificationSettingsResponse", MsgCreateNotificationSettingsResponse],
    ["/skillchain.notifications.QueryAllNotificationSettingsResponse", QueryAllNotificationSettingsResponse],
    ["/skillchain.notifications.MsgUpdateParamsResponse", MsgUpdateParamsResponse],
    ["/skillchain.notifications.MsgUpdateNotification", MsgUpdateNotification],
    ["/skillchain.notifications.Params", Params],
    ["/skillchain.notifications.Notification", Notification],
    ["/skillchain.notifications.MsgUpdateNotificationSettings", MsgUpdateNotificationSettings],
    ["/skillchain.notifications.MsgUpdateParams", MsgUpdateParams],
    ["/skillchain.notifications.QueryParamsRequest", QueryParamsRequest],
    ["/skillchain.notifications.QueryParamsResponse", QueryParamsResponse],
    ["/skillchain.notifications.QueryGetNotificationRequest", QueryGetNotificationRequest],
    ["/skillchain.notifications.QueryAllNotificationSettingsRequest", QueryAllNotificationSettingsRequest],
    ["/skillchain.notifications.MsgCreateNotificationResponse", MsgCreateNotificationResponse],
    ["/skillchain.notifications.MsgDeleteNotificationResponse", MsgDeleteNotificationResponse],
    ["/skillchain.notifications.MsgCreateNotification", MsgCreateNotification],
    ["/skillchain.notifications.GenesisState", GenesisState],
    ["/skillchain.notifications.MsgCreateNotificationSettings", MsgCreateNotificationSettings],
    ["/skillchain.notifications.MsgDeleteNotificationSettings", MsgDeleteNotificationSettings],
    ["/skillchain.notifications.QueryAllNotificationRequest", QueryAllNotificationRequest],
    ["/skillchain.notifications.QueryAllNotificationResponse", QueryAllNotificationResponse],
    ["/skillchain.notifications.NotificationSettings", NotificationSettings],
    ["/skillchain.notifications.QueryGetNotificationResponse", QueryGetNotificationResponse],
    ["/skillchain.notifications.QueryGetNotificationSettingsRequest", QueryGetNotificationSettingsRequest],
    
];

export { msgTypes }