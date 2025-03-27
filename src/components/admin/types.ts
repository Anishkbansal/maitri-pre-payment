export enum GiftCardStatus {
  ACTIVE = 'active',        // Gift card is active and can be used
  EXPIRED = 'expired',      // Gift card is expired (past expiration date)
  EXHAUSTED = 'exhausted',  // Gift card has been used completely (balance = 0)
  CLOSED = 'closed'         // Gift card has been manually closed by admin
}

export interface GiftCardHistoryEntry {
  date: string;
  action: 'created' | 'status_update' | 'amount_update';
  amount?: number;
  balance: number;
  previousStatus?: GiftCardStatus;
  newStatus?: GiftCardStatus;
  previousAmount?: number;
  newAmount?: number;
  note: string;
}

export interface GiftCard {
  id: string;
  code: string;
  amount: number;
  balance: number;
  buyerName: string;
  buyerEmail: string;
  recipientName: string;
  recipientEmail: string;
  message?: string;
  createdAt: string;
  expiresAt: string;
  status: GiftCardStatus;
  lastUsed?: string;
}

export interface GiftCardUpdateFormData {
  amount?: number;
  note: string;
}

export interface GiftCardFilterOptions {
  status?: GiftCardStatus | 'all';
  dateRange?: 'all' | 'last30days' | 'last6months' | 'last12months';
  searchTerm?: string;
}

export interface GiftCardTableProps {
  giftCards: GiftCard[];
  loading: boolean;
  onViewDetails: (giftCard: GiftCard) => void;
  onUpdateStatus: (id: string, status: GiftCardStatus) => void;
}

export interface GiftCardsApiResponse {
  success: boolean;
  giftCards: GiftCard[];
  message?: string;
}

export interface GiftCardApiResponse {
  success: boolean;
  giftCard: GiftCard;
  message?: string;
}

export interface GiftCardUpdateApiResponse {
  success: boolean;
  giftCard: GiftCard;
  message: string;
} 