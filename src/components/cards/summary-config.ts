import WalletIcon from "@/components/images/icons/Wallet.svg";
import IncomeIcon from "@/components/images/icons/incomeIcon.svg";
import SavingIcon from "@/components/images/icons/SavingIcon.svg";
import ExpenseIcon from "@/components/images/icons/ExpenseIcon.svg";
import type { TransactionStat } from "@/lib/api/transaction";

export interface SummaryItemConfig {
  title: string;
  key: keyof TransactionStat;
  icon: typeof WalletIcon;
}

// Daftar card ringkasan, dipakai di dashboard desktop & carousel mobile
export const SUMMARY_CONFIG: readonly SummaryItemConfig[] = [
  { title: "Total Saldo", key: "totalBalance", icon: WalletIcon },
  { title: "Total Income", key: "totalIncome", icon: IncomeIcon },
  { title: "Total Saving", key: "totalSaving", icon: SavingIcon },
  { title: "Total Expense", key: "totalExpense", icon: ExpenseIcon },
];
