// 基本的なユーザー情報の型
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  created: Date;
  updated: Date;
}

// プロジェクトの基本型
export type Project = {
  id: string;
  name: string;
  description: string;
  embedding: number[];
  created: Date;
  updated: Date;
}

// プロジェクトの作成時の型
export type ProjectCreate = {
  id: string;
  name: string;
  description: string;
}

// プロジェクトの読み取り時の型（embeddingが文字列）
export type ProjectRead = {
  id: string;
  name: string;
  description: string;
  embedding: string;
  created: Date;
  updated: Date;
}

// プロジェクトとユーザーの関連付けの型
export type ProjectUser = {
  userId: string;
  projectId: string;
  role: ProjectRole;
}

// プロジェクトの権限を表す型
export enum ProjectRole {
  OWNER = 'OWNER',
  EDITOR = 'EDITOR',
  VIEWER = 'VIEWER'
}

// ファイル関連の型
export type File = {
  key: string;
  data: number[];
  contentType: string;
}

// 類似プロジェクトの型
export type SimilarProject = {
  id: string;
  name: string;
  description: string;
  similarity: number;
}

// フォームデータの型
export type FormData = {
  name: string;
  description: string;
}
