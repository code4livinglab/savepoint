import { supabase } from "./supabase";
import { User } from "@prisma/client";

// 現在の認証済みユーザーを取得する関数
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error("Error fetching current user:", error);
    return null;
  }

  return data.user;
};

// ユーザープロファイルを取得する関数
export const getUserProfile = async () => {
  console.log("aaaa");
  const user = await getCurrentUser();
  if (!user) {
    console.warn("No authenticated user found");
    return null;
  }
  console.log(user);
  const { data, error } = await supabase
    .from("User")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }

  return data;
};

// ユーザープロファイルを更新する関数
export const updateUserProfile = async (userData: Partial<User>) => {
  const user = await getCurrentUser();
  if (!user) {
    console.warn("No authenticated user found");
    return null;
  }

  const { data, error } = await supabase
    .from("User")
    .update(userData)
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error updating user profile:", error);
    return null;
  }

  return data;
};
