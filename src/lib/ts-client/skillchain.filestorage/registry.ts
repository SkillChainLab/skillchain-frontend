import { GeneratedType } from "@cosmjs/proto-signing";
import { MsgUpdateFileRecordResponse } from "./types/skillchain/filestorage/tx";
import { MsgDeleteFilePermissionResponse } from "./types/skillchain/filestorage/tx";
import { GenesisState } from "./types/skillchain/filestorage/genesis";
import { MsgUpdateParamsResponse } from "./types/skillchain/filestorage/tx";
import { MsgCreateFilePermissionResponse } from "./types/skillchain/filestorage/tx";
import { QueryGetFileRecordResponse } from "./types/skillchain/filestorage/query";
import { QueryAllFileRecordRequest } from "./types/skillchain/filestorage/query";
import { QueryGetFilePermissionRequest } from "./types/skillchain/filestorage/query";
import { QueryAllFilePermissionResponse } from "./types/skillchain/filestorage/query";
import { FilePermission } from "./types/skillchain/filestorage/file_permission";
import { QueryAllFilePermissionRequest } from "./types/skillchain/filestorage/query";
import { MsgDeleteFileRecord } from "./types/skillchain/filestorage/tx";
import { MsgCreateFilePermission } from "./types/skillchain/filestorage/tx";
import { Params } from "./types/skillchain/filestorage/params";
import { QueryAllFileRecordResponse } from "./types/skillchain/filestorage/query";
import { MsgUpdateParams } from "./types/skillchain/filestorage/tx";
import { MsgDeleteFilePermission } from "./types/skillchain/filestorage/tx";
import { FileRecord } from "./types/skillchain/filestorage/file_record";
import { QueryParamsResponse } from "./types/skillchain/filestorage/query";
import { MsgUpdateFileRecord } from "./types/skillchain/filestorage/tx";
import { MsgDeleteFileRecordResponse } from "./types/skillchain/filestorage/tx";
import { MsgUpdateFilePermissionResponse } from "./types/skillchain/filestorage/tx";
import { QueryParamsRequest } from "./types/skillchain/filestorage/query";
import { QueryGetFilePermissionResponse } from "./types/skillchain/filestorage/query";
import { MsgUpdateFilePermission } from "./types/skillchain/filestorage/tx";
import { QueryGetFileRecordRequest } from "./types/skillchain/filestorage/query";
import { MsgCreateFileRecord } from "./types/skillchain/filestorage/tx";
import { MsgCreateFileRecordResponse } from "./types/skillchain/filestorage/tx";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/skillchain.filestorage.MsgUpdateFileRecordResponse", MsgUpdateFileRecordResponse],
    ["/skillchain.filestorage.MsgDeleteFilePermissionResponse", MsgDeleteFilePermissionResponse],
    ["/skillchain.filestorage.GenesisState", GenesisState],
    ["/skillchain.filestorage.MsgUpdateParamsResponse", MsgUpdateParamsResponse],
    ["/skillchain.filestorage.MsgCreateFilePermissionResponse", MsgCreateFilePermissionResponse],
    ["/skillchain.filestorage.QueryGetFileRecordResponse", QueryGetFileRecordResponse],
    ["/skillchain.filestorage.QueryAllFileRecordRequest", QueryAllFileRecordRequest],
    ["/skillchain.filestorage.QueryGetFilePermissionRequest", QueryGetFilePermissionRequest],
    ["/skillchain.filestorage.QueryAllFilePermissionResponse", QueryAllFilePermissionResponse],
    ["/skillchain.filestorage.FilePermission", FilePermission],
    ["/skillchain.filestorage.QueryAllFilePermissionRequest", QueryAllFilePermissionRequest],
    ["/skillchain.filestorage.MsgDeleteFileRecord", MsgDeleteFileRecord],
    ["/skillchain.filestorage.MsgCreateFilePermission", MsgCreateFilePermission],
    ["/skillchain.filestorage.Params", Params],
    ["/skillchain.filestorage.QueryAllFileRecordResponse", QueryAllFileRecordResponse],
    ["/skillchain.filestorage.MsgUpdateParams", MsgUpdateParams],
    ["/skillchain.filestorage.MsgDeleteFilePermission", MsgDeleteFilePermission],
    ["/skillchain.filestorage.FileRecord", FileRecord],
    ["/skillchain.filestorage.QueryParamsResponse", QueryParamsResponse],
    ["/skillchain.filestorage.MsgUpdateFileRecord", MsgUpdateFileRecord],
    ["/skillchain.filestorage.MsgDeleteFileRecordResponse", MsgDeleteFileRecordResponse],
    ["/skillchain.filestorage.MsgUpdateFilePermissionResponse", MsgUpdateFilePermissionResponse],
    ["/skillchain.filestorage.QueryParamsRequest", QueryParamsRequest],
    ["/skillchain.filestorage.QueryGetFilePermissionResponse", QueryGetFilePermissionResponse],
    ["/skillchain.filestorage.MsgUpdateFilePermission", MsgUpdateFilePermission],
    ["/skillchain.filestorage.QueryGetFileRecordRequest", QueryGetFileRecordRequest],
    ["/skillchain.filestorage.MsgCreateFileRecord", MsgCreateFileRecord],
    ["/skillchain.filestorage.MsgCreateFileRecordResponse", MsgCreateFileRecordResponse],
    
];

export { msgTypes }