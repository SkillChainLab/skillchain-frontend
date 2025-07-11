// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.6.1
//   protoc               unknown
// source: skillchain/analytics/query.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { PageRequest, PageResponse } from "../../cosmos/base/query/v1beta1/pagination";
import { Params } from "./params";
import { PlatformMetric } from "./platform_metric";
import { RevenueRecord } from "./revenue_record";
import { UserActivity } from "./user_activity";

export const protobufPackage = "skillchain.analytics";

/** QueryParamsRequest is request type for the Query/Params RPC method. */
export interface QueryParamsRequest {
}

/** QueryParamsResponse is response type for the Query/Params RPC method. */
export interface QueryParamsResponse {
  /** params holds all the parameters of this module. */
  params: Params | undefined;
}

export interface QueryGetPlatformMetricRequest {
  index: string;
}

export interface QueryGetPlatformMetricResponse {
  platformMetric: PlatformMetric | undefined;
}

export interface QueryAllPlatformMetricRequest {
  pagination: PageRequest | undefined;
}

export interface QueryAllPlatformMetricResponse {
  platformMetric: PlatformMetric[];
  pagination: PageResponse | undefined;
}

export interface QueryGetUserActivityRequest {
  index: string;
}

export interface QueryGetUserActivityResponse {
  userActivity: UserActivity | undefined;
}

export interface QueryAllUserActivityRequest {
  pagination: PageRequest | undefined;
}

export interface QueryAllUserActivityResponse {
  userActivity: UserActivity[];
  pagination: PageResponse | undefined;
}

export interface QueryGetRevenueRecordRequest {
  index: string;
}

export interface QueryGetRevenueRecordResponse {
  revenueRecord: RevenueRecord | undefined;
}

export interface QueryAllRevenueRecordRequest {
  pagination: PageRequest | undefined;
}

export interface QueryAllRevenueRecordResponse {
  revenueRecord: RevenueRecord[];
  pagination: PageResponse | undefined;
}

function createBaseQueryParamsRequest(): QueryParamsRequest {
  return {};
}

export const QueryParamsRequest: MessageFns<QueryParamsRequest> = {
  encode(_: QueryParamsRequest, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): QueryParamsRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryParamsRequest();
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

  fromJSON(_: any): QueryParamsRequest {
    return {};
  },

  toJSON(_: QueryParamsRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryParamsRequest>, I>>(base?: I): QueryParamsRequest {
    return QueryParamsRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryParamsRequest>, I>>(_: I): QueryParamsRequest {
    const message = createBaseQueryParamsRequest();
    return message;
  },
};

function createBaseQueryParamsResponse(): QueryParamsResponse {
  return { params: undefined };
}

export const QueryParamsResponse: MessageFns<QueryParamsResponse> = {
  encode(message: QueryParamsResponse, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.params !== undefined) {
      Params.encode(message.params, writer.uint32(10).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): QueryParamsResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryParamsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
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

  fromJSON(object: any): QueryParamsResponse {
    return { params: isSet(object.params) ? Params.fromJSON(object.params) : undefined };
  },

  toJSON(message: QueryParamsResponse): unknown {
    const obj: any = {};
    if (message.params !== undefined) {
      obj.params = Params.toJSON(message.params);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryParamsResponse>, I>>(base?: I): QueryParamsResponse {
    return QueryParamsResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryParamsResponse>, I>>(object: I): QueryParamsResponse {
    const message = createBaseQueryParamsResponse();
    message.params = (object.params !== undefined && object.params !== null)
      ? Params.fromPartial(object.params)
      : undefined;
    return message;
  },
};

function createBaseQueryGetPlatformMetricRequest(): QueryGetPlatformMetricRequest {
  return { index: "" };
}

export const QueryGetPlatformMetricRequest: MessageFns<QueryGetPlatformMetricRequest> = {
  encode(message: QueryGetPlatformMetricRequest, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.index !== "") {
      writer.uint32(10).string(message.index);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): QueryGetPlatformMetricRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryGetPlatformMetricRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.index = reader.string();
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

  fromJSON(object: any): QueryGetPlatformMetricRequest {
    return { index: isSet(object.index) ? globalThis.String(object.index) : "" };
  },

  toJSON(message: QueryGetPlatformMetricRequest): unknown {
    const obj: any = {};
    if (message.index !== "") {
      obj.index = message.index;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryGetPlatformMetricRequest>, I>>(base?: I): QueryGetPlatformMetricRequest {
    return QueryGetPlatformMetricRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryGetPlatformMetricRequest>, I>>(
    object: I,
  ): QueryGetPlatformMetricRequest {
    const message = createBaseQueryGetPlatformMetricRequest();
    message.index = object.index ?? "";
    return message;
  },
};

function createBaseQueryGetPlatformMetricResponse(): QueryGetPlatformMetricResponse {
  return { platformMetric: undefined };
}

export const QueryGetPlatformMetricResponse: MessageFns<QueryGetPlatformMetricResponse> = {
  encode(message: QueryGetPlatformMetricResponse, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.platformMetric !== undefined) {
      PlatformMetric.encode(message.platformMetric, writer.uint32(10).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): QueryGetPlatformMetricResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryGetPlatformMetricResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.platformMetric = PlatformMetric.decode(reader, reader.uint32());
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

  fromJSON(object: any): QueryGetPlatformMetricResponse {
    return {
      platformMetric: isSet(object.platformMetric) ? PlatformMetric.fromJSON(object.platformMetric) : undefined,
    };
  },

  toJSON(message: QueryGetPlatformMetricResponse): unknown {
    const obj: any = {};
    if (message.platformMetric !== undefined) {
      obj.platformMetric = PlatformMetric.toJSON(message.platformMetric);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryGetPlatformMetricResponse>, I>>(base?: I): QueryGetPlatformMetricResponse {
    return QueryGetPlatformMetricResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryGetPlatformMetricResponse>, I>>(
    object: I,
  ): QueryGetPlatformMetricResponse {
    const message = createBaseQueryGetPlatformMetricResponse();
    message.platformMetric = (object.platformMetric !== undefined && object.platformMetric !== null)
      ? PlatformMetric.fromPartial(object.platformMetric)
      : undefined;
    return message;
  },
};

function createBaseQueryAllPlatformMetricRequest(): QueryAllPlatformMetricRequest {
  return { pagination: undefined };
}

export const QueryAllPlatformMetricRequest: MessageFns<QueryAllPlatformMetricRequest> = {
  encode(message: QueryAllPlatformMetricRequest, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(10).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): QueryAllPlatformMetricRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryAllPlatformMetricRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.pagination = PageRequest.decode(reader, reader.uint32());
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

  fromJSON(object: any): QueryAllPlatformMetricRequest {
    return { pagination: isSet(object.pagination) ? PageRequest.fromJSON(object.pagination) : undefined };
  },

  toJSON(message: QueryAllPlatformMetricRequest): unknown {
    const obj: any = {};
    if (message.pagination !== undefined) {
      obj.pagination = PageRequest.toJSON(message.pagination);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryAllPlatformMetricRequest>, I>>(base?: I): QueryAllPlatformMetricRequest {
    return QueryAllPlatformMetricRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryAllPlatformMetricRequest>, I>>(
    object: I,
  ): QueryAllPlatformMetricRequest {
    const message = createBaseQueryAllPlatformMetricRequest();
    message.pagination = (object.pagination !== undefined && object.pagination !== null)
      ? PageRequest.fromPartial(object.pagination)
      : undefined;
    return message;
  },
};

function createBaseQueryAllPlatformMetricResponse(): QueryAllPlatformMetricResponse {
  return { platformMetric: [], pagination: undefined };
}

export const QueryAllPlatformMetricResponse: MessageFns<QueryAllPlatformMetricResponse> = {
  encode(message: QueryAllPlatformMetricResponse, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    for (const v of message.platformMetric) {
      PlatformMetric.encode(v!, writer.uint32(10).fork()).join();
    }
    if (message.pagination !== undefined) {
      PageResponse.encode(message.pagination, writer.uint32(18).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): QueryAllPlatformMetricResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryAllPlatformMetricResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.platformMetric.push(PlatformMetric.decode(reader, reader.uint32()));
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.pagination = PageResponse.decode(reader, reader.uint32());
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

  fromJSON(object: any): QueryAllPlatformMetricResponse {
    return {
      platformMetric: globalThis.Array.isArray(object?.platformMetric)
        ? object.platformMetric.map((e: any) => PlatformMetric.fromJSON(e))
        : [],
      pagination: isSet(object.pagination) ? PageResponse.fromJSON(object.pagination) : undefined,
    };
  },

  toJSON(message: QueryAllPlatformMetricResponse): unknown {
    const obj: any = {};
    if (message.platformMetric?.length) {
      obj.platformMetric = message.platformMetric.map((e) => PlatformMetric.toJSON(e));
    }
    if (message.pagination !== undefined) {
      obj.pagination = PageResponse.toJSON(message.pagination);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryAllPlatformMetricResponse>, I>>(base?: I): QueryAllPlatformMetricResponse {
    return QueryAllPlatformMetricResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryAllPlatformMetricResponse>, I>>(
    object: I,
  ): QueryAllPlatformMetricResponse {
    const message = createBaseQueryAllPlatformMetricResponse();
    message.platformMetric = object.platformMetric?.map((e) => PlatformMetric.fromPartial(e)) || [];
    message.pagination = (object.pagination !== undefined && object.pagination !== null)
      ? PageResponse.fromPartial(object.pagination)
      : undefined;
    return message;
  },
};

function createBaseQueryGetUserActivityRequest(): QueryGetUserActivityRequest {
  return { index: "" };
}

export const QueryGetUserActivityRequest: MessageFns<QueryGetUserActivityRequest> = {
  encode(message: QueryGetUserActivityRequest, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.index !== "") {
      writer.uint32(10).string(message.index);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): QueryGetUserActivityRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryGetUserActivityRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.index = reader.string();
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

  fromJSON(object: any): QueryGetUserActivityRequest {
    return { index: isSet(object.index) ? globalThis.String(object.index) : "" };
  },

  toJSON(message: QueryGetUserActivityRequest): unknown {
    const obj: any = {};
    if (message.index !== "") {
      obj.index = message.index;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryGetUserActivityRequest>, I>>(base?: I): QueryGetUserActivityRequest {
    return QueryGetUserActivityRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryGetUserActivityRequest>, I>>(object: I): QueryGetUserActivityRequest {
    const message = createBaseQueryGetUserActivityRequest();
    message.index = object.index ?? "";
    return message;
  },
};

function createBaseQueryGetUserActivityResponse(): QueryGetUserActivityResponse {
  return { userActivity: undefined };
}

export const QueryGetUserActivityResponse: MessageFns<QueryGetUserActivityResponse> = {
  encode(message: QueryGetUserActivityResponse, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.userActivity !== undefined) {
      UserActivity.encode(message.userActivity, writer.uint32(10).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): QueryGetUserActivityResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryGetUserActivityResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.userActivity = UserActivity.decode(reader, reader.uint32());
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

  fromJSON(object: any): QueryGetUserActivityResponse {
    return { userActivity: isSet(object.userActivity) ? UserActivity.fromJSON(object.userActivity) : undefined };
  },

  toJSON(message: QueryGetUserActivityResponse): unknown {
    const obj: any = {};
    if (message.userActivity !== undefined) {
      obj.userActivity = UserActivity.toJSON(message.userActivity);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryGetUserActivityResponse>, I>>(base?: I): QueryGetUserActivityResponse {
    return QueryGetUserActivityResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryGetUserActivityResponse>, I>>(object: I): QueryGetUserActivityResponse {
    const message = createBaseQueryGetUserActivityResponse();
    message.userActivity = (object.userActivity !== undefined && object.userActivity !== null)
      ? UserActivity.fromPartial(object.userActivity)
      : undefined;
    return message;
  },
};

function createBaseQueryAllUserActivityRequest(): QueryAllUserActivityRequest {
  return { pagination: undefined };
}

export const QueryAllUserActivityRequest: MessageFns<QueryAllUserActivityRequest> = {
  encode(message: QueryAllUserActivityRequest, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(10).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): QueryAllUserActivityRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryAllUserActivityRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.pagination = PageRequest.decode(reader, reader.uint32());
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

  fromJSON(object: any): QueryAllUserActivityRequest {
    return { pagination: isSet(object.pagination) ? PageRequest.fromJSON(object.pagination) : undefined };
  },

  toJSON(message: QueryAllUserActivityRequest): unknown {
    const obj: any = {};
    if (message.pagination !== undefined) {
      obj.pagination = PageRequest.toJSON(message.pagination);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryAllUserActivityRequest>, I>>(base?: I): QueryAllUserActivityRequest {
    return QueryAllUserActivityRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryAllUserActivityRequest>, I>>(object: I): QueryAllUserActivityRequest {
    const message = createBaseQueryAllUserActivityRequest();
    message.pagination = (object.pagination !== undefined && object.pagination !== null)
      ? PageRequest.fromPartial(object.pagination)
      : undefined;
    return message;
  },
};

function createBaseQueryAllUserActivityResponse(): QueryAllUserActivityResponse {
  return { userActivity: [], pagination: undefined };
}

export const QueryAllUserActivityResponse: MessageFns<QueryAllUserActivityResponse> = {
  encode(message: QueryAllUserActivityResponse, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    for (const v of message.userActivity) {
      UserActivity.encode(v!, writer.uint32(10).fork()).join();
    }
    if (message.pagination !== undefined) {
      PageResponse.encode(message.pagination, writer.uint32(18).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): QueryAllUserActivityResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryAllUserActivityResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.userActivity.push(UserActivity.decode(reader, reader.uint32()));
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.pagination = PageResponse.decode(reader, reader.uint32());
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

  fromJSON(object: any): QueryAllUserActivityResponse {
    return {
      userActivity: globalThis.Array.isArray(object?.userActivity)
        ? object.userActivity.map((e: any) => UserActivity.fromJSON(e))
        : [],
      pagination: isSet(object.pagination) ? PageResponse.fromJSON(object.pagination) : undefined,
    };
  },

  toJSON(message: QueryAllUserActivityResponse): unknown {
    const obj: any = {};
    if (message.userActivity?.length) {
      obj.userActivity = message.userActivity.map((e) => UserActivity.toJSON(e));
    }
    if (message.pagination !== undefined) {
      obj.pagination = PageResponse.toJSON(message.pagination);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryAllUserActivityResponse>, I>>(base?: I): QueryAllUserActivityResponse {
    return QueryAllUserActivityResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryAllUserActivityResponse>, I>>(object: I): QueryAllUserActivityResponse {
    const message = createBaseQueryAllUserActivityResponse();
    message.userActivity = object.userActivity?.map((e) => UserActivity.fromPartial(e)) || [];
    message.pagination = (object.pagination !== undefined && object.pagination !== null)
      ? PageResponse.fromPartial(object.pagination)
      : undefined;
    return message;
  },
};

function createBaseQueryGetRevenueRecordRequest(): QueryGetRevenueRecordRequest {
  return { index: "" };
}

export const QueryGetRevenueRecordRequest: MessageFns<QueryGetRevenueRecordRequest> = {
  encode(message: QueryGetRevenueRecordRequest, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.index !== "") {
      writer.uint32(10).string(message.index);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): QueryGetRevenueRecordRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryGetRevenueRecordRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.index = reader.string();
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

  fromJSON(object: any): QueryGetRevenueRecordRequest {
    return { index: isSet(object.index) ? globalThis.String(object.index) : "" };
  },

  toJSON(message: QueryGetRevenueRecordRequest): unknown {
    const obj: any = {};
    if (message.index !== "") {
      obj.index = message.index;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryGetRevenueRecordRequest>, I>>(base?: I): QueryGetRevenueRecordRequest {
    return QueryGetRevenueRecordRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryGetRevenueRecordRequest>, I>>(object: I): QueryGetRevenueRecordRequest {
    const message = createBaseQueryGetRevenueRecordRequest();
    message.index = object.index ?? "";
    return message;
  },
};

function createBaseQueryGetRevenueRecordResponse(): QueryGetRevenueRecordResponse {
  return { revenueRecord: undefined };
}

export const QueryGetRevenueRecordResponse: MessageFns<QueryGetRevenueRecordResponse> = {
  encode(message: QueryGetRevenueRecordResponse, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.revenueRecord !== undefined) {
      RevenueRecord.encode(message.revenueRecord, writer.uint32(10).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): QueryGetRevenueRecordResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryGetRevenueRecordResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.revenueRecord = RevenueRecord.decode(reader, reader.uint32());
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

  fromJSON(object: any): QueryGetRevenueRecordResponse {
    return { revenueRecord: isSet(object.revenueRecord) ? RevenueRecord.fromJSON(object.revenueRecord) : undefined };
  },

  toJSON(message: QueryGetRevenueRecordResponse): unknown {
    const obj: any = {};
    if (message.revenueRecord !== undefined) {
      obj.revenueRecord = RevenueRecord.toJSON(message.revenueRecord);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryGetRevenueRecordResponse>, I>>(base?: I): QueryGetRevenueRecordResponse {
    return QueryGetRevenueRecordResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryGetRevenueRecordResponse>, I>>(
    object: I,
  ): QueryGetRevenueRecordResponse {
    const message = createBaseQueryGetRevenueRecordResponse();
    message.revenueRecord = (object.revenueRecord !== undefined && object.revenueRecord !== null)
      ? RevenueRecord.fromPartial(object.revenueRecord)
      : undefined;
    return message;
  },
};

function createBaseQueryAllRevenueRecordRequest(): QueryAllRevenueRecordRequest {
  return { pagination: undefined };
}

export const QueryAllRevenueRecordRequest: MessageFns<QueryAllRevenueRecordRequest> = {
  encode(message: QueryAllRevenueRecordRequest, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.pagination !== undefined) {
      PageRequest.encode(message.pagination, writer.uint32(10).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): QueryAllRevenueRecordRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryAllRevenueRecordRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.pagination = PageRequest.decode(reader, reader.uint32());
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

  fromJSON(object: any): QueryAllRevenueRecordRequest {
    return { pagination: isSet(object.pagination) ? PageRequest.fromJSON(object.pagination) : undefined };
  },

  toJSON(message: QueryAllRevenueRecordRequest): unknown {
    const obj: any = {};
    if (message.pagination !== undefined) {
      obj.pagination = PageRequest.toJSON(message.pagination);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryAllRevenueRecordRequest>, I>>(base?: I): QueryAllRevenueRecordRequest {
    return QueryAllRevenueRecordRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryAllRevenueRecordRequest>, I>>(object: I): QueryAllRevenueRecordRequest {
    const message = createBaseQueryAllRevenueRecordRequest();
    message.pagination = (object.pagination !== undefined && object.pagination !== null)
      ? PageRequest.fromPartial(object.pagination)
      : undefined;
    return message;
  },
};

function createBaseQueryAllRevenueRecordResponse(): QueryAllRevenueRecordResponse {
  return { revenueRecord: [], pagination: undefined };
}

export const QueryAllRevenueRecordResponse: MessageFns<QueryAllRevenueRecordResponse> = {
  encode(message: QueryAllRevenueRecordResponse, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    for (const v of message.revenueRecord) {
      RevenueRecord.encode(v!, writer.uint32(10).fork()).join();
    }
    if (message.pagination !== undefined) {
      PageResponse.encode(message.pagination, writer.uint32(18).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): QueryAllRevenueRecordResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseQueryAllRevenueRecordResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.revenueRecord.push(RevenueRecord.decode(reader, reader.uint32()));
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.pagination = PageResponse.decode(reader, reader.uint32());
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

  fromJSON(object: any): QueryAllRevenueRecordResponse {
    return {
      revenueRecord: globalThis.Array.isArray(object?.revenueRecord)
        ? object.revenueRecord.map((e: any) => RevenueRecord.fromJSON(e))
        : [],
      pagination: isSet(object.pagination) ? PageResponse.fromJSON(object.pagination) : undefined,
    };
  },

  toJSON(message: QueryAllRevenueRecordResponse): unknown {
    const obj: any = {};
    if (message.revenueRecord?.length) {
      obj.revenueRecord = message.revenueRecord.map((e) => RevenueRecord.toJSON(e));
    }
    if (message.pagination !== undefined) {
      obj.pagination = PageResponse.toJSON(message.pagination);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<QueryAllRevenueRecordResponse>, I>>(base?: I): QueryAllRevenueRecordResponse {
    return QueryAllRevenueRecordResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<QueryAllRevenueRecordResponse>, I>>(
    object: I,
  ): QueryAllRevenueRecordResponse {
    const message = createBaseQueryAllRevenueRecordResponse();
    message.revenueRecord = object.revenueRecord?.map((e) => RevenueRecord.fromPartial(e)) || [];
    message.pagination = (object.pagination !== undefined && object.pagination !== null)
      ? PageResponse.fromPartial(object.pagination)
      : undefined;
    return message;
  },
};

/** Query defines the gRPC querier service. */
export interface Query {
  /** Parameters queries the parameters of the module. */
  Params(request: QueryParamsRequest): Promise<QueryParamsResponse>;
  /** Queries a list of PlatformMetric items. */
  PlatformMetric(request: QueryGetPlatformMetricRequest): Promise<QueryGetPlatformMetricResponse>;
  PlatformMetricAll(request: QueryAllPlatformMetricRequest): Promise<QueryAllPlatformMetricResponse>;
  /** Queries a list of UserActivity items. */
  UserActivity(request: QueryGetUserActivityRequest): Promise<QueryGetUserActivityResponse>;
  UserActivityAll(request: QueryAllUserActivityRequest): Promise<QueryAllUserActivityResponse>;
  /** Queries a list of RevenueRecord items. */
  RevenueRecord(request: QueryGetRevenueRecordRequest): Promise<QueryGetRevenueRecordResponse>;
  RevenueRecordAll(request: QueryAllRevenueRecordRequest): Promise<QueryAllRevenueRecordResponse>;
}

export const QueryServiceName = "skillchain.analytics.Query";
export class QueryClientImpl implements Query {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || QueryServiceName;
    this.rpc = rpc;
    this.Params = this.Params.bind(this);
    this.PlatformMetric = this.PlatformMetric.bind(this);
    this.PlatformMetricAll = this.PlatformMetricAll.bind(this);
    this.UserActivity = this.UserActivity.bind(this);
    this.UserActivityAll = this.UserActivityAll.bind(this);
    this.RevenueRecord = this.RevenueRecord.bind(this);
    this.RevenueRecordAll = this.RevenueRecordAll.bind(this);
  }
  Params(request: QueryParamsRequest): Promise<QueryParamsResponse> {
    const data = QueryParamsRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "Params", data);
    return promise.then((data) => QueryParamsResponse.decode(new BinaryReader(data)));
  }

  PlatformMetric(request: QueryGetPlatformMetricRequest): Promise<QueryGetPlatformMetricResponse> {
    const data = QueryGetPlatformMetricRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "PlatformMetric", data);
    return promise.then((data) => QueryGetPlatformMetricResponse.decode(new BinaryReader(data)));
  }

  PlatformMetricAll(request: QueryAllPlatformMetricRequest): Promise<QueryAllPlatformMetricResponse> {
    const data = QueryAllPlatformMetricRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "PlatformMetricAll", data);
    return promise.then((data) => QueryAllPlatformMetricResponse.decode(new BinaryReader(data)));
  }

  UserActivity(request: QueryGetUserActivityRequest): Promise<QueryGetUserActivityResponse> {
    const data = QueryGetUserActivityRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "UserActivity", data);
    return promise.then((data) => QueryGetUserActivityResponse.decode(new BinaryReader(data)));
  }

  UserActivityAll(request: QueryAllUserActivityRequest): Promise<QueryAllUserActivityResponse> {
    const data = QueryAllUserActivityRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "UserActivityAll", data);
    return promise.then((data) => QueryAllUserActivityResponse.decode(new BinaryReader(data)));
  }

  RevenueRecord(request: QueryGetRevenueRecordRequest): Promise<QueryGetRevenueRecordResponse> {
    const data = QueryGetRevenueRecordRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "RevenueRecord", data);
    return promise.then((data) => QueryGetRevenueRecordResponse.decode(new BinaryReader(data)));
  }

  RevenueRecordAll(request: QueryAllRevenueRecordRequest): Promise<QueryAllRevenueRecordResponse> {
    const data = QueryAllRevenueRecordRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "RevenueRecordAll", data);
    return promise.then((data) => QueryAllRevenueRecordResponse.decode(new BinaryReader(data)));
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
