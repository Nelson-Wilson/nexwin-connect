export interface Product {
  id: string;
  name: string;
  category: 'vestuario' | 'calcados' | 'sorvete';
  subcategory: string;
  price: number;
  originalPrice?: number; // for discounts
  description: string;
  status: 'disponivel' | 'esgotado';
  images: string[]; // URLs or Base64
  featured?: boolean;
  bestseller?: boolean;
  news?: boolean;
  nutritionalInfo?: {
    calories?: string;
    vitaminC?: string;
    calcium?: string;
    fiber?: string;
  };
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  comment: string;
  rating: number;
  photo?: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link?: string;
  active: boolean;
}

export interface Promotion {
  id: string;
  title: string;
  discount: string;
  description: string;
  bannerImage: string;
  code?: string;
}

export interface ContactForm {
  name: string;
  email: string;
  message: string;
  phone?: string;
}
