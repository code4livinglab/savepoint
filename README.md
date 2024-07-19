# SAVEPOINT

## Getting Started

1. `.env.sample` をコピーして `.env` を作成し、環境変数を設定する。

```shell
$ cp .env.sample .env
```

2. セットアップを完了し、アプリケーションを立ち上げる。

```shell
$ yarn install
$ npx prisma init  # Prismaのセットアップ
$ yarn build
$ yarn start
```

3. [http://localhost:3000](http://localhost:3000) にアクセスする。


## Development

### フレームワーク

version 14以降のNext.jsで、App Routerを利用する。ディレクトリはコロケーションを意識して構成している。ルーティングは各ディレクトリ配下の `page.tsx` 、ロジックはサーバーサイドの処理として `server.ts` に記載し、ビューは `_components` 配下のコンポーネントに記載する。ロジックとビューはいずれもページから呼び出す。ページはReact Server Componentとし、 `_components` 配下もできるだけReact Server Componentにする。

- React Server Component（RSC）を理解したい場合は[この記事](https://zenn.dev/yuu104/articles/react-server-component)が分かりやすい。
- Next.jsのServer Side Rendering（SSR）を理解したい場合は[こちら](https://nextjs.org/docs/app/building-your-application/rendering/server-components)、Client Side Rendering（CSR）を理解したい場合は[こちら](https://nextjs.org/docs/app/building-your-application/rendering/client-components)
- Server Actionsを理解したい場合は[こちら](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)。

### 認証

version 5以降のAuth.jsを利用する。現状は `middleware.ts` でページの出し分けをしているのみ。

### データベース

Supabaseを利用している。ORMとしてPrismaを利用している。

## References

- [Next.js](https://nextjs.org/docs)
- [Three.js](https://threejs.org/docs/#manual/en/introduction/Installation)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)
- [Auth.js](https://authjs.dev/getting-started)
- [Prisma](https://www.prisma.io/docs/getting-started)
- [Supabase](https://supabase.com/docs/guides/database/overview)
