export type Project = {
  id: string;
  name: string;
  description: string;
  embedding: number[];
  teamId: string;
  created: Date;
  updated: Date;
}

export type ProjectCreate = {
  id: string;
  name: string;
  description: string;
  teamId: string;
}

export type ProjectRead = {
  id: string;
  name: string;
  description: string;
  embedding: string;
  teamId: string;
  created: Date;
  updated: Date;
}
