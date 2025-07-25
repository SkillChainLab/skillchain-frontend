// Generated by Ignite ignite.com/cli
import { Registry } from '@cosmjs/proto-signing'
import { IgniteClient } from "./client";
import { MissingWalletError } from "./helpers";
import { IgntModule as SkillchainAnalytics, msgTypes as SkillchainAnalyticsMsgTypes } from './skillchain/analytics'
import { IgntModule as SkillchainFilestorage, msgTypes as SkillchainFilestorageMsgTypes } from './skillchain/filestorage'
import { IgntModule as SkillchainMarketplace, msgTypes as SkillchainMarketplaceMsgTypes } from './skillchain/marketplace'
import { IgntModule as SkillchainNotifications, msgTypes as SkillchainNotificationsMsgTypes } from './skillchain/notifications'
import { IgntModule as SkillchainProfile, msgTypes as SkillchainProfileMsgTypes } from './skillchain/profile'
import { IgntModule as SkillchainSkillchain, msgTypes as SkillchainSkillchainMsgTypes } from './skillchain/skillchain'


const Client = IgniteClient.plugin([
    SkillchainAnalytics, SkillchainFilestorage, SkillchainMarketplace, SkillchainNotifications, SkillchainProfile, SkillchainSkillchain
]);

const registry = new Registry([
  ...SkillchainAnalyticsMsgTypes,
  ...SkillchainFilestorageMsgTypes,
  ...SkillchainMarketplaceMsgTypes,
  ...SkillchainNotificationsMsgTypes,
  ...SkillchainProfileMsgTypes,
  ...SkillchainSkillchainMsgTypes,
  
])

export {
    Client,
    registry,
    MissingWalletError
}
