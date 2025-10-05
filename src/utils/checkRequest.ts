import { prisma } from "..";
import BadRequestError from "../errors/badRequest.error";

const checkRequest = async (requestId: string) => {
  const request = await prisma.friend.findUnique({
    where: {
      id: requestId,
    },
  });
  if (!request)
    throw new BadRequestError(`No request found with the id: ${requestId}`);
  return request;
};

export default checkRequest;
