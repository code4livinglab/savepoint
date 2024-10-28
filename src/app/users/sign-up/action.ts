"use server";

import { hash } from "bcryptjs";
import { signIn } from "@/auth";
import { prisma } from '@/src/prisma'

export async function signUpAction(prevState: any, formData: FormData) {
  // フォームの取得
  const id = formData.get("id")?.toString() ?? "";
  const username = formData.get("username")?.toString() ?? "";
  const email = formData.get("email")?.toString() ?? "";
  const password = formData.get("password")?.toString() ?? "";
  const password2 = formData.get("password2")?.toString() ?? "";

  // バリデーション
  if (!id || !username || !email || !password || !password2) {
    return { success: false, error: "全ての項目を入力してください。" };
  }

  if (password !== password2) {
    return { success: false, error: "パスワードが一致しません。" };
  }

  if (password.length < 8) {
    return {
      success: false,
      error: "パスワードは8文字以上で設定してください。",
    };
  }

  try {
    // 既存のユーザーチェック
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ id }, { email }],
      },
    });

    if (existingUser) {
      if (existingUser.id === id) {
        return {
          success: false,
          error: "このユーザーIDは既に使用されています。",
        };
      }
      if (existingUser.email === email) {
        return {
          success: false,
          error: "このメールアドレスは既に登録されています。",
        };
      }
    }

    // パスワードのハッシュ化
    const hashedPassword = await hash(password, 10);

    // ユーザー登録
    const user = await prisma.user.create({
      data: { id, name: username, email, password: hashedPassword },
    });

    // サインイン
    await signIn("credentials", {
      email: user.email,
      password: password, // ハッシュ化前のパスワードを使用
      redirect: false,
    });

    return { success: true, error: null };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "予期せぬエラーが発生しました。",
    };
  }
}
