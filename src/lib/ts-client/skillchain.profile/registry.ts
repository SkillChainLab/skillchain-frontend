import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgUpdateUserSkill } from "./types/skillchain/profile/tx";
import { UserProfile } from "./types/skillchain/profile/user_profile";
import { SkillEndorsement } from "./types/skillchain/profile/skill_endorsement";
import { MsgUpdateParams } from "./types/skillchain/profile/tx";
import { MsgUpdateParamsResponse } from "./types/skillchain/profile/tx";
import { MsgCreateUserProfile } from "./types/skillchain/profile/tx";
import { MsgWithdrawStakedTokens } from "./types/skillchain/profile/tx";
import { Params } from "./types/skillchain/profile/params";
import { MsgWithdrawStakedTokensResponse } from "./types/skillchain/profile/tx";
import { UserSkill } from "./types/skillchain/profile/user_skill";
import { QueryParamsRequest } from "./types/skillchain/profile/query";
import { QueryGetSkillEndorsementRequest } from "./types/skillchain/profile/query";
import { QueryAllSkillEndorsementResponse } from "./types/skillchain/profile/query";
import { MsgCreateUserSkillResponse } from "./types/skillchain/profile/tx";
import { MsgDeleteSkillEndorsementResponse } from "./types/skillchain/profile/tx";
import { MsgDisputeEndorsementResponse } from "./types/skillchain/profile/tx";
import { QueryParamsResponse } from "./types/skillchain/profile/query";
import { QueryGetUserProfileRequest } from "./types/skillchain/profile/query";
import { QueryAllUserProfileRequest } from "./types/skillchain/profile/query";
import { QueryGetUserSkillRequest } from "./types/skillchain/profile/query";
import { MsgCreateSkillEndorsement } from "./types/skillchain/profile/tx";
import { MsgUpdateSkillEndorsement } from "./types/skillchain/profile/tx";
import { MsgDeleteUserSkillResponse } from "./types/skillchain/profile/tx";
import { QueryAllUserProfileResponse } from "./types/skillchain/profile/query";
import { QueryGetSkillEndorsementResponse } from "./types/skillchain/profile/query";
import { MsgEndorseSkill } from "./types/skillchain/profile/tx";
import { MsgCreateSkillEndorsementResponse } from "./types/skillchain/profile/tx";
import { MsgCreateProfile } from "./types/skillchain/profile/tx";
import { GenesisState } from "./types/skillchain/profile/genesis";
import { MsgDeleteUserProfile } from "./types/skillchain/profile/tx";
import { QueryGetUserProfileResponse } from "./types/skillchain/profile/query";
import { QueryAllUserSkillRequest } from "./types/skillchain/profile/query";
import { QueryAllUserSkillResponse } from "./types/skillchain/profile/query";
import { QueryAllSkillEndorsementRequest } from "./types/skillchain/profile/query";
import { MsgDeleteUserSkill } from "./types/skillchain/profile/tx";
import { MsgDeleteSkillEndorsement } from "./types/skillchain/profile/tx";
import { MsgUpdateUserProfileResponse } from "./types/skillchain/profile/tx";
import { QueryGetUserSkillResponse } from "./types/skillchain/profile/query";
import { MsgEndorseSkillResponse } from "./types/skillchain/profile/tx";
import { MsgUpdateSkillEndorsementResponse } from "./types/skillchain/profile/tx";
import { MsgCreateProfileResponse } from "./types/skillchain/profile/tx";
import { MsgCreateUserProfileResponse } from "./types/skillchain/profile/tx";
import { MsgUpdateUserProfile } from "./types/skillchain/profile/tx";
import { MsgDeleteUserProfileResponse } from "./types/skillchain/profile/tx";
import { MsgUpdateUserSkillResponse } from "./types/skillchain/profile/tx";
import { MsgDisputeEndorsement } from "./types/skillchain/profile/tx";
import { MsgCreateUserSkill } from "./types/skillchain/profile/tx";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/skillchain.profile.MsgUpdateUserSkill", MsgUpdateUserSkill],
    ["/skillchain.profile.UserProfile", UserProfile],
    ["/skillchain.profile.SkillEndorsement", SkillEndorsement],
    ["/skillchain.profile.MsgUpdateParams", MsgUpdateParams],
    ["/skillchain.profile.MsgUpdateParamsResponse", MsgUpdateParamsResponse],
    ["/skillchain.profile.MsgCreateUserProfile", MsgCreateUserProfile],
    ["/skillchain.profile.MsgWithdrawStakedTokens", MsgWithdrawStakedTokens],
    ["/skillchain.profile.Params", Params],
    ["/skillchain.profile.MsgWithdrawStakedTokensResponse", MsgWithdrawStakedTokensResponse],
    ["/skillchain.profile.UserSkill", UserSkill],
    ["/skillchain.profile.QueryParamsRequest", QueryParamsRequest],
    ["/skillchain.profile.QueryGetSkillEndorsementRequest", QueryGetSkillEndorsementRequest],
    ["/skillchain.profile.QueryAllSkillEndorsementResponse", QueryAllSkillEndorsementResponse],
    ["/skillchain.profile.MsgCreateUserSkillResponse", MsgCreateUserSkillResponse],
    ["/skillchain.profile.MsgDeleteSkillEndorsementResponse", MsgDeleteSkillEndorsementResponse],
    ["/skillchain.profile.MsgDisputeEndorsementResponse", MsgDisputeEndorsementResponse],
    ["/skillchain.profile.QueryParamsResponse", QueryParamsResponse],
    ["/skillchain.profile.QueryGetUserProfileRequest", QueryGetUserProfileRequest],
    ["/skillchain.profile.QueryAllUserProfileRequest", QueryAllUserProfileRequest],
    ["/skillchain.profile.QueryGetUserSkillRequest", QueryGetUserSkillRequest],
    ["/skillchain.profile.MsgCreateSkillEndorsement", MsgCreateSkillEndorsement],
    ["/skillchain.profile.MsgUpdateSkillEndorsement", MsgUpdateSkillEndorsement],
    ["/skillchain.profile.MsgDeleteUserSkillResponse", MsgDeleteUserSkillResponse],
    ["/skillchain.profile.QueryAllUserProfileResponse", QueryAllUserProfileResponse],
    ["/skillchain.profile.QueryGetSkillEndorsementResponse", QueryGetSkillEndorsementResponse],
    ["/skillchain.profile.MsgEndorseSkill", MsgEndorseSkill],
    ["/skillchain.profile.MsgCreateSkillEndorsementResponse", MsgCreateSkillEndorsementResponse],
    ["/skillchain.profile.MsgCreateProfile", MsgCreateProfile],
    ["/skillchain.profile.GenesisState", GenesisState],
    ["/skillchain.profile.MsgDeleteUserProfile", MsgDeleteUserProfile],
    ["/skillchain.profile.QueryGetUserProfileResponse", QueryGetUserProfileResponse],
    ["/skillchain.profile.QueryAllUserSkillRequest", QueryAllUserSkillRequest],
    ["/skillchain.profile.QueryAllUserSkillResponse", QueryAllUserSkillResponse],
    ["/skillchain.profile.QueryAllSkillEndorsementRequest", QueryAllSkillEndorsementRequest],
    ["/skillchain.profile.MsgDeleteUserSkill", MsgDeleteUserSkill],
    ["/skillchain.profile.MsgDeleteSkillEndorsement", MsgDeleteSkillEndorsement],
    ["/skillchain.profile.MsgUpdateUserProfileResponse", MsgUpdateUserProfileResponse],
    ["/skillchain.profile.QueryGetUserSkillResponse", QueryGetUserSkillResponse],
    ["/skillchain.profile.MsgEndorseSkillResponse", MsgEndorseSkillResponse],
    ["/skillchain.profile.MsgUpdateSkillEndorsementResponse", MsgUpdateSkillEndorsementResponse],
    ["/skillchain.profile.MsgCreateProfileResponse", MsgCreateProfileResponse],
    ["/skillchain.profile.MsgCreateUserProfileResponse", MsgCreateUserProfileResponse],
    ["/skillchain.profile.MsgUpdateUserProfile", MsgUpdateUserProfile],
    ["/skillchain.profile.MsgDeleteUserProfileResponse", MsgDeleteUserProfileResponse],
    ["/skillchain.profile.MsgUpdateUserSkillResponse", MsgUpdateUserSkillResponse],
    ["/skillchain.profile.MsgDisputeEndorsement", MsgDisputeEndorsement],
    ["/skillchain.profile.MsgCreateUserSkill", MsgCreateUserSkill],
    
];

export { msgTypes }