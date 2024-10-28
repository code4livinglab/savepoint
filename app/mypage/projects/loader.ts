import { prisma } from "@/app/prisma";
import { auth } from "../../auth";

export const getSessionUserId = async () => {
  const session = await auth();

  if (!session?.user?.id) return null;

  return session.user.id;
};

export const loader = async () => {
  try {
    const userId = await getSessionUserId();
    // ユーザーと紐づくプロジェクトIDを取得
    const projectUsers = await prisma.projectUser.findMany({
      where: {
        userId: userId as string,
      },
    });

    // プロジェクトIDからプロジェクト一覧を取得
    const userProjects = await Promise.all(
      projectUsers.map((projectUser) => {
        return prisma.project.findUnique({
          where: {
            id: projectUser.projectId,
          },
        });
      })
    );

    return userProjects;
  } catch (error) {
    console.error("Error loading project:", error);
    return [];
  }
};
