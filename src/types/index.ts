export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user' | 'readonly';
  lastLogin: Date;
  createdAt: Date;
}

export interface Investment {
  id: number;
  category: string;
  typeOfInvestment: string;
  initialAmount: number;
  currentValue: number;
  dateOfInvestment: Date;
  locationId: number;
  userId: number;
  status: string;
}

export interface Location {
  id: number;
  name: string;
  address: string;
  type: string;
  geographicalCoordinates: string;
}