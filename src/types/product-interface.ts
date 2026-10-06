export interface Category {
  _id: string;
  title: string;
  englishTitle: string;
}

export interface IProduct {
  _id: string;
  title: string;
  slug: string;
  description: string;

  brand: string;
  category: Category;

  price: number;
  offPrice: number;
  discount: number;
  countInStock: number;

  imageLink: string;

  tags: string[];

  rating: number;
  numReviews: number;

  likesCount: number;
  isLiked: boolean;
  quantity: number;

  createdAt: string;
  updatedAt: string;

  __v: number;
}
