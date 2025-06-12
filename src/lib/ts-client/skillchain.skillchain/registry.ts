import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgUpdateParams } from "./types/skillchain/skillchain/tx";
import { MsgConvertSkillToVUSDResponse } from "./types/skillchain/skillchain/tx";
import { MsgUpdateVUSDPriceResponse } from "./types/skillchain/skillchain/tx";
import { Params } from "./types/skillchain/skillchain/params";
import { QueryParamsResponse } from "./types/skillchain/skillchain/query";
import { QueryTokenInfoResponse } from "./types/skillchain/skillchain/query";
import { QueryVUSDTreasuryResponse } from "./types/skillchain/skillchain/query";
import { MsgCreateProfile } from "./types/skillchain/skillchain/tx";
import { MsgConvertVUSDToSkill } from "./types/skillchain/skillchain/tx";
import { QueryParamsRequest } from "./types/skillchain/skillchain/query";
import { QueryUserVUSDPositionResponse } from "./types/skillchain/skillchain/query";
import { GenesisState } from "./types/skillchain/skillchain/genesis";
import { MsgBurn } from "./types/skillchain/skillchain/tx";
import { MsgConvertSkillToVUSD } from "./types/skillchain/skillchain/tx";
import { MsgConvertVUSDToSkillResponse } from "./types/skillchain/skillchain/tx";
import { MsgUpdateVUSDPrice } from "./types/skillchain/skillchain/tx";
import { QueryTokenInfoRequest } from "./types/skillchain/skillchain/query";
import { QueryVUSDTreasuryRequest } from "./types/skillchain/skillchain/query";
import { MsgUpdateParamsResponse } from "./types/skillchain/skillchain/tx";
import { MsgBurnResponse } from "./types/skillchain/skillchain/tx";
import { MsgCreateProfileResponse } from "./types/skillchain/skillchain/tx";
import { QueryUserVUSDPositionRequest } from "./types/skillchain/skillchain/query";
import { VUSDTreasury } from "./types/skillchain/skillchain/vusd";
import { UserVUSDPosition } from "./types/skillchain/skillchain/vusd";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/skillchain.skillchain.MsgUpdateParams", MsgUpdateParams],
    ["/skillchain.skillchain.MsgConvertSkillToVUSDResponse", MsgConvertSkillToVUSDResponse],
    ["/skillchain.skillchain.MsgUpdateVUSDPriceResponse", MsgUpdateVUSDPriceResponse],
    ["/skillchain.skillchain.Params", Params],
    ["/skillchain.skillchain.QueryParamsResponse", QueryParamsResponse],
    ["/skillchain.skillchain.QueryTokenInfoResponse", QueryTokenInfoResponse],
    ["/skillchain.skillchain.QueryVUSDTreasuryResponse", QueryVUSDTreasuryResponse],
    ["/skillchain.skillchain.MsgCreateProfile", MsgCreateProfile],
    ["/skillchain.skillchain.MsgConvertVUSDToSkill", MsgConvertVUSDToSkill],
    ["/skillchain.skillchain.QueryParamsRequest", QueryParamsRequest],
    ["/skillchain.skillchain.QueryUserVUSDPositionResponse", QueryUserVUSDPositionResponse],
    ["/skillchain.skillchain.GenesisState", GenesisState],
    ["/skillchain.skillchain.MsgBurn", MsgBurn],
    ["/skillchain.skillchain.MsgConvertSkillToVUSD", MsgConvertSkillToVUSD],
    ["/skillchain.skillchain.MsgConvertVUSDToSkillResponse", MsgConvertVUSDToSkillResponse],
    ["/skillchain.skillchain.MsgUpdateVUSDPrice", MsgUpdateVUSDPrice],
    ["/skillchain.skillchain.QueryTokenInfoRequest", QueryTokenInfoRequest],
    ["/skillchain.skillchain.QueryVUSDTreasuryRequest", QueryVUSDTreasuryRequest],
    ["/skillchain.skillchain.MsgUpdateParamsResponse", MsgUpdateParamsResponse],
    ["/skillchain.skillchain.MsgBurnResponse", MsgBurnResponse],
    ["/skillchain.skillchain.MsgCreateProfileResponse", MsgCreateProfileResponse],
    ["/skillchain.skillchain.QueryUserVUSDPositionRequest", QueryUserVUSDPositionRequest],
    ["/skillchain.skillchain.VUSDTreasury", VUSDTreasury],
    ["/skillchain.skillchain.UserVUSDPosition", UserVUSDPosition],
    
];

export { msgTypes }