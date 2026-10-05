export interface ICategory {
  _id: string;
  title: string;
  englishTitle: string;
  description: string;

  type: string;
  parentId: string | null;

  icon: {
    sm: string | null;
    lg: string | null;
  };

  createdAt: string;
  updatedAt: string;

  __v: number;
}
