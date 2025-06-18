import { GeneratedType } from "@cosmjs/proto-signing";
import { QueryListJobPostingsResponse } from "./types/skillchain/marketplace/query";
import { MsgCreateProject } from "./types/skillchain/marketplace/tx";
import { MsgDeleteProposalResponse } from "./types/skillchain/marketplace/tx";
import { MsgUpdateMilestone } from "./types/skillchain/marketplace/tx";
import { MsgDeleteMilestoneResponse } from "./types/skillchain/marketplace/tx";
import { MsgCompleteMilestoneResponse } from "./types/skillchain/marketplace/tx";
import { MsgDisputeProject } from "./types/skillchain/marketplace/tx";
import { MsgCreateProjectResponse } from "./types/skillchain/marketplace/tx";
import { QueryAllMilestoneResponse } from "./types/skillchain/marketplace/query";
import { MsgUpdateJobPostingResponse } from "./types/skillchain/marketplace/tx";
import { QueryListJobPostingsRequest } from "./types/skillchain/marketplace/query";
import { QueryListProposalsRequest } from "./types/skillchain/marketplace/query";
import { MsgCreateJobPostingResponse } from "./types/skillchain/marketplace/tx";
import { MsgDeleteJobPostingResponse } from "./types/skillchain/marketplace/tx";
import { MsgReleasePayment } from "./types/skillchain/marketplace/tx";
import { QueryAllJobPostingResponse } from "./types/skillchain/marketplace/query";
import { QueryGetProposalRequest } from "./types/skillchain/marketplace/query";
import { Project } from "./types/skillchain/marketplace/project";
import { MsgUpdateMilestoneResponse } from "./types/skillchain/marketplace/tx";
import { Params } from "./types/skillchain/marketplace/params";
import { QueryGetJobPostingResponse } from "./types/skillchain/marketplace/query";
import { QueryListProjectsResponse } from "./types/skillchain/marketplace/query";
import { MsgUpdateParams } from "./types/skillchain/marketplace/tx";
import { MsgUpdateProjectResponse } from "./types/skillchain/marketplace/tx";
import { QueryAllProposalRequest } from "./types/skillchain/marketplace/query";
import { MsgUpdateParamsResponse } from "./types/skillchain/marketplace/tx";
import { MsgCreateJobPosting } from "./types/skillchain/marketplace/tx";
import { MsgDeleteProjectResponse } from "./types/skillchain/marketplace/tx";
import { MsgCreateMilestone } from "./types/skillchain/marketplace/tx";
import { MsgDeleteMilestone } from "./types/skillchain/marketplace/tx";
import { GenesisState } from "./types/skillchain/marketplace/genesis";
import { QueryGetProjectRequest } from "./types/skillchain/marketplace/query";
import { Proposal } from "./types/skillchain/marketplace/proposal";
import { MsgUpdateProposal } from "./types/skillchain/marketplace/tx";
import { QueryAllJobPostingRequest } from "./types/skillchain/marketplace/query";
import { MsgUpdateProposalResponse } from "./types/skillchain/marketplace/tx";
import { QueryAllProjectRequest } from "./types/skillchain/marketplace/query";
import { QueryGetMilestoneRequest } from "./types/skillchain/marketplace/query";
import { QueryGetMilestoneResponse } from "./types/skillchain/marketplace/query";
import { QueryListProposalsResponse } from "./types/skillchain/marketplace/query";
import { QueryListProjectsRequest } from "./types/skillchain/marketplace/query";
import { MsgCreateProposal } from "./types/skillchain/marketplace/tx";
import { MsgDeleteProposal } from "./types/skillchain/marketplace/tx";
import { MsgReleasePaymentResponse } from "./types/skillchain/marketplace/tx";
import { QueryParamsResponse } from "./types/skillchain/marketplace/query";
import { QueryGetProjectResponse } from "./types/skillchain/marketplace/query";
import { MsgDeleteJobPosting } from "./types/skillchain/marketplace/tx";
import { MsgCreateMilestoneResponse } from "./types/skillchain/marketplace/tx";
import { MsgAcceptProposalResponse } from "./types/skillchain/marketplace/tx";
import { QueryAllProjectResponse } from "./types/skillchain/marketplace/query";
import { QueryAllMilestoneRequest } from "./types/skillchain/marketplace/query";
import { MsgCreateProposalResponse } from "./types/skillchain/marketplace/tx";
import { JobPosting } from "./types/skillchain/marketplace/job_posting";
import { MsgDeleteProject } from "./types/skillchain/marketplace/tx";
import { QueryGetProposalResponse } from "./types/skillchain/marketplace/query";
import { QueryAllProposalResponse } from "./types/skillchain/marketplace/query";
import { MsgUpdateProject } from "./types/skillchain/marketplace/tx";
import { Milestone } from "./types/skillchain/marketplace/milestone";
import { MsgCompleteMilestone } from "./types/skillchain/marketplace/tx";
import { MsgDisputeProjectResponse } from "./types/skillchain/marketplace/tx";
import { QueryParamsRequest } from "./types/skillchain/marketplace/query";
import { QueryGetJobPostingRequest } from "./types/skillchain/marketplace/query";
import { MsgUpdateJobPosting } from "./types/skillchain/marketplace/tx";
import { MsgAcceptProposal } from "./types/skillchain/marketplace/tx";

const msgTypes: Array<[string, GeneratedType]>  = [
    ["/skillchain.marketplace.QueryListJobPostingsResponse", QueryListJobPostingsResponse],
    ["/skillchain.marketplace.MsgCreateProject", MsgCreateProject],
    ["/skillchain.marketplace.MsgDeleteProposalResponse", MsgDeleteProposalResponse],
    ["/skillchain.marketplace.MsgUpdateMilestone", MsgUpdateMilestone],
    ["/skillchain.marketplace.MsgDeleteMilestoneResponse", MsgDeleteMilestoneResponse],
    ["/skillchain.marketplace.MsgCompleteMilestoneResponse", MsgCompleteMilestoneResponse],
    ["/skillchain.marketplace.MsgDisputeProject", MsgDisputeProject],
    ["/skillchain.marketplace.MsgCreateProjectResponse", MsgCreateProjectResponse],
    ["/skillchain.marketplace.QueryAllMilestoneResponse", QueryAllMilestoneResponse],
    ["/skillchain.marketplace.MsgUpdateJobPostingResponse", MsgUpdateJobPostingResponse],
    ["/skillchain.marketplace.QueryListJobPostingsRequest", QueryListJobPostingsRequest],
    ["/skillchain.marketplace.QueryListProposalsRequest", QueryListProposalsRequest],
    ["/skillchain.marketplace.MsgCreateJobPostingResponse", MsgCreateJobPostingResponse],
    ["/skillchain.marketplace.MsgDeleteJobPostingResponse", MsgDeleteJobPostingResponse],
    ["/skillchain.marketplace.MsgReleasePayment", MsgReleasePayment],
    ["/skillchain.marketplace.QueryAllJobPostingResponse", QueryAllJobPostingResponse],
    ["/skillchain.marketplace.QueryGetProposalRequest", QueryGetProposalRequest],
    ["/skillchain.marketplace.Project", Project],
    ["/skillchain.marketplace.MsgUpdateMilestoneResponse", MsgUpdateMilestoneResponse],
    ["/skillchain.marketplace.Params", Params],
    ["/skillchain.marketplace.QueryGetJobPostingResponse", QueryGetJobPostingResponse],
    ["/skillchain.marketplace.QueryListProjectsResponse", QueryListProjectsResponse],
    ["/skillchain.marketplace.MsgUpdateParams", MsgUpdateParams],
    ["/skillchain.marketplace.MsgUpdateProjectResponse", MsgUpdateProjectResponse],
    ["/skillchain.marketplace.QueryAllProposalRequest", QueryAllProposalRequest],
    ["/skillchain.marketplace.MsgUpdateParamsResponse", MsgUpdateParamsResponse],
    ["/skillchain.marketplace.MsgCreateJobPosting", MsgCreateJobPosting],
    ["/skillchain.marketplace.MsgDeleteProjectResponse", MsgDeleteProjectResponse],
    ["/skillchain.marketplace.MsgCreateMilestone", MsgCreateMilestone],
    ["/skillchain.marketplace.MsgDeleteMilestone", MsgDeleteMilestone],
    ["/skillchain.marketplace.GenesisState", GenesisState],
    ["/skillchain.marketplace.QueryGetProjectRequest", QueryGetProjectRequest],
    ["/skillchain.marketplace.Proposal", Proposal],
    ["/skillchain.marketplace.MsgUpdateProposal", MsgUpdateProposal],
    ["/skillchain.marketplace.QueryAllJobPostingRequest", QueryAllJobPostingRequest],
    ["/skillchain.marketplace.MsgUpdateProposalResponse", MsgUpdateProposalResponse],
    ["/skillchain.marketplace.QueryAllProjectRequest", QueryAllProjectRequest],
    ["/skillchain.marketplace.QueryGetMilestoneRequest", QueryGetMilestoneRequest],
    ["/skillchain.marketplace.QueryGetMilestoneResponse", QueryGetMilestoneResponse],
    ["/skillchain.marketplace.QueryListProposalsResponse", QueryListProposalsResponse],
    ["/skillchain.marketplace.QueryListProjectsRequest", QueryListProjectsRequest],
    ["/skillchain.marketplace.MsgCreateProposal", MsgCreateProposal],
    ["/skillchain.marketplace.MsgDeleteProposal", MsgDeleteProposal],
    ["/skillchain.marketplace.MsgReleasePaymentResponse", MsgReleasePaymentResponse],
    ["/skillchain.marketplace.QueryParamsResponse", QueryParamsResponse],
    ["/skillchain.marketplace.QueryGetProjectResponse", QueryGetProjectResponse],
    ["/skillchain.marketplace.MsgDeleteJobPosting", MsgDeleteJobPosting],
    ["/skillchain.marketplace.MsgCreateMilestoneResponse", MsgCreateMilestoneResponse],
    ["/skillchain.marketplace.MsgAcceptProposalResponse", MsgAcceptProposalResponse],
    ["/skillchain.marketplace.QueryAllProjectResponse", QueryAllProjectResponse],
    ["/skillchain.marketplace.QueryAllMilestoneRequest", QueryAllMilestoneRequest],
    ["/skillchain.marketplace.MsgCreateProposalResponse", MsgCreateProposalResponse],
    ["/skillchain.marketplace.JobPosting", JobPosting],
    ["/skillchain.marketplace.MsgDeleteProject", MsgDeleteProject],
    ["/skillchain.marketplace.QueryGetProposalResponse", QueryGetProposalResponse],
    ["/skillchain.marketplace.QueryAllProposalResponse", QueryAllProposalResponse],
    ["/skillchain.marketplace.MsgUpdateProject", MsgUpdateProject],
    ["/skillchain.marketplace.Milestone", Milestone],
    ["/skillchain.marketplace.MsgCompleteMilestone", MsgCompleteMilestone],
    ["/skillchain.marketplace.MsgDisputeProjectResponse", MsgDisputeProjectResponse],
    ["/skillchain.marketplace.QueryParamsRequest", QueryParamsRequest],
    ["/skillchain.marketplace.QueryGetJobPostingRequest", QueryGetJobPostingRequest],
    ["/skillchain.marketplace.MsgUpdateJobPosting", MsgUpdateJobPosting],
    ["/skillchain.marketplace.MsgAcceptProposal", MsgAcceptProposal],
    
];

export { msgTypes }