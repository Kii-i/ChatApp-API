import { User } from "@prisma/client";
import { prisma } from "..";
import BadRequestError from "../errors/badRequest.error";

type checkUserType = (checkField: {
  id?: string;
  email?: string;
}) => Promise<User>;
const checkUser: checkUserType = async (checkField) => {
  const { id, email } = checkField;
  if (!id && !email)
    throw new BadRequestError("To check User either id or email is required");
  const user = await prisma.user.findFirst({
    where: {
      ...(id && { id }), // ...(id && { id }) => ...(id && {id : 123}) => id: 123
      ...(email && { email }),
    },
  });

  if (!user) {
    const field = Object.entries(checkField)
      .filter(([key, value]) => value !== undefined)
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ");
    throw new BadRequestError(`No user associated with ${field}`);
  }
  return user;
};
export default checkUser;
