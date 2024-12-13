"use server";

import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { signIn } from "@/app/auth";

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
  } catch (error) {
    console.error({ error })

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

  redirect("/projects");
  return { success: true, error: null };
}
