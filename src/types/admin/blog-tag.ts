export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  description: null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogTagInput {
  name: string;
  slug: string;
}
