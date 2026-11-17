export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogCategoryInput {
  name: string;
  slug: string;
  description: string;
}

export interface BlogUser {
  id: string;
  displayName: string;
  email: string;
  photoProfile?: string | null;
  description?: string | null;
  socialMedia?: Record<string, string> | null;
  status: string;
  roles: string[];
}

export interface BlogSession {
  token: string;
  tokenType: string;
  expiresAt: string;
  user: BlogUser;
}
