export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  token?: string;
}

export interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  propertyType: 'house' | 'apartment' | 'condo' | 'townhouse' | 'land';
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  amenities: string[];
  images: string[];
  owner: User | string;
  status: 'available' | 'pending' | 'sold';
  aiGenerated?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}
