export interface Livestock {
  id: number;
  uniqueIdentifier: string;
  type: string;
  race: string;
  dateOfBirth: Date;
  gender: 'male' | 'female';
  acquisitionDate: Date;
  acquisitionPrice: number;
  currentStatus: 'healthy' | 'sick' | 'sold' | 'deceased';
  investmentId: number;
}

export const LIVESTOCK_TYPES = [
  { value: 'cattle', label: 'Bovin' },
  { value: 'pig', label: 'Porcin' },
  { value: 'poultry', label: 'Volaille' },
  { value: 'sheep', label: 'Ovin' },
  { value: 'goat', label: 'Caprin' },
];

export const LIVESTOCK_STATUS = [
  { value: 'healthy', label: 'En bonne santé' },
  { value: 'sick', label: 'Malade' },
  { value: 'sold', label: 'Vendu' },
  { value: 'deceased', label: 'Décédé' },
];