import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgUpdateParamsResponse } from "./types/skillchain/profile/tx";
import { MsgCreateUserProfileResponse } from "./types/skillchain/profile/tx";
import { MsgDeleteUserProfileResponse } from "./types/skillchain/profile/tx";
import { MsgDisputeEndorsementResponse } from "./types/skillchain/profile/tx";
import { MsgDeleteUserProfile } from "./types/skillchain/profile/tx";
import { MsgDeleteSkillEndorsement } from "./types/skillchain/profile/tx";
import { GenesisState } from "./types/skillchain/profile/genesis";
import { QueryGetUserProfileResponse } from "./types/skillchain/profile/query";
import { QueryAllUserSkillRequest } from "./types/skillchain/profile/query";
import { MsgCreateSkillEndorsementResponse } from "./types/skillchain/profile/tx";
import { MsgDisputeEndorsement } from "./types/skillchain/profile/tx";
import { QueryGetUserSkillRequest } from "./types/skillchain/profile/query";
import { QueryGetSkillEndorsementRequest } from "./types/skillchain/profile/query";
import { QueryAllSkillEndorsementResponse } from "./types/skillchain/profile/query";
import { MsgWithdrawStakedTokens } from "./types/skillchain/profile/tx";
import { MsgWithdrawStakedTokensResponse } from "./types/skillchain/profile/tx";
import { MsgUpdateUserProfileResponse } from "./types/skillchain/profile/tx";
import { MsgUpdateUserSkillResponse } from "./types/skillchain/profile/tx";
import { MsgUpdateSkillEndorsementResponse } from "./types/skillchain/profile/tx";
import { SkillEndorsement } from "./types/skillchain/profile/skill_endorsement";
import { QueryGetUserSkillResponse } from "./types/skillchain/profile/query";
import { MsgCreateUserSkillResponse } from "./types/skillchain/profile/tx";
import { MsgEndorseSkillResponse } from "./types/skillchain/profile/tx";
import { MsgDeleteSkillEndorsementResponse } from "./types/skillchain/profile/tx";
import { UserProfile } from "./types/skillchain/profile/user_profile";
import { MsgUpdateSkillEndorsement } from "./types/skillchain/profile/tx";
import { MsgUpdateUserSkill } from "./types/skillchain/profile/tx";
import { QueryParamsRequest } from "./types/skillchain/profile/query";
import { MsgCreateProfileResponse } from "./types/skillchain/profile/tx";
import { MsgDeleteUserSkillResponse } from "./types/skillchain/profile/tx";
import { MsgCreateUserSkill } from "./types/skillchain/profile/tx";
import { QueryAllUserProfileResponse } from "./types/skillchain/profile/query";
import { QueryAllUserSkillResponse } from "./types/skillchain/profile/query";
import { QueryAllSkillEndorsementRequest } from "./types/skillchain/profile/query";
import { MsgUpdateParams } from "./types/skillchain/profile/tx";
import { MsgCreateUserProfile } from "./types/skillchain/profile/tx";
import { MsgUpdateUserProfile } from "./types/skillchain/profile/tx";
import { MsgCreateSkillEndorsement } from "./types/skillchain/profile/tx";
import { MsgEndorseSkill } from "./types/skillchain/profile/tx";
import { Params } from "./types/skillchain/profile/params";
import { MsgCreateProfile } from "./types/skillchain/profile/tx";
import { UserSkill } from "./types/skillchain/profile/user_skill";
import { QueryParamsResponse } from "./types/skillchain/profile/query";
import { MsgDeleteUserSkill } from "./types/skillchain/profile/tx";
import { QueryGetUserProfileRequest } from "./types/skillchain/profile/query";
import { QueryAllUserProfileRequest } from "./types/skillchain/profile/query";
import { QueryGetSkillEndorsementResponse } from "./types/skillchain/profile/query";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/skillchain.profile.MsgUpdateParamsResponse", MsgUpdateParamsResponse],
    ["/skillchain.profile.MsgCreateUserProfileResponse", MsgCreateUserProfileResponse],
    ["/skillchain.profile.MsgDeleteUserProfileResponse", MsgDeleteUserProfileResponse],
    ["/skillchain.profile.MsgDisputeEndorsementResponse", MsgDisputeEndorsementResponse],
    ["/skillchain.profile.MsgDeleteUserProfile", MsgDeleteUserProfile],
    ["/skillchain.profile.MsgDeleteSkillEndorsement", MsgDeleteSkillEndorsement],
    ["/skillchain.profile.GenesisState", GenesisState],
    ["/skillchain.profile.QueryGetUserProfileResponse", QueryGetUserProfileResponse],
    ["/skillchain.profile.QueryAllUserSkillRequest", QueryAllUserSkillRequest],
    ["/skillchain.profile.MsgCreateSkillEndorsementResponse", MsgCreateSkillEndorsementResponse],
    ["/skillchain.profile.MsgDisputeEndorsement", MsgDisputeEndorsement],
    ["/skillchain.profile.QueryGetUserSkillRequest", QueryGetUserSkillRequest],
    ["/skillchain.profile.QueryGetSkillEndorsementRequest", QueryGetSkillEndorsementRequest],
    ["/skillchain.profile.QueryAllSkillEndorsementResponse", QueryAllSkillEndorsementResponse],
    ["/skillchain.profile.MsgWithdrawStakedTokens", MsgWithdrawStakedTokens],
    ["/skillchain.profile.MsgWithdrawStakedTokensResponse", MsgWithdrawStakedTokensResponse],
    ["/skillchain.profile.MsgUpdateUserProfileResponse", MsgUpdateUserProfileResponse],
    ["/skillchain.profile.MsgUpdateUserSkillResponse", MsgUpdateUserSkillResponse],
    ["/skillchain.profile.MsgUpdateSkillEndorsementResponse", MsgUpdateSkillEndorsementResponse],
    ["/skillchain.profile.SkillEndorsement", SkillEndorsement],
    ["/skillchain.profile.QueryGetUserSkillResponse", QueryGetUserSkillResponse],
    ["/skillchain.profile.MsgCreateUserSkillResponse", MsgCreateUserSkillResponse],
    ["/skillchain.profile.MsgEndorseSkillResponse", MsgEndorseSkillResponse],
    ["/skillchain.profile.MsgDeleteSkillEndorsementResponse", MsgDeleteSkillEndorsementResponse],
    ["/skillchain.profile.UserProfile", UserProfile],
    ["/skillchain.profile.MsgUpdateSkillEndorsement", MsgUpdateSkillEndorsement],
    ["/skillchain.profile.MsgUpdateUserSkill", MsgUpdateUserSkill],
    ["/skillchain.profile.QueryParamsRequest", QueryParamsRequest],
    ["/skillchain.profile.MsgCreateProfileResponse", MsgCreateProfileResponse],
    ["/skillchain.profile.MsgDeleteUserSkillResponse", MsgDeleteUserSkillResponse],
    ["/skillchain.profile.MsgCreateUserSkill", MsgCreateUserSkill],
    ["/skillchain.profile.QueryAllUserProfileResponse", QueryAllUserProfileResponse],
    ["/skillchain.profile.QueryAllUserSkillResponse", QueryAllUserSkillResponse],
    ["/skillchain.profile.QueryAllSkillEndorsementRequest", QueryAllSkillEndorsementRequest],
    ["/skillchain.profile.MsgUpdateParams", MsgUpdateParams],
    ["/skillchain.profile.MsgCreateUserProfile", MsgCreateUserProfile],
    ["/skillchain.profile.MsgUpdateUserProfile", MsgUpdateUserProfile],
    ["/skillchain.profile.MsgCreateSkillEndorsement", MsgCreateSkillEndorsement],
    ["/skillchain.profile.MsgEndorseSkill", MsgEndorseSkill],
    ["/skillchain.profile.Params", Params],
    ["/skillchain.profile.MsgCreateProfile", MsgCreateProfile],
    ["/skillchain.profile.UserSkill", UserSkill],
    ["/skillchain.profile.QueryParamsResponse", QueryParamsResponse],
    ["/skillchain.profile.MsgDeleteUserSkill", MsgDeleteUserSkill],
    ["/skillchain.profile.QueryGetUserProfileRequest", QueryGetUserProfileRequest],
    ["/skillchain.profile.QueryAllUserProfileRequest", QueryAllUserProfileRequest],
    ["/skillchain.profile.QueryGetSkillEndorsementResponse", QueryGetSkillEndorsementResponse],
    
];

export { msgTypes }