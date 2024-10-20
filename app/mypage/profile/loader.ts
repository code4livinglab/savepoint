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
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    return user;
  } catch (error) {
    console.error("Error loading project:", error);
    return [];
  }
};
