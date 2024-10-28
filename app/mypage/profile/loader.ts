import { prisma } from "@/app/prisma";
import { auth } from "../../auth";

export const getSessionUserId = async () => {
  const session = await auth();

  if (!session?.user?.id) return null;

  return session.user.id;
};

export const userInfoLoader = async () => {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return null; // または適切なデフォルト値を返す
    }

    const user = await prisma.user.findUnique({
      // @ts-ignore
      where: { id: userId },
    });
    return user;
  } catch (error) {
    console.error("Error loading project:", error);
    return null; // エラー時のデフォルト値を返す
  }
};
