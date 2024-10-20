"use server";

import { prisma } from "@/app/prisma";
import { getSessionUserId } from "./loader"; // セッションユーザーIDを取得する関数をインポート

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
