"use server";

import { prisma } from "@/app/prisma";
import { getSessionUserId } from "./loader"; // セッションユーザーIDを取得する関数をインポート
import { signOut } from "../../auth";

export async function updateUserAction(formData: FormData) {
  try {
    const userId = await getSessionUserId();
    if (!userId) {
      return { success: false, error: "ユーザーが認証されていません。" };
    }

    const name = formData.get("name")?.toString();
    const email = formData.get("email")?.toString();

    // 簡単なバリデーション
    if (!name || !email) {
      return { success: false, error: "名前とメールアドレスは必須です。" };
    }

    // ユーザー情報の更新
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, email },
    });

    return { success: true, user: updatedUser };
  } catch (error: any) {
    console.error("ユーザー更新エラー:", error);
    return {
      success: false,
      error: "ユーザー情報の更新中にエラーが発生しました。",
    };
  }
}

export async function deleteUserAction(userId: string) {
  try {
    const sessionUserId = await getSessionUserId();
    if (!sessionUserId || sessionUserId !== userId) {
      return { success: false, error: "ユーザーが認証されていません。" };
    }

    // projectUserテーブルからuserIdが一致するレコードを削除
    const projectUserRecords = await prisma.projectUser.findMany({
      where: { userId },
    });

    const projectIds = projectUserRecords.map((record) => record.projectId);

    // projectUserテーブルのレコードを削除
    await prisma.projectUser.deleteMany({ where: { userId } });

    // projectテーブルで対応するプロジェクトを削除
    await prisma.project.deleteMany({ where: { id: { in: projectIds } } });

    // ユーザー情報を削除
    await prisma.user.delete({ where: { id: userId } });

    return { success: true };
  } catch (error: any) {
    console.error("ユーザー削除エラー:", error);
    return {
      success: false,
      error: "ユーザー削除中にエラーが発生しました。",
    };
  }
}

export const signOutAction = async () => {
  await signOut();
};
