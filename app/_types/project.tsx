export type Project = {
  id: string;
  name: string;
  description: string;
  embedding: number[];
  cluster: number;
  created: Date;
  updated: Date;
}

export type ProjectCreate = {
  id: string;
  name: string;
  description: string;
}

export type ProjectRead = {
  id: string;
  name: string;
  description: string;
  embedding: string;
  created: Date;
  updated: Date;
}
