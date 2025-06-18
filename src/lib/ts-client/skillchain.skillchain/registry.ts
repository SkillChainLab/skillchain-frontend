import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgUpdateParams } from "./types/skillchain/skillchain/tx";
import { MsgCreateProfile } from "./types/skillchain/skillchain/tx";
import { MsgConvertSkillToVUSDResponse } from "./types/skillchain/skillchain/tx";
import { QueryParamsResponse } from "./types/skillchain/skillchain/query";
import { QueryTokenInfoRequest } from "./types/skillchain/skillchain/query";
import { QueryUserVUSDPositionResponse } from "./types/skillchain/skillchain/query";
import { VUSDTreasury } from "./types/skillchain/skillchain/vusd";
import { UserVUSDPosition } from "./types/skillchain/skillchain/vusd";
import { MsgCreateProfileResponse } from "./types/skillchain/skillchain/tx";
import { MsgConvertVUSDToSkillResponse } from "./types/skillchain/skillchain/tx";
import { MsgUpdateVUSDPriceResponse } from "./types/skillchain/skillchain/tx";
import { Params } from "./types/skillchain/skillchain/params";
import { QueryParamsRequest } from "./types/skillchain/skillchain/query";
import { QueryTokenInfoResponse } from "./types/skillchain/skillchain/query";
import { GenesisState } from "./types/skillchain/skillchain/genesis";
import { MsgBurn } from "./types/skillchain/skillchain/tx";
import { MsgUpdateParamsResponse } from "./types/skillchain/skillchain/tx";
import { MsgConvertVUSDToSkill } from "./types/skillchain/skillchain/tx";
import { MsgUpdateVUSDPrice } from "./types/skillchain/skillchain/tx";
import { QueryVUSDTreasuryResponse } from "./types/skillchain/skillchain/query";
import { MsgBurnResponse } from "./types/skillchain/skillchain/tx";
import { MsgConvertSkillToVUSD } from "./types/skillchain/skillchain/tx";
import { QueryVUSDTreasuryRequest } from "./types/skillchain/skillchain/query";
import { QueryUserVUSDPositionRequest } from "./types/skillchain/skillchain/query";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/skillchain.skillchain.MsgUpdateParams", MsgUpdateParams],
    ["/skillchain.skillchain.MsgCreateProfile", MsgCreateProfile],
    ["/skillchain.skillchain.MsgConvertSkillToVUSDResponse", MsgConvertSkillToVUSDResponse],
    ["/skillchain.skillchain.QueryParamsResponse", QueryParamsResponse],
    ["/skillchain.skillchain.QueryTokenInfoRequest", QueryTokenInfoRequest],
    ["/skillchain.skillchain.QueryUserVUSDPositionResponse", QueryUserVUSDPositionResponse],
    ["/skillchain.skillchain.VUSDTreasury", VUSDTreasury],
    ["/skillchain.skillchain.UserVUSDPosition", UserVUSDPosition],
    ["/skillchain.skillchain.MsgCreateProfileResponse", MsgCreateProfileResponse],
    ["/skillchain.skillchain.MsgConvertVUSDToSkillResponse", MsgConvertVUSDToSkillResponse],
    ["/skillchain.skillchain.MsgUpdateVUSDPriceResponse", MsgUpdateVUSDPriceResponse],
    ["/skillchain.skillchain.Params", Params],
    ["/skillchain.skillchain.QueryParamsRequest", QueryParamsRequest],
    ["/skillchain.skillchain.QueryTokenInfoResponse", QueryTokenInfoResponse],
    ["/skillchain.skillchain.GenesisState", GenesisState],
    ["/skillchain.skillchain.MsgBurn", MsgBurn],
    ["/skillchain.skillchain.MsgUpdateParamsResponse", MsgUpdateParamsResponse],
    ["/skillchain.skillchain.MsgConvertVUSDToSkill", MsgConvertVUSDToSkill],
    ["/skillchain.skillchain.MsgUpdateVUSDPrice", MsgUpdateVUSDPrice],
    ["/skillchain.skillchain.QueryVUSDTreasuryResponse", QueryVUSDTreasuryResponse],
    ["/skillchain.skillchain.MsgBurnResponse", MsgBurnResponse],
    ["/skillchain.skillchain.MsgConvertSkillToVUSD", MsgConvertSkillToVUSD],
    ["/skillchain.skillchain.QueryVUSDTreasuryRequest", QueryVUSDTreasuryRequest],
    ["/skillchain.skillchain.QueryUserVUSDPositionRequest", QueryUserVUSDPositionRequest],
    
];

export { msgTypes }