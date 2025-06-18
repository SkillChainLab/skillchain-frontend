import { GeneratedType } from "@cosmjs/proto-signing";
import { QueryGetFileRecordResponse } from "./types/skillchain/filestorage/query";
import { QueryAllFilePermissionRequest } from "./types/skillchain/filestorage/query";
import { QueryGetFilePermissionRequest } from "./types/skillchain/filestorage/query";
import { MsgUpdateFileRecord } from "./types/skillchain/filestorage/tx";
import { FileRecord } from "./types/skillchain/filestorage/file_record";
import { QueryGetFileRecordRequest } from "./types/skillchain/filestorage/query";
import { FilePermission } from "./types/skillchain/filestorage/file_permission";
import { Params } from "./types/skillchain/filestorage/params";
import { QueryAllFileRecordRequest } from "./types/skillchain/filestorage/query";
import { QueryGetFilePermissionResponse } from "./types/skillchain/filestorage/query";
import { MsgCreateFilePermissionResponse } from "./types/skillchain/filestorage/tx";
import { MsgUpdateFilePermissionResponse } from "./types/skillchain/filestorage/tx";
import { QueryParamsResponse } from "./types/skillchain/filestorage/query";
import { MsgCreateFileRecord } from "./types/skillchain/filestorage/tx";
import { MsgDeleteFileRecord } from "./types/skillchain/filestorage/tx";
import { MsgUpdateFilePermission } from "./types/skillchain/filestorage/tx";
import { MsgUpdateParams } from "./types/skillchain/filestorage/tx";
import { MsgUpdateParamsResponse } from "./types/skillchain/filestorage/tx";
import { MsgUpdateFileRecordResponse } from "./types/skillchain/filestorage/tx";
import { QueryAllFilePermissionResponse } from "./types/skillchain/filestorage/query";
import { MsgCreateFilePermission } from "./types/skillchain/filestorage/tx";
import { MsgDeleteFilePermission } from "./types/skillchain/filestorage/tx";
import { MsgCreateFileRecordResponse } from "./types/skillchain/filestorage/tx";
import { MsgDeleteFileRecordResponse } from "./types/skillchain/filestorage/tx";
import { MsgDeleteFilePermissionResponse } from "./types/skillchain/filestorage/tx";
import { QueryParamsRequest } from "./types/skillchain/filestorage/query";
import { QueryAllFileRecordResponse } from "./types/skillchain/filestorage/query";
import { GenesisState } from "./types/skillchain/filestorage/genesis";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/skillchain.filestorage.QueryGetFileRecordResponse", QueryGetFileRecordResponse],
    ["/skillchain.filestorage.QueryAllFilePermissionRequest", QueryAllFilePermissionRequest],
    ["/skillchain.filestorage.QueryGetFilePermissionRequest", QueryGetFilePermissionRequest],
    ["/skillchain.filestorage.MsgUpdateFileRecord", MsgUpdateFileRecord],
    ["/skillchain.filestorage.FileRecord", FileRecord],
    ["/skillchain.filestorage.QueryGetFileRecordRequest", QueryGetFileRecordRequest],
    ["/skillchain.filestorage.FilePermission", FilePermission],
    ["/skillchain.filestorage.Params", Params],
    ["/skillchain.filestorage.QueryAllFileRecordRequest", QueryAllFileRecordRequest],
    ["/skillchain.filestorage.QueryGetFilePermissionResponse", QueryGetFilePermissionResponse],
    ["/skillchain.filestorage.MsgCreateFilePermissionResponse", MsgCreateFilePermissionResponse],
    ["/skillchain.filestorage.MsgUpdateFilePermissionResponse", MsgUpdateFilePermissionResponse],
    ["/skillchain.filestorage.QueryParamsResponse", QueryParamsResponse],
    ["/skillchain.filestorage.MsgCreateFileRecord", MsgCreateFileRecord],
    ["/skillchain.filestorage.MsgDeleteFileRecord", MsgDeleteFileRecord],
    ["/skillchain.filestorage.MsgUpdateFilePermission", MsgUpdateFilePermission],
    ["/skillchain.filestorage.MsgUpdateParams", MsgUpdateParams],
    ["/skillchain.filestorage.MsgUpdateParamsResponse", MsgUpdateParamsResponse],
    ["/skillchain.filestorage.MsgUpdateFileRecordResponse", MsgUpdateFileRecordResponse],
    ["/skillchain.filestorage.QueryAllFilePermissionResponse", QueryAllFilePermissionResponse],
    ["/skillchain.filestorage.MsgCreateFilePermission", MsgCreateFilePermission],
    ["/skillchain.filestorage.MsgDeleteFilePermission", MsgDeleteFilePermission],
    ["/skillchain.filestorage.MsgCreateFileRecordResponse", MsgCreateFileRecordResponse],
    ["/skillchain.filestorage.MsgDeleteFileRecordResponse", MsgDeleteFileRecordResponse],
    ["/skillchain.filestorage.MsgDeleteFilePermissionResponse", MsgDeleteFilePermissionResponse],
    ["/skillchain.filestorage.QueryParamsRequest", QueryParamsRequest],
    ["/skillchain.filestorage.QueryAllFileRecordResponse", QueryAllFileRecordResponse],
    ["/skillchain.filestorage.GenesisState", GenesisState],
    
];

export { msgTypes }