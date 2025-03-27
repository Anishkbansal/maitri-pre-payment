export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
  date: Date;
  time: string;
}

export interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export interface CountryData {
  name: {
    common: string;
    official: string;
  };
  callingCodes: string[];
  flag: string;
  cca2: string;
}

export interface CountryCode {
  code: string;
  name: string;
  flag: string;
  maxLength: number;
}

export const RESTRICTED_COUNTRIES = [
  'Afghanistan', 'Azerbaijan', 'Armenia', 'Belarus', 'Myanmar', 'China',
  'Congo (DRC)', 'Egypt', 'Eritrea', 'Guinea', 'Guinea-Bissau', 'Haiti', 
  'Iran', 'Iraq', 'Côte d\'Ivoire', 'North Korea', 'Lebanon', 'Liberia', 
  'Libya', 'Russia', 'Sierra Leone', 'Somalia', 'South Sudan', 'Sudan', 
  'Syria', 'Tunisia', 'Ukraine', 'Zimbabwe', 'Pakistan', 'Bangladesh'
];

export interface ShippingRestrictionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const calculatePrice = (qty: number, basePrice = 350) => {
  if (qty === 1) return basePrice;
  if (qty === 2) return basePrice + (basePrice * 0.9);
  return basePrice + (basePrice * 0.9) + (basePrice * (qty - 2));
}; 