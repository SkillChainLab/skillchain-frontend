// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.6.1
//   protoc               unknown
// source: skillchain/skillchain/tx.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { Coin } from "../../cosmos/base/v1beta1/coin";
import { Params } from "./params";

export const protobufPackage = "skillchain.skillchain";

/** MsgUpdateParams is the Msg/UpdateParams request type. */
export interface MsgUpdateParams {
  /** authority is the address that controls the module (defaults to x/gov unless overwritten). */
  authority: string;
  /**
   * params defines the module parameters to update.
   *
   * NOTE: All parameters must be supplied.
   */
  params: Params | undefined;
}

/**
 * MsgUpdateParamsResponse defines the response structure for executing a
 * MsgUpdateParams message.
 */
export interface MsgUpdateParamsResponse {
}

export interface MsgBurn {
  creator: string;
  amount: Coin | undefined;
}

export interface MsgBurnResponse {
}

export interface MsgCreateProfile {
  creator: string;
  displayName: string;
  bio: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
  twitter: string;
}

export interface MsgCreateProfileResponse {
}

export interface MsgConvertSkillToVUSD {
  creator: string;
  amount: Coin | undefined;
}

export interface MsgConvertSkillToVUSDResponse {
  vusdMinted: Coin | undefined;
  collateralRatio: string;
}

export interface MsgConvertVUSDToSkill {
  creator: string;
  amount: Coin | undefined;
}

export interface MsgConvertVUSDToSkillResponse {
  skillReleased: Coin | undefined;
  collateralRatio: string;
}

export interface MsgUpdateVUSDPrice {
  creator: string;
  authority: string;
  newPrice: string;
  timestamp: number;
}

export interface MsgUpdateVUSDPriceResponse {
}

function createBaseMsgUpdateParams(): MsgUpdateParams {
  return { authority: "", params: undefined };
}

export const MsgUpdateParams: MessageFns<MsgUpdateParams> = {
  encode(message: MsgUpdateParams, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.authority !== "") {
      writer.uint32(10).string(message.authority);
    }
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(18).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): MsgUpdateParams {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgUpdateParams();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.authority = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.params = Params.decode(reader, reader.uint32());
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgUpdateParams {
    return {
      authority: isSet(object.authority) ? globalThis.String(object.authority) : "",
      params: isSet(object.params) ? Params.fromJSON(object.params) : undefined,
    };
  },

  toJSON(message: MsgUpdateParams): unknown {
    const obj: any = {};
    if (message.authority !== "") {
      obj.authority = message.authority;
    }
    if (message.params !== undefined) {
      obj.params = Params.toJSON(message.params);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgUpdateParams>, I>>(base?: I): MsgUpdateParams {
    return MsgUpdateParams.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgUpdateParams>, I>>(object: I): MsgUpdateParams {
    const message = createBaseMsgUpdateParams();
    message.authority = object.authority ?? "";
    message.params = (object.params !== undefined && object.params !== null)
      ? Params.fromPartial(object.params)
      : undefined;
    return message;
  },
};

function createBaseMsgUpdateParamsResponse(): MsgUpdateParamsResponse {
  return {};
}

export const MsgUpdateParamsResponse: MessageFns<MsgUpdateParamsResponse> = {
  encode(_: MsgUpdateParamsResponse, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): MsgUpdateParamsResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgUpdateParamsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): MsgUpdateParamsResponse {
    return {};
  },

  toJSON(_: MsgUpdateParamsResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgUpdateParamsResponse>, I>>(base?: I): MsgUpdateParamsResponse {
    return MsgUpdateParamsResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgUpdateParamsResponse>, I>>(_: I): MsgUpdateParamsResponse {
    const message = createBaseMsgUpdateParamsResponse();
    return message;
  },
};

function createBaseMsgBurn(): MsgBurn {
  return { creator: "", amount: undefined };
}

export const MsgBurn: MessageFns<MsgBurn> = {
  encode(message: MsgBurn, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.amount !== undefined) {
      Coin.encode(message.amount, writer.uint32(18).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): MsgBurn {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgBurn();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.creator = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.amount = Coin.decode(reader, reader.uint32());
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgBurn {
    return {
      creator: isSet(object.creator) ? globalThis.String(object.creator) : "",
      amount: isSet(object.amount) ? Coin.fromJSON(object.amount) : undefined,
    };
  },

  toJSON(message: MsgBurn): unknown {
    const obj: any = {};
    if (message.creator !== "") {
      obj.creator = message.creator;
    }
    if (message.amount !== undefined) {
      obj.amount = Coin.toJSON(message.amount);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgBurn>, I>>(base?: I): MsgBurn {
    return MsgBurn.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgBurn>, I>>(object: I): MsgBurn {
    const message = createBaseMsgBurn();
    message.creator = object.creator ?? "";
    message.amount = (object.amount !== undefined && object.amount !== null)
      ? Coin.fromPartial(object.amount)
      : undefined;
    return message;
  },
};

function createBaseMsgBurnResponse(): MsgBurnResponse {
  return {};
}

export const MsgBurnResponse: MessageFns<MsgBurnResponse> = {
  encode(_: MsgBurnResponse, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): MsgBurnResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgBurnResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): MsgBurnResponse {
    return {};
  },

  toJSON(_: MsgBurnResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgBurnResponse>, I>>(base?: I): MsgBurnResponse {
    return MsgBurnResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgBurnResponse>, I>>(_: I): MsgBurnResponse {
    const message = createBaseMsgBurnResponse();
    return message;
  },
};

function createBaseMsgCreateProfile(): MsgCreateProfile {
  return { creator: "", displayName: "", bio: "", location: "", website: "", github: "", linkedin: "", twitter: "" };
}

export const MsgCreateProfile: MessageFns<MsgCreateProfile> = {
  encode(message: MsgCreateProfile, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.displayName !== "") {
      writer.uint32(18).string(message.displayName);
    }
    if (message.bio !== "") {
      writer.uint32(26).string(message.bio);
    }
    if (message.location !== "") {
      writer.uint32(34).string(message.location);
    }
    if (message.website !== "") {
      writer.uint32(42).string(message.website);
    }
    if (message.github !== "") {
      writer.uint32(50).string(message.github);
    }
    if (message.linkedin !== "") {
      writer.uint32(58).string(message.linkedin);
    }
    if (message.twitter !== "") {
      writer.uint32(66).string(message.twitter);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): MsgCreateProfile {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgCreateProfile();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.creator = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.displayName = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.bio = reader.string();
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }

          message.location = reader.string();
          continue;
        }
        case 5: {
          if (tag !== 42) {
            break;
          }

          message.website = reader.string();
          continue;
        }
        case 6: {
          if (tag !== 50) {
            break;
          }

          message.github = reader.string();
          continue;
        }
        case 7: {
          if (tag !== 58) {
            break;
          }

          message.linkedin = reader.string();
          continue;
        }
        case 8: {
          if (tag !== 66) {
            break;
          }

          message.twitter = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgCreateProfile {
    return {
      creator: isSet(object.creator) ? globalThis.String(object.creator) : "",
      displayName: isSet(object.displayName) ? globalThis.String(object.displayName) : "",
      bio: isSet(object.bio) ? globalThis.String(object.bio) : "",
      location: isSet(object.location) ? globalThis.String(object.location) : "",
      website: isSet(object.website) ? globalThis.String(object.website) : "",
      github: isSet(object.github) ? globalThis.String(object.github) : "",
      linkedin: isSet(object.linkedin) ? globalThis.String(object.linkedin) : "",
      twitter: isSet(object.twitter) ? globalThis.String(object.twitter) : "",
    };
  },

  toJSON(message: MsgCreateProfile): unknown {
    const obj: any = {};
    if (message.creator !== "") {
      obj.creator = message.creator;
    }
    if (message.displayName !== "") {
      obj.displayName = message.displayName;
    }
    if (message.bio !== "") {
      obj.bio = message.bio;
    }
    if (message.location !== "") {
      obj.location = message.location;
    }
    if (message.website !== "") {
      obj.website = message.website;
    }
    if (message.github !== "") {
      obj.github = message.github;
    }
    if (message.linkedin !== "") {
      obj.linkedin = message.linkedin;
    }
    if (message.twitter !== "") {
      obj.twitter = message.twitter;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgCreateProfile>, I>>(base?: I): MsgCreateProfile {
    return MsgCreateProfile.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgCreateProfile>, I>>(object: I): MsgCreateProfile {
    const message = createBaseMsgCreateProfile();
    message.creator = object.creator ?? "";
    message.displayName = object.displayName ?? "";
    message.bio = object.bio ?? "";
    message.location = object.location ?? "";
    message.website = object.website ?? "";
    message.github = object.github ?? "";
    message.linkedin = object.linkedin ?? "";
    message.twitter = object.twitter ?? "";
    return message;
  },
};

function createBaseMsgCreateProfileResponse(): MsgCreateProfileResponse {
  return {};
}

export const MsgCreateProfileResponse: MessageFns<MsgCreateProfileResponse> = {
  encode(_: MsgCreateProfileResponse, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): MsgCreateProfileResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgCreateProfileResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): MsgCreateProfileResponse {
    return {};
  },

  toJSON(_: MsgCreateProfileResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgCreateProfileResponse>, I>>(base?: I): MsgCreateProfileResponse {
    return MsgCreateProfileResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgCreateProfileResponse>, I>>(_: I): MsgCreateProfileResponse {
    const message = createBaseMsgCreateProfileResponse();
    return message;
  },
};

function createBaseMsgConvertSkillToVUSD(): MsgConvertSkillToVUSD {
  return { creator: "", amount: undefined };
}

export const MsgConvertSkillToVUSD: MessageFns<MsgConvertSkillToVUSD> = {
  encode(message: MsgConvertSkillToVUSD, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.amount !== undefined) {
      Coin.encode(message.amount, writer.uint32(18).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): MsgConvertSkillToVUSD {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgConvertSkillToVUSD();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.creator = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.amount = Coin.decode(reader, reader.uint32());
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgConvertSkillToVUSD {
    return {
      creator: isSet(object.creator) ? globalThis.String(object.creator) : "",
      amount: isSet(object.amount) ? Coin.fromJSON(object.amount) : undefined,
    };
  },

  toJSON(message: MsgConvertSkillToVUSD): unknown {
    const obj: any = {};
    if (message.creator !== "") {
      obj.creator = message.creator;
    }
    if (message.amount !== undefined) {
      obj.amount = Coin.toJSON(message.amount);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgConvertSkillToVUSD>, I>>(base?: I): MsgConvertSkillToVUSD {
    return MsgConvertSkillToVUSD.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgConvertSkillToVUSD>, I>>(object: I): MsgConvertSkillToVUSD {
    const message = createBaseMsgConvertSkillToVUSD();
    message.creator = object.creator ?? "";
    message.amount = (object.amount !== undefined && object.amount !== null)
      ? Coin.fromPartial(object.amount)
      : undefined;
    return message;
  },
};

function createBaseMsgConvertSkillToVUSDResponse(): MsgConvertSkillToVUSDResponse {
  return { vusdMinted: undefined, collateralRatio: "" };
}

export const MsgConvertSkillToVUSDResponse: MessageFns<MsgConvertSkillToVUSDResponse> = {
  encode(message: MsgConvertSkillToVUSDResponse, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.vusdMinted !== undefined) {
      Coin.encode(message.vusdMinted, writer.uint32(10).fork()).join();
    }
    if (message.collateralRatio !== "") {
      writer.uint32(18).string(message.collateralRatio);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): MsgConvertSkillToVUSDResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgConvertSkillToVUSDResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.vusdMinted = Coin.decode(reader, reader.uint32());
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.collateralRatio = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgConvertSkillToVUSDResponse {
    return {
      vusdMinted: isSet(object.vusdMinted) ? Coin.fromJSON(object.vusdMinted) : undefined,
      collateralRatio: isSet(object.collateralRatio) ? globalThis.String(object.collateralRatio) : "",
    };
  },

  toJSON(message: MsgConvertSkillToVUSDResponse): unknown {
    const obj: any = {};
    if (message.vusdMinted !== undefined) {
      obj.vusdMinted = Coin.toJSON(message.vusdMinted);
    }
    if (message.collateralRatio !== "") {
      obj.collateralRatio = message.collateralRatio;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgConvertSkillToVUSDResponse>, I>>(base?: I): MsgConvertSkillToVUSDResponse {
    return MsgConvertSkillToVUSDResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgConvertSkillToVUSDResponse>, I>>(
    object: I,
  ): MsgConvertSkillToVUSDResponse {
    const message = createBaseMsgConvertSkillToVUSDResponse();
    message.vusdMinted = (object.vusdMinted !== undefined && object.vusdMinted !== null)
      ? Coin.fromPartial(object.vusdMinted)
      : undefined;
    message.collateralRatio = object.collateralRatio ?? "";
    return message;
  },
};

function createBaseMsgConvertVUSDToSkill(): MsgConvertVUSDToSkill {
  return { creator: "", amount: undefined };
}

export const MsgConvertVUSDToSkill: MessageFns<MsgConvertVUSDToSkill> = {
  encode(message: MsgConvertVUSDToSkill, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.amount !== undefined) {
      Coin.encode(message.amount, writer.uint32(18).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): MsgConvertVUSDToSkill {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgConvertVUSDToSkill();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.creator = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.amount = Coin.decode(reader, reader.uint32());
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgConvertVUSDToSkill {
    return {
      creator: isSet(object.creator) ? globalThis.String(object.creator) : "",
      amount: isSet(object.amount) ? Coin.fromJSON(object.amount) : undefined,
    };
  },

  toJSON(message: MsgConvertVUSDToSkill): unknown {
    const obj: any = {};
    if (message.creator !== "") {
      obj.creator = message.creator;
    }
    if (message.amount !== undefined) {
      obj.amount = Coin.toJSON(message.amount);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgConvertVUSDToSkill>, I>>(base?: I): MsgConvertVUSDToSkill {
    return MsgConvertVUSDToSkill.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgConvertVUSDToSkill>, I>>(object: I): MsgConvertVUSDToSkill {
    const message = createBaseMsgConvertVUSDToSkill();
    message.creator = object.creator ?? "";
    message.amount = (object.amount !== undefined && object.amount !== null)
      ? Coin.fromPartial(object.amount)
      : undefined;
    return message;
  },
};

function createBaseMsgConvertVUSDToSkillResponse(): MsgConvertVUSDToSkillResponse {
  return { skillReleased: undefined, collateralRatio: "" };
}

export const MsgConvertVUSDToSkillResponse: MessageFns<MsgConvertVUSDToSkillResponse> = {
  encode(message: MsgConvertVUSDToSkillResponse, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.skillReleased !== undefined) {
      Coin.encode(message.skillReleased, writer.uint32(10).fork()).join();
    }
    if (message.collateralRatio !== "") {
      writer.uint32(18).string(message.collateralRatio);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): MsgConvertVUSDToSkillResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgConvertVUSDToSkillResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.skillReleased = Coin.decode(reader, reader.uint32());
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.collateralRatio = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgConvertVUSDToSkillResponse {
    return {
      skillReleased: isSet(object.skillReleased) ? Coin.fromJSON(object.skillReleased) : undefined,
      collateralRatio: isSet(object.collateralRatio) ? globalThis.String(object.collateralRatio) : "",
    };
  },

  toJSON(message: MsgConvertVUSDToSkillResponse): unknown {
    const obj: any = {};
    if (message.skillReleased !== undefined) {
      obj.skillReleased = Coin.toJSON(message.skillReleased);
    }
    if (message.collateralRatio !== "") {
      obj.collateralRatio = message.collateralRatio;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgConvertVUSDToSkillResponse>, I>>(base?: I): MsgConvertVUSDToSkillResponse {
    return MsgConvertVUSDToSkillResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgConvertVUSDToSkillResponse>, I>>(
    object: I,
  ): MsgConvertVUSDToSkillResponse {
    const message = createBaseMsgConvertVUSDToSkillResponse();
    message.skillReleased = (object.skillReleased !== undefined && object.skillReleased !== null)
      ? Coin.fromPartial(object.skillReleased)
      : undefined;
    message.collateralRatio = object.collateralRatio ?? "";
    return message;
  },
};

function createBaseMsgUpdateVUSDPrice(): MsgUpdateVUSDPrice {
  return { creator: "", authority: "", newPrice: "", timestamp: 0 };
}

export const MsgUpdateVUSDPrice: MessageFns<MsgUpdateVUSDPrice> = {
  encode(message: MsgUpdateVUSDPrice, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.authority !== "") {
      writer.uint32(18).string(message.authority);
    }
    if (message.newPrice !== "") {
      writer.uint32(26).string(message.newPrice);
    }
    if (message.timestamp !== 0) {
      writer.uint32(32).int64(message.timestamp);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): MsgUpdateVUSDPrice {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgUpdateVUSDPrice();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.creator = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.authority = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.newPrice = reader.string();
          continue;
        }
        case 4: {
          if (tag !== 32) {
            break;
          }

          message.timestamp = longToNumber(reader.int64());
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): MsgUpdateVUSDPrice {
    return {
      creator: isSet(object.creator) ? globalThis.String(object.creator) : "",
      authority: isSet(object.authority) ? globalThis.String(object.authority) : "",
      newPrice: isSet(object.newPrice) ? globalThis.String(object.newPrice) : "",
      timestamp: isSet(object.timestamp) ? globalThis.Number(object.timestamp) : 0,
    };
  },

  toJSON(message: MsgUpdateVUSDPrice): unknown {
    const obj: any = {};
    if (message.creator !== "") {
      obj.creator = message.creator;
    }
    if (message.authority !== "") {
      obj.authority = message.authority;
    }
    if (message.newPrice !== "") {
      obj.newPrice = message.newPrice;
    }
    if (message.timestamp !== 0) {
      obj.timestamp = Math.round(message.timestamp);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgUpdateVUSDPrice>, I>>(base?: I): MsgUpdateVUSDPrice {
    return MsgUpdateVUSDPrice.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgUpdateVUSDPrice>, I>>(object: I): MsgUpdateVUSDPrice {
    const message = createBaseMsgUpdateVUSDPrice();
    message.creator = object.creator ?? "";
    message.authority = object.authority ?? "";
    message.newPrice = object.newPrice ?? "";
    message.timestamp = object.timestamp ?? 0;
    return message;
  },
};

function createBaseMsgUpdateVUSDPriceResponse(): MsgUpdateVUSDPriceResponse {
  return {};
}

export const MsgUpdateVUSDPriceResponse: MessageFns<MsgUpdateVUSDPriceResponse> = {
  encode(_: MsgUpdateVUSDPriceResponse, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): MsgUpdateVUSDPriceResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgUpdateVUSDPriceResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): MsgUpdateVUSDPriceResponse {
    return {};
  },

  toJSON(_: MsgUpdateVUSDPriceResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<MsgUpdateVUSDPriceResponse>, I>>(base?: I): MsgUpdateVUSDPriceResponse {
    return MsgUpdateVUSDPriceResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<MsgUpdateVUSDPriceResponse>, I>>(_: I): MsgUpdateVUSDPriceResponse {
    const message = createBaseMsgUpdateVUSDPriceResponse();
    return message;
  },
};

/** Msg defines the Msg service. */
export interface Msg {
  /**
   * UpdateParams defines a (governance) operation for updating the module
   * parameters. The authority defaults to the x/gov module account.
   */
  UpdateParams(request: MsgUpdateParams): Promise<MsgUpdateParamsResponse>;
  Burn(request: MsgBurn): Promise<MsgBurnResponse>;
  CreateProfile(request: MsgCreateProfile): Promise<MsgCreateProfileResponse>;
  ConvertSkillToVUSD(request: MsgConvertSkillToVUSD): Promise<MsgConvertSkillToVUSDResponse>;
  ConvertVUSDToSkill(request: MsgConvertVUSDToSkill): Promise<MsgConvertVUSDToSkillResponse>;
  UpdateVUSDPrice(request: MsgUpdateVUSDPrice): Promise<MsgUpdateVUSDPriceResponse>;
}

export const MsgServiceName = "skillchain.skillchain.Msg";
export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || MsgServiceName;
    this.rpc = rpc;
    this.UpdateParams = this.UpdateParams.bind(this);
    this.Burn = this.Burn.bind(this);
    this.CreateProfile = this.CreateProfile.bind(this);
    this.ConvertSkillToVUSD = this.ConvertSkillToVUSD.bind(this);
    this.ConvertVUSDToSkill = this.ConvertVUSDToSkill.bind(this);
    this.UpdateVUSDPrice = this.UpdateVUSDPrice.bind(this);
  }
  UpdateParams(request: MsgUpdateParams): Promise<MsgUpdateParamsResponse> {
    const data = MsgUpdateParams.encode(request).finish();
    const promise = this.rpc.request(this.service, "UpdateParams", data);
    return promise.then((data) => MsgUpdateParamsResponse.decode(new BinaryReader(data)));
  }

  Burn(request: MsgBurn): Promise<MsgBurnResponse> {
    const data = MsgBurn.encode(request).finish();
    const promise = this.rpc.request(this.service, "Burn", data);
    return promise.then((data) => MsgBurnResponse.decode(new BinaryReader(data)));
  }

  CreateProfile(request: MsgCreateProfile): Promise<MsgCreateProfileResponse> {
    const data = MsgCreateProfile.encode(request).finish();
    const promise = this.rpc.request(this.service, "CreateProfile", data);
    return promise.then((data) => MsgCreateProfileResponse.decode(new BinaryReader(data)));
  }

  ConvertSkillToVUSD(request: MsgConvertSkillToVUSD): Promise<MsgConvertSkillToVUSDResponse> {
    const data = MsgConvertSkillToVUSD.encode(request).finish();
    const promise = this.rpc.request(this.service, "ConvertSkillToVUSD", data);
    return promise.then((data) => MsgConvertSkillToVUSDResponse.decode(new BinaryReader(data)));
  }

  ConvertVUSDToSkill(request: MsgConvertVUSDToSkill): Promise<MsgConvertVUSDToSkillResponse> {
    const data = MsgConvertVUSDToSkill.encode(request).finish();
    const promise = this.rpc.request(this.service, "ConvertVUSDToSkill", data);
    return promise.then((data) => MsgConvertVUSDToSkillResponse.decode(new BinaryReader(data)));
  }

  UpdateVUSDPrice(request: MsgUpdateVUSDPrice): Promise<MsgUpdateVUSDPriceResponse> {
    const data = MsgUpdateVUSDPrice.encode(request).finish();
    const promise = this.rpc.request(this.service, "UpdateVUSDPrice", data);
    return promise.then((data) => MsgUpdateVUSDPriceResponse.decode(new BinaryReader(data)));
  }
}

interface Rpc {
  request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function longToNumber(int64: { toString(): string }): number {
  const num = globalThis.Number(int64.toString());
  if (num > globalThis.Number.MAX_SAFE_INTEGER) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  if (num < globalThis.Number.MIN_SAFE_INTEGER) {
    throw new globalThis.Error("Value is smaller than Number.MIN_SAFE_INTEGER");
  }
  return num;
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

export interface MessageFns<T> {
  encode(message: T, writer?: BinaryWriter): BinaryWriter;
  decode(input: BinaryReader | Uint8Array, length?: number): T;
  fromJSON(object: any): T;
  toJSON(message: T): unknown;
  create<I extends Exact<DeepPartial<T>, I>>(base?: I): T;
  fromPartial<I extends Exact<DeepPartial<T>, I>>(object: I): T;
}
