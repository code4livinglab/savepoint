import { auth } from "@/app/auth";

export default auth((request) => {
  // 認証が不要なページ
  const authUnnecessaries = ["/users/sign-in", "/users/sign-up"];

  const pathname = request.nextUrl.pathname;
  const requiresAuth = !authUnnecessaries.includes(pathname); // 認証が必要なページ
  const hasAuth = request.auth; // 認証されている

  // 認証が必要な場合、サインインページにリダイレクトする
  if (requiresAuth && !hasAuth) {
    const newUrl = new URL("/users/sign-in", request.nextUrl.origin);
    return Response.redirect(newUrl);
  }

  // 認証が不要な場合、ホームページにリダイレクトする
  if (!requiresAuth && hasAuth) {
    const newUrl = new URL("/", request.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
