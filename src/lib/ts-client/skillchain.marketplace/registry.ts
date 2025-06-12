import { GeneratedType } from "@cosmjs/proto-signing";
import { QueryListProposalsResponse } from "./types/skillchain/marketplace/query";
import { QueryGetProjectRequest } from "./types/skillchain/marketplace/query";
import { QueryAllProjectRequest } from "./types/skillchain/marketplace/query";
import { MsgDeleteProject } from "./types/skillchain/marketplace/tx";
import { MsgDeleteProjectResponse } from "./types/skillchain/marketplace/tx";
import { MsgAcceptProposal } from "./types/skillchain/marketplace/tx";
import { MsgAcceptProposalResponse } from "./types/skillchain/marketplace/tx";
import { MsgCompleteMilestone } from "./types/skillchain/marketplace/tx";
import { QueryGetProposalRequest } from "./types/skillchain/marketplace/query";
import { QueryAllProposalRequest } from "./types/skillchain/marketplace/query";
import { QueryAllProposalResponse } from "./types/skillchain/marketplace/query";
import { QueryAllMilestoneRequest } from "./types/skillchain/marketplace/query";
import { MsgUpdateMilestone } from "./types/skillchain/marketplace/tx";
import { MsgDeleteProposal } from "./types/skillchain/marketplace/tx";
import { MsgUpdateProject } from "./types/skillchain/marketplace/tx";
import { MsgUpdateParams } from "./types/skillchain/marketplace/tx";
import { MsgDeleteProposalResponse } from "./types/skillchain/marketplace/tx";
import { MsgCreateMilestone } from "./types/skillchain/marketplace/tx";
import { QueryParamsResponse } from "./types/skillchain/marketplace/query";
import { QueryAllJobPostingResponse } from "./types/skillchain/marketplace/query";
import { QueryAllProjectResponse } from "./types/skillchain/marketplace/query";
import { Proposal } from "./types/skillchain/marketplace/proposal";
import { MsgCreateProjectResponse } from "./types/skillchain/marketplace/tx";
import { MsgUpdateProjectResponse } from "./types/skillchain/marketplace/tx";
import { QueryGetMilestoneResponse } from "./types/skillchain/marketplace/query";
import { QueryListProjectsResponse } from "./types/skillchain/marketplace/query";
import { MsgCreateProposal } from "./types/skillchain/marketplace/tx";
import { MsgCreateMilestoneResponse } from "./types/skillchain/marketplace/tx";
import { MsgDisputeProjectResponse } from "./types/skillchain/marketplace/tx";
import { Milestone } from "./types/skillchain/marketplace/milestone";
import { MsgCreateJobPostingResponse } from "./types/skillchain/marketplace/tx";
import { MsgCreateProposalResponse } from "./types/skillchain/marketplace/tx";
import { MsgUpdateProposalResponse } from "./types/skillchain/marketplace/tx";
import { MsgReleasePaymentResponse } from "./types/skillchain/marketplace/tx";
import { Params } from "./types/skillchain/marketplace/params";
import { Project } from "./types/skillchain/marketplace/project";
import { QueryGetProposalResponse } from "./types/skillchain/marketplace/query";
import { QueryAllMilestoneResponse } from "./types/skillchain/marketplace/query";
import { QueryListProposalsRequest } from "./types/skillchain/marketplace/query";
import { MsgUpdateParamsResponse } from "./types/skillchain/marketplace/tx";
import { MsgDeleteJobPostingResponse } from "./types/skillchain/marketplace/tx";
import { MsgCompleteMilestoneResponse } from "./types/skillchain/marketplace/tx";
import { QueryListJobPostingsRequest } from "./types/skillchain/marketplace/query";
import { QueryGetMilestoneRequest } from "./types/skillchain/marketplace/query";
import { MsgUpdateMilestoneResponse } from "./types/skillchain/marketplace/tx";
import { MsgDisputeProject } from "./types/skillchain/marketplace/tx";
import { MsgUpdateProposal } from "./types/skillchain/marketplace/tx";
import { MsgCreateProject } from "./types/skillchain/marketplace/tx";
import { MsgUpdateJobPostingResponse } from "./types/skillchain/marketplace/tx";
import { MsgDeleteMilestone } from "./types/skillchain/marketplace/tx";
import { MsgReleasePayment } from "./types/skillchain/marketplace/tx";
import { QueryGetJobPostingRequest } from "./types/skillchain/marketplace/query";
import { MsgDeleteJobPosting } from "./types/skillchain/marketplace/tx";
import { QueryParamsRequest } from "./types/skillchain/marketplace/query";
import { QueryAllJobPostingRequest } from "./types/skillchain/marketplace/query";
import { QueryGetProjectResponse } from "./types/skillchain/marketplace/query";
import { JobPosting } from "./types/skillchain/marketplace/job_posting";
import { MsgDeleteMilestoneResponse } from "./types/skillchain/marketplace/tx";
import { QueryGetJobPostingResponse } from "./types/skillchain/marketplace/query";
import { QueryListJobPostingsResponse } from "./types/skillchain/marketplace/query";
import { GenesisState } from "./types/skillchain/marketplace/genesis";
import { MsgCreateJobPosting } from "./types/skillchain/marketplace/tx";
import { MsgUpdateJobPosting } from "./types/skillchain/marketplace/tx";
import { QueryListProjectsRequest } from "./types/skillchain/marketplace/query";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/skillchain.marketplace.QueryListProposalsResponse", QueryListProposalsResponse],
    ["/skillchain.marketplace.QueryGetProjectRequest", QueryGetProjectRequest],
    ["/skillchain.marketplace.QueryAllProjectRequest", QueryAllProjectRequest],
    ["/skillchain.marketplace.MsgDeleteProject", MsgDeleteProject],
    ["/skillchain.marketplace.MsgDeleteProjectResponse", MsgDeleteProjectResponse],
    ["/skillchain.marketplace.MsgAcceptProposal", MsgAcceptProposal],
    ["/skillchain.marketplace.MsgAcceptProposalResponse", MsgAcceptProposalResponse],
    ["/skillchain.marketplace.MsgCompleteMilestone", MsgCompleteMilestone],
    ["/skillchain.marketplace.QueryGetProposalRequest", QueryGetProposalRequest],
    ["/skillchain.marketplace.QueryAllProposalRequest", QueryAllProposalRequest],
    ["/skillchain.marketplace.QueryAllProposalResponse", QueryAllProposalResponse],
    ["/skillchain.marketplace.QueryAllMilestoneRequest", QueryAllMilestoneRequest],
    ["/skillchain.marketplace.MsgUpdateMilestone", MsgUpdateMilestone],
    ["/skillchain.marketplace.MsgDeleteProposal", MsgDeleteProposal],
    ["/skillchain.marketplace.MsgUpdateProject", MsgUpdateProject],
    ["/skillchain.marketplace.MsgUpdateParams", MsgUpdateParams],
    ["/skillchain.marketplace.MsgDeleteProposalResponse", MsgDeleteProposalResponse],
    ["/skillchain.marketplace.MsgCreateMilestone", MsgCreateMilestone],
    ["/skillchain.marketplace.QueryParamsResponse", QueryParamsResponse],
    ["/skillchain.marketplace.QueryAllJobPostingResponse", QueryAllJobPostingResponse],
    ["/skillchain.marketplace.QueryAllProjectResponse", QueryAllProjectResponse],
    ["/skillchain.marketplace.Proposal", Proposal],
    ["/skillchain.marketplace.MsgCreateProjectResponse", MsgCreateProjectResponse],
    ["/skillchain.marketplace.MsgUpdateProjectResponse", MsgUpdateProjectResponse],
    ["/skillchain.marketplace.QueryGetMilestoneResponse", QueryGetMilestoneResponse],
    ["/skillchain.marketplace.QueryListProjectsResponse", QueryListProjectsResponse],
    ["/skillchain.marketplace.MsgCreateProposal", MsgCreateProposal],
    ["/skillchain.marketplace.MsgCreateMilestoneResponse", MsgCreateMilestoneResponse],
    ["/skillchain.marketplace.MsgDisputeProjectResponse", MsgDisputeProjectResponse],
    ["/skillchain.marketplace.Milestone", Milestone],
    ["/skillchain.marketplace.MsgCreateJobPostingResponse", MsgCreateJobPostingResponse],
    ["/skillchain.marketplace.MsgCreateProposalResponse", MsgCreateProposalResponse],
    ["/skillchain.marketplace.MsgUpdateProposalResponse", MsgUpdateProposalResponse],
    ["/skillchain.marketplace.MsgReleasePaymentResponse", MsgReleasePaymentResponse],
    ["/skillchain.marketplace.Params", Params],
    ["/skillchain.marketplace.Project", Project],
    ["/skillchain.marketplace.QueryGetProposalResponse", QueryGetProposalResponse],
    ["/skillchain.marketplace.QueryAllMilestoneResponse", QueryAllMilestoneResponse],
    ["/skillchain.marketplace.QueryListProposalsRequest", QueryListProposalsRequest],
    ["/skillchain.marketplace.MsgUpdateParamsResponse", MsgUpdateParamsResponse],
    ["/skillchain.marketplace.MsgDeleteJobPostingResponse", MsgDeleteJobPostingResponse],
    ["/skillchain.marketplace.MsgCompleteMilestoneResponse", MsgCompleteMilestoneResponse],
    ["/skillchain.marketplace.QueryListJobPostingsRequest", QueryListJobPostingsRequest],
    ["/skillchain.marketplace.QueryGetMilestoneRequest", QueryGetMilestoneRequest],
    ["/skillchain.marketplace.MsgUpdateMilestoneResponse", MsgUpdateMilestoneResponse],
    ["/skillchain.marketplace.MsgDisputeProject", MsgDisputeProject],
    ["/skillchain.marketplace.MsgUpdateProposal", MsgUpdateProposal],
    ["/skillchain.marketplace.MsgCreateProject", MsgCreateProject],
    ["/skillchain.marketplace.MsgUpdateJobPostingResponse", MsgUpdateJobPostingResponse],
    ["/skillchain.marketplace.MsgDeleteMilestone", MsgDeleteMilestone],
    ["/skillchain.marketplace.MsgReleasePayment", MsgReleasePayment],
    ["/skillchain.marketplace.QueryGetJobPostingRequest", QueryGetJobPostingRequest],
    ["/skillchain.marketplace.MsgDeleteJobPosting", MsgDeleteJobPosting],
    ["/skillchain.marketplace.QueryParamsRequest", QueryParamsRequest],
    ["/skillchain.marketplace.QueryAllJobPostingRequest", QueryAllJobPostingRequest],
    ["/skillchain.marketplace.QueryGetProjectResponse", QueryGetProjectResponse],
    ["/skillchain.marketplace.JobPosting", JobPosting],
    ["/skillchain.marketplace.MsgDeleteMilestoneResponse", MsgDeleteMilestoneResponse],
    ["/skillchain.marketplace.QueryGetJobPostingResponse", QueryGetJobPostingResponse],
    ["/skillchain.marketplace.QueryListJobPostingsResponse", QueryListJobPostingsResponse],
    ["/skillchain.marketplace.GenesisState", GenesisState],
    ["/skillchain.marketplace.MsgCreateJobPosting", MsgCreateJobPosting],
    ["/skillchain.marketplace.MsgUpdateJobPosting", MsgUpdateJobPosting],
    ["/skillchain.marketplace.QueryListProjectsRequest", QueryListProjectsRequest],
    
];

export { msgTypes }