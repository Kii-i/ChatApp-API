import { User } from "@prisma/client";

type SafeUser = Omit<User, "password">;
export default SafeUser;
