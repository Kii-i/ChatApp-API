import z from "zod";
import { AcceptRejectSchema } from "../zodSchema/friend.schema";
type UserInfo = {
  id: string;
  username: string;
  avatarUrl: string | null;
};
type requestData = {
  userId: string;
  friendId: string;
};
export type SendFriendReqType = (requestData: requestData) => Promise<void>;

type AcceptRejectData = z.infer<typeof AcceptRejectSchema>;
export type AcceptRejectType = (
  requestData: {
    userId: string;
    requestId: string;
  },
  action: AcceptRejectData
) => Promise<{ message: string }>;

export type ListFriendsType = (
  userId: string
) => Promise<{ friend: UserInfo }[]>;

export type ListRequestsType = (userId: string) => Promise<{
  sentRequest: {
    friend: UserInfo;
  }[];
  pendingRequest: {
    user: UserInfo;
  }[];
}>;
export type RemoveFriendType = (requestData: requestData) => Promise<void>;
