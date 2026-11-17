export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string | null;
  email: string;
  transactionCount: number;
  activeTransactionCount: number;
}
