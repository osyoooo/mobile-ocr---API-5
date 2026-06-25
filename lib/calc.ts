import { BOOKS } from '@/lib/books';
import type { QuantityRow } from '@/types';

export function normalizeQuantity(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return Math.max(0, Math.floor(value));
  }

  if (typeof value === 'string') {
    const digits = value.replace(/[０-９]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0xfee0)).match(/\d+/g)?.join('') ?? '';
    if (!digits) return 0;
    const parsed = Number.parseInt(digits, 10);
    return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
  }

  return 0;
}

export function normalizeRows(rows: Partial<QuantityRow>[]): QuantityRow[] {
  const map = new Map<number, Partial<QuantityRow>>();

  for (const row of rows) {
    const no = normalizeQuantity(row.no);
    if (no >= 1 && no <= 22) {
      map.set(no, row);
    }
  }

  return BOOKS.map((book) => {
    const row = map.get(book.no);
    const quantity = normalizeQuantity(row?.quantity ?? row?.raw ?? 0);
    return {
      no: book.no,
      quantity,
      raw: typeof row?.raw === 'string' ? row.raw : String(quantity || ''),
      needsReview: typeof row?.needsReview === 'boolean' ? row.needsReview : quantity === 0,
      confidence: typeof row?.confidence === 'number' && Number.isFinite(row.confidence) ? Math.max(0, Math.min(1, row.confidence)) : 0,
    };
  });
}

export function calculateTotals(rows: QuantityRow[]) {
  const quantityByNo = new Map(rows.map((row) => [row.no, normalizeQuantity(row.quantity)]));

  const totalQuantity = BOOKS.reduce((sum, book) => sum + (quantityByNo.get(book.no) ?? 0), 0);
  const totalAmount = BOOKS.reduce((sum, book) => sum + book.price * (quantityByNo.get(book.no) ?? 0), 0);

  return { totalQuantity, totalAmount };
}

export function formatYen(value: number): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('ja-JP').format(value);
}
