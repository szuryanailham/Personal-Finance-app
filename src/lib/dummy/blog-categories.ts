// Data dummy untuk pengembangan UI blog.
export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogCategoriesResponse {
  data: BlogCategory[];
  errors: null;
  message: string | null;
  paging: {
    currentPage: number;
    size: number;
    totalItem: number;
    totalPage: number;
  };
}

export const dummyBlogCategoriesResponse: BlogCategoriesResponse = {
  "data": [
    {
      "id": "c3c8d4f4-06f0-4cbc-b52f-3c84c228c749",
      "name": "Personal Finance",
      "slug": "personal-finance",
      "description": "Tips mengelola keuangan pribadi",
      "createdAt": "2026-11-05T03:11:04.471527Z",
      "updatedAt": "2026-11-05T03:11:04.471527Z"
    },
    {
      "id": "705d90e5-451b-467c-9e20-982ef8073471",
      "name": "Budgeting",
      "slug": "budgeting",
      "description": "Panduan menyusun anggaran dan mengatur pengeluaran bulanan",
      "createdAt": "2026-11-05T03:11:04.471527Z",
      "updatedAt": "2026-11-05T03:11:04.471527Z"
    },
    {
      "id": "2daa3da0-f6be-4201-bb54-ae349d736aa0",
      "name": "Tabungan",
      "slug": "tabungan",
      "description": "Tips menabung secara konsisten untuk mencapai tujuan keuangan",
      "createdAt": "2026-11-05T03:11:04.471527Z",
      "updatedAt": "2026-11-05T03:11:04.471527Z"
    },
    {
      "id": "fe71bd6d-759c-480a-9c2b-0fcae70c92c1",
      "name": "Investasi",
      "slug": "investasi",
      "description": "Pengenalan investasi dan panduan memahami risiko untuk pemula",
      "createdAt": "2026-11-05T03:11:04.471527Z",
      "updatedAt": "2026-11-05T03:11:04.471527Z"
    },
    {
      "id": "8f69833d-f4d9-4056-9675-a1efea9e144c",
      "name": "Dana Darurat",
      "slug": "dana-darurat",
      "description": "Panduan menyiapkan dana untuk kebutuhan yang tidak terduga",
      "createdAt": "2026-11-05T03:11:04.471527Z",
      "updatedAt": "2026-11-05T03:11:04.471527Z"
    },
    {
      "id": "0416d9b0-f775-42bb-9db6-efea84223b66",
      "name": "Utang dan Cicilan",
      "slug": "utang-dan-cicilan",
      "description": "Tips mengelola utang dan merencanakan pembayaran cicilan",
      "createdAt": "2026-11-05T03:11:04.471527Z",
      "updatedAt": "2026-11-05T03:11:04.471527Z"
    },
    {
      "id": "d1e42c73-6e87-4607-88a3-deb26eb1d68c",
      "name": "Gaya Hidup Hemat",
      "slug": "gaya-hidup-hemat",
      "description": "Inspirasi menghemat pengeluaran dan membangun kebiasaan belanja bijak",
      "createdAt": "2026-11-05T03:11:04.471527Z",
      "updatedAt": "2026-11-05T03:11:04.471527Z"
    },
    {
      "id": "fb2ae8c1-013b-43b3-9b02-13fbb117cb38",
      "name": "Tips MyArtoku",
      "slug": "tips-myartoku",
      "description": "Panduan menggunakan MyArtoku untuk mencatat dan memantau keuangan",
      "createdAt": "2026-11-05T03:11:04.471527Z",
      "updatedAt": "2026-11-05T03:11:04.471527Z"
    }
  ],
  "errors": null,
  "message": null,
  "paging": {
    "currentPage": 0,
    "size": 20,
    "totalItem": 8,
    "totalPage": 1
  }
};

export const dummyBlogCategories = dummyBlogCategoriesResponse.data;
