'use client';

import { formatNumber, formatYen } from '@/lib/calc';

type ResultSummaryProps = {
  totalQuantity: number;
  totalAmount: number;
};

export function ResultSummary({ totalQuantity, totalAmount }: ResultSummaryProps) {
  return (
    <aside className="total-card" aria-label="合計">
      <div>
        <span className="total-label">合計冊数</span>
        <strong>{formatNumber(totalQuantity)}冊</strong>
      </div>
      <div>
        <span className="total-label">合計金額</span>
        <strong>{formatYen(totalAmount)}</strong>
      </div>
    </aside>
  );
}
