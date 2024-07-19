"use server";

import { signIn } from "@/app/auth";
import { AuthError } from "next-auth";

export async function signInAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return {
      success: false,
      error: "メールアドレスとパスワードを入力してください。",
    };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: true, error: null };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            success: false,
            error: "メールアドレスまたはパスワードが正しくありません。",
          };
        default:
          return { success: false, error: "サインインに失敗しました。" };
      }
    }
    return { success: false, error: "予期せぬエラーが発生しました。" };
  }
}
