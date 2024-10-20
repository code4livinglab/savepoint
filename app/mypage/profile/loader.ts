import { prisma } from "@/app/prisma";
import { auth } from "../../auth";

export const getSessionUserId = async () => {
  const session = await auth();
  console.log(session);

  if (!session?.user?.id) return null;

  return session.user.id;
};

export const loader = async () => {
  try {
    const userId = await getSessionUserId();
    console.log(userId);
    // prismaのuserでuserIdが一致するものの情報を取得
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    console.log(user);
    return user;
  } catch (error) {
    console.error("Error loading project:", error);
    return [];
  }
};
