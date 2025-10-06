import { Category } from "@prisma/client";
import { prisma } from "..";
import BadRequestError from "../errors/badRequest.error";

const checkCategory = async (
  categoryId: string,
  serverId: string
): Promise<Category> => {
  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
      serverId,
    },
  });
  if (!category)
    throw new BadRequestError(
      `Couldn't find category with the id: ${categoryId} in server with the id: ${serverId}`
    );
  return category;
};
export default checkCategory;
