// import { NextFunction, Request, Response } from "express";
// import { prisma } from "..";
// import { UserRole } from "@prisma/client";
// import checkUser from "../utils/checkUser";
// import BadRequestError from "../errors/badRequest.error";
// import AuthError from "../errors/AuthError.error";

// type AllowedRoleType = (
//   serverRoles: string[],
//   globalRoles: UserRole[]
// ) => (req: Request, res: Response, next: NextFunction) => Promise<void>;

// const AllowedRole: AllowedRoleType = (serverRoles, globalRoles) => {
//   return async (req, res, next) => {
//     try {
//       const serverId = req.params.serverId;
//       const userId = req.user.id;
//       const user = await checkUser({ id: userId });
//       if (globalRoles.length && globalRoles.includes(user.role)) return next();
//       const userRoleInServer = await prisma.userRolesOnServer.findFirst({
//         where: {
//           userId,
//           serverId,
//         },
//         include: {
//           serverRole: true,
//         },
//       });
//       if (
//         !userRoleInServer ||
//         !serverRoles.includes(userRoleInServer.serverRole.title)
//       )
//         throw new AuthError("You are not allowed to access this route");
//       next();
//     } catch (error) {
//       next(error);
//     }
//   };
// };
// export default AllowedRole;
