"use server";

import { prisma } from "@/app/prisma";
import { getSessionUserId } from "./loader";

interface UpdateProjectData {
  name: string;
  description: string;
}

export async function updateProjectAction(
  projectId: string,
  data: UpdateProjectData
) {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return { success: false, error: "ユーザーが認証されていません。" };
    }

    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        name: data.name,
        description: data.description,
      },
    });

    return { success: true, project: updatedProject };
  } catch (error) {
    console.error("プロジェクト更新エラー:", error);
    return {
      success: false,
      error: "プロジェクトの更新中にエラーが発生しました。",
    };
  }
}

export async function deleteProjectAction(projectId: string) {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return { success: false, error: "ユーザーが認証されていません。" };
    }

    // トランザクションを使用して、関連レコードとプロジェクトを安全に削除
    await prisma.$transaction(async (tx) => {
      // まず、ProjectUserテーブルの関連レコードを削除
      await tx.projectUser.deleteMany({
        where: {
          projectId: projectId,
        },
      });

      // 次に、プロジェクト自体を削除
      await tx.project.delete({
        where: {
          id: projectId,
        },
      });
    });

    return { success: true };
  } catch (error) {
    console.error("プロジェクト削除エラー:", error);
    return {
      success: false,
      error: "プロジェクトの削除中にエラーが発生しました。",
    };
  }
}
