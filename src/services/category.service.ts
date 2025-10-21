import { prisma } from "..";
import BadRequestError from "../errors/badRequest.error";
import {
  CreateCategoryType,
  DeleteCategoryType,
  GetAllCategoryType,
  UpdateCategoryOrderType,
  UpdateCategoryType,
} from "../types/category.types";
import checkCategory from "../utils/checkCategory";
import checkOwner from "../utils/checkOwner";
import checkServer from "../utils/checkServer";

export const createCategoryHandler: CreateCategoryType = async (
  requestData,
  title
) => {
  const { serverId, userId } = requestData;
  await checkServer(serverId);
  await checkOwner(userId, serverId);
  const lastCategory = await prisma.category.findFirst({
    where: {
      serverId,
    },
    orderBy: {
      order: "desc",
    },
  });
  const newCategoryOrderNum = lastCategory ? lastCategory.order + 1 : 1;
  return await prisma.category.create({
    data: {
      title,
      order: newCategoryOrderNum,
      serverId,
    },
  });
};
export const updateCategoryHandler: UpdateCategoryType = async (
  requestData,
  title
) => {
  const { serverId, categoryId, userId } = requestData;
  await checkServer(serverId);
  await checkOwner(userId, serverId);
  await checkCategory(categoryId, serverId);
  return await prisma.category.update({
    where: {
      id: categoryId,
    },
    data: {
      title,
    },
  });
};
export const deleteCategoryHandler: DeleteCategoryType = async (
  requestData
) => {
  const { serverId, categoryId, userId } = requestData;
  await checkServer(serverId);
  await checkOwner(userId, serverId);
  await checkCategory(categoryId, serverId);
  await prisma.category.delete({
    where: {
      id: categoryId,
    },
  });
};
export const getAllCategoryHandler: GetAllCategoryType = async (serverId) => {
  await checkServer(serverId);
  return await prisma.category.findMany({
    where: {
      serverId,
    },
    orderBy: {
      order: "asc",
    },
  });
};
export const updateCategoryOrderHandler: UpdateCategoryOrderType = async (
  requestData,
  data
) => {
  const { serverId, userId } = requestData;
  const { movedCategoryId, newOrder } = data;
  await checkServer(serverId);
  await checkOwner(userId, serverId);
  const categories = await prisma.category.findMany({
    where: {
      serverId,
    },
  });
  const movedCategory = categories.find(
    (category) => category.id === movedCategoryId
  );
  if (!movedCategory) throw new BadRequestError("Can't find moved category");
  const oldOrder = movedCategory.order;
  const newCategories = categories.map((category) => {
    if (category.id === movedCategoryId) {
      return { ...category, order: newOrder };
    }

    if (newOrder < oldOrder) {
      if (category.order >= newOrder && category.order < oldOrder) {
        return { ...category, order: category.order + 1 };
      }
    }

    if (newOrder > oldOrder) {
      if (newOrder >= category.order && category.order > oldOrder) {
        return { ...category, order: category.order - 1 };
      }
    }
    return category;
  });
  const updatedCategory = newCategories
    .filter(
      (category) =>
        category.order !==
        categories.find((originalC) => category.id === originalC.id)?.order
    )
    .map((updatedC) =>
      prisma.category.update({
        where: {
          id: updatedC.id,
        },
        data: {
          order: updatedC.order,
        },
      })
    );
  await prisma.$transaction(updatedCategory);

  return await prisma.category.findMany({
    where: {
      serverId,
    },
    orderBy: {
      order: "asc",
    },
  });
};
