"use server";

import { prisma } from "@/app/prisma";
import { getSessionUserId } from "./loader";

export async function updateProjectAction(projectId, data) {
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
