import { GeneratedType } from "@cosmjs/proto-signing";
import { QueryParamsRequest } from "./types/skillchain/analytics/query";
import { QueryParamsResponse } from "./types/skillchain/analytics/query";
import { QueryGetPlatformMetricResponse } from "./types/skillchain/analytics/query";
import { QueryAllPlatformMetricResponse } from "./types/skillchain/analytics/query";
import { QueryGetRevenueRecordRequest } from "./types/skillchain/analytics/query";
import { QueryAllRevenueRecordResponse } from "./types/skillchain/analytics/query";
import { MsgCreatePlatformMetric } from "./types/skillchain/analytics/tx";
import { MsgDeletePlatformMetricResponse } from "./types/skillchain/analytics/tx";
import { MsgCreateRevenueRecord } from "./types/skillchain/analytics/tx";
import { QueryGetPlatformMetricRequest } from "./types/skillchain/analytics/query";
import { UserActivity } from "./types/skillchain/analytics/user_activity";
import { GenesisState } from "./types/skillchain/analytics/genesis";
import { MsgDeleteUserActivity } from "./types/skillchain/analytics/tx";
import { MsgUpdatePlatformMetricResponse } from "./types/skillchain/analytics/tx";
import { MsgUpdateRevenueRecord } from "./types/skillchain/analytics/tx";
import { MsgUpdateParams } from "./types/skillchain/analytics/tx";
import { MsgCreatePlatformMetricResponse } from "./types/skillchain/analytics/tx";
import { MsgCreateUserActivity } from "./types/skillchain/analytics/tx";
import { MsgUpdateParamsResponse } from "./types/skillchain/analytics/tx";
import { MsgCreateUserActivityResponse } from "./types/skillchain/analytics/tx";
import { MsgUpdateRevenueRecordResponse } from "./types/skillchain/analytics/tx";
import { RevenueRecord } from "./types/skillchain/analytics/revenue_record";
import { MsgUpdateUserActivity } from "./types/skillchain/analytics/tx";
import { Params } from "./types/skillchain/analytics/params";
import { MsgDeleteRevenueRecordResponse } from "./types/skillchain/analytics/tx";
import { QueryGetUserActivityResponse } from "./types/skillchain/analytics/query";
import { QueryGetRevenueRecordResponse } from "./types/skillchain/analytics/query";
import { PlatformMetric } from "./types/skillchain/analytics/platform_metric";
import { MsgUpdatePlatformMetric } from "./types/skillchain/analytics/tx";
import { MsgDeleteUserActivityResponse } from "./types/skillchain/analytics/tx";
import { MsgCreateRevenueRecordResponse } from "./types/skillchain/analytics/tx";
import { MsgDeleteRevenueRecord } from "./types/skillchain/analytics/tx";
import { QueryAllPlatformMetricRequest } from "./types/skillchain/analytics/query";
import { QueryGetUserActivityRequest } from "./types/skillchain/analytics/query";
import { MsgDeletePlatformMetric } from "./types/skillchain/analytics/tx";
import { MsgUpdateUserActivityResponse } from "./types/skillchain/analytics/tx";
import { QueryAllUserActivityRequest } from "./types/skillchain/analytics/query";
import { QueryAllUserActivityResponse } from "./types/skillchain/analytics/query";
import { QueryAllRevenueRecordRequest } from "./types/skillchain/analytics/query";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/skillchain.analytics.QueryParamsRequest", QueryParamsRequest],
    ["/skillchain.analytics.QueryParamsResponse", QueryParamsResponse],
    ["/skillchain.analytics.QueryGetPlatformMetricResponse", QueryGetPlatformMetricResponse],
    ["/skillchain.analytics.QueryAllPlatformMetricResponse", QueryAllPlatformMetricResponse],
    ["/skillchain.analytics.QueryGetRevenueRecordRequest", QueryGetRevenueRecordRequest],
    ["/skillchain.analytics.QueryAllRevenueRecordResponse", QueryAllRevenueRecordResponse],
    ["/skillchain.analytics.MsgCreatePlatformMetric", MsgCreatePlatformMetric],
    ["/skillchain.analytics.MsgDeletePlatformMetricResponse", MsgDeletePlatformMetricResponse],
    ["/skillchain.analytics.MsgCreateRevenueRecord", MsgCreateRevenueRecord],
    ["/skillchain.analytics.QueryGetPlatformMetricRequest", QueryGetPlatformMetricRequest],
    ["/skillchain.analytics.UserActivity", UserActivity],
    ["/skillchain.analytics.GenesisState", GenesisState],
    ["/skillchain.analytics.MsgDeleteUserActivity", MsgDeleteUserActivity],
    ["/skillchain.analytics.MsgUpdatePlatformMetricResponse", MsgUpdatePlatformMetricResponse],
    ["/skillchain.analytics.MsgUpdateRevenueRecord", MsgUpdateRevenueRecord],
    ["/skillchain.analytics.MsgUpdateParams", MsgUpdateParams],
    ["/skillchain.analytics.MsgCreatePlatformMetricResponse", MsgCreatePlatformMetricResponse],
    ["/skillchain.analytics.MsgCreateUserActivity", MsgCreateUserActivity],
    ["/skillchain.analytics.MsgUpdateParamsResponse", MsgUpdateParamsResponse],
    ["/skillchain.analytics.MsgCreateUserActivityResponse", MsgCreateUserActivityResponse],
    ["/skillchain.analytics.MsgUpdateRevenueRecordResponse", MsgUpdateRevenueRecordResponse],
    ["/skillchain.analytics.RevenueRecord", RevenueRecord],
    ["/skillchain.analytics.MsgUpdateUserActivity", MsgUpdateUserActivity],
    ["/skillchain.analytics.Params", Params],
    ["/skillchain.analytics.MsgDeleteRevenueRecordResponse", MsgDeleteRevenueRecordResponse],
    ["/skillchain.analytics.QueryGetUserActivityResponse", QueryGetUserActivityResponse],
    ["/skillchain.analytics.QueryGetRevenueRecordResponse", QueryGetRevenueRecordResponse],
    ["/skillchain.analytics.PlatformMetric", PlatformMetric],
    ["/skillchain.analytics.MsgUpdatePlatformMetric", MsgUpdatePlatformMetric],
    ["/skillchain.analytics.MsgDeleteUserActivityResponse", MsgDeleteUserActivityResponse],
    ["/skillchain.analytics.MsgCreateRevenueRecordResponse", MsgCreateRevenueRecordResponse],
    ["/skillchain.analytics.MsgDeleteRevenueRecord", MsgDeleteRevenueRecord],
    ["/skillchain.analytics.QueryAllPlatformMetricRequest", QueryAllPlatformMetricRequest],
    ["/skillchain.analytics.QueryGetUserActivityRequest", QueryGetUserActivityRequest],
    ["/skillchain.analytics.MsgDeletePlatformMetric", MsgDeletePlatformMetric],
    ["/skillchain.analytics.MsgUpdateUserActivityResponse", MsgUpdateUserActivityResponse],
    ["/skillchain.analytics.QueryAllUserActivityRequest", QueryAllUserActivityRequest],
    ["/skillchain.analytics.QueryAllUserActivityResponse", QueryAllUserActivityResponse],
    ["/skillchain.analytics.QueryAllRevenueRecordRequest", QueryAllRevenueRecordRequest],
    
];

export { msgTypes }