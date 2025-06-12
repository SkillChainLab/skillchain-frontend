import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgDeleteNotificationSettings } from "./types/skillchain/notifications/tx";
import { MsgDeleteNotificationResponse } from "./types/skillchain/notifications/tx";
import { MsgUpdateNotificationSettingsResponse } from "./types/skillchain/notifications/tx";
import { MsgDeleteNotification } from "./types/skillchain/notifications/tx";
import { Params } from "./types/skillchain/notifications/params";
import { NotificationSettings } from "./types/skillchain/notifications/notification_settings";
import { QueryAllNotificationResponse } from "./types/skillchain/notifications/query";
import { MsgCreateNotificationSettingsResponse } from "./types/skillchain/notifications/tx";
import { MsgCreateNotificationSettings } from "./types/skillchain/notifications/tx";
import { QueryGetNotificationResponse } from "./types/skillchain/notifications/query";
import { QueryGetNotificationSettingsResponse } from "./types/skillchain/notifications/query";
import { GenesisState } from "./types/skillchain/notifications/genesis";
import { MsgCreateNotificationResponse } from "./types/skillchain/notifications/tx";
import { MsgDeleteNotificationSettingsResponse } from "./types/skillchain/notifications/tx";
import { QueryAllNotificationSettingsRequest } from "./types/skillchain/notifications/query";
import { QueryAllNotificationSettingsResponse } from "./types/skillchain/notifications/query";
import { QueryParamsRequest } from "./types/skillchain/notifications/query";
import { QueryParamsResponse } from "./types/skillchain/notifications/query";
import { QueryGetNotificationSettingsRequest } from "./types/skillchain/notifications/query";
import { MsgCreateNotification } from "./types/skillchain/notifications/tx";
import { MsgUpdateNotification } from "./types/skillchain/notifications/tx";
import { MsgUpdateParams } from "./types/skillchain/notifications/tx";
import { Notification } from "./types/skillchain/notifications/notification";
import { QueryGetNotificationRequest } from "./types/skillchain/notifications/query";
import { QueryAllNotificationRequest } from "./types/skillchain/notifications/query";
import { MsgUpdateParamsResponse } from "./types/skillchain/notifications/tx";
import { MsgUpdateNotificationSettings } from "./types/skillchain/notifications/tx";
import { MsgUpdateNotificationResponse } from "./types/skillchain/notifications/tx";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/skillchain.notifications.MsgDeleteNotificationSettings", MsgDeleteNotificationSettings],
    ["/skillchain.notifications.MsgDeleteNotificationResponse", MsgDeleteNotificationResponse],
    ["/skillchain.notifications.MsgUpdateNotificationSettingsResponse", MsgUpdateNotificationSettingsResponse],
    ["/skillchain.notifications.MsgDeleteNotification", MsgDeleteNotification],
    ["/skillchain.notifications.Params", Params],
    ["/skillchain.notifications.NotificationSettings", NotificationSettings],
    ["/skillchain.notifications.QueryAllNotificationResponse", QueryAllNotificationResponse],
    ["/skillchain.notifications.MsgCreateNotificationSettingsResponse", MsgCreateNotificationSettingsResponse],
    ["/skillchain.notifications.MsgCreateNotificationSettings", MsgCreateNotificationSettings],
    ["/skillchain.notifications.QueryGetNotificationResponse", QueryGetNotificationResponse],
    ["/skillchain.notifications.QueryGetNotificationSettingsResponse", QueryGetNotificationSettingsResponse],
    ["/skillchain.notifications.GenesisState", GenesisState],
    ["/skillchain.notifications.MsgCreateNotificationResponse", MsgCreateNotificationResponse],
    ["/skillchain.notifications.MsgDeleteNotificationSettingsResponse", MsgDeleteNotificationSettingsResponse],
    ["/skillchain.notifications.QueryAllNotificationSettingsRequest", QueryAllNotificationSettingsRequest],
    ["/skillchain.notifications.QueryAllNotificationSettingsResponse", QueryAllNotificationSettingsResponse],
    ["/skillchain.notifications.QueryParamsRequest", QueryParamsRequest],
    ["/skillchain.notifications.QueryParamsResponse", QueryParamsResponse],
    ["/skillchain.notifications.QueryGetNotificationSettingsRequest", QueryGetNotificationSettingsRequest],
    ["/skillchain.notifications.MsgCreateNotification", MsgCreateNotification],
    ["/skillchain.notifications.MsgUpdateNotification", MsgUpdateNotification],
    ["/skillchain.notifications.MsgUpdateParams", MsgUpdateParams],
    ["/skillchain.notifications.Notification", Notification],
    ["/skillchain.notifications.QueryGetNotificationRequest", QueryGetNotificationRequest],
    ["/skillchain.notifications.QueryAllNotificationRequest", QueryAllNotificationRequest],
    ["/skillchain.notifications.MsgUpdateParamsResponse", MsgUpdateParamsResponse],
    ["/skillchain.notifications.MsgUpdateNotificationSettings", MsgUpdateNotificationSettings],
    ["/skillchain.notifications.MsgUpdateNotificationResponse", MsgUpdateNotificationResponse],
    
];

export { msgTypes }