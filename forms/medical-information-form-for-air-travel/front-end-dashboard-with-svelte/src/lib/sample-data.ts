// Sample MEDIF dashboard rows used when no backend is reachable.

export interface MedifRow {
  id: string;
  passenger: string;
  airline: string;
  flight: string;
  outboundDate: string;
  band: 'fit' | 'fit-with-conditions' | 'requires-review' | 'unfit-to-fly';
  flagCount: number;
  status: 'draft' | 'submitted' | 'reviewed' | 'cleared' | 'declined' | 'urgent';
}

export const SAMPLE_MEDIFS: MedifRow[] = [
  {
    id: 'MD001',
    passenger: 'Alice Smith',
    airline: 'British Airways',
    flight: 'BA117',
    outboundDate: '2026-06-04',
    band: 'fit',
    flagCount: 0,
    status: 'cleared',
  },
  {
    id: 'MD002',
    passenger: 'Bob Jones',
    airline: 'Emirates',
    flight: 'EK002',
    outboundDate: '2026-06-05',
    band: 'fit-with-conditions',
    flagCount: 2,
    status: 'reviewed',
  },
  {
    id: 'MD003',
    passenger: 'Carol Lee',
    airline: 'Qatar Airways',
    flight: 'QR010',
    outboundDate: '2026-06-06',
    band: 'requires-review',
    flagCount: 4,
    status: 'submitted',
  },
  {
    id: 'MD004',
    passenger: 'David Brown',
    airline: 'LOT Polish Airlines',
    flight: 'LO281',
    outboundDate: '2026-06-08',
    band: 'unfit-to-fly',
    flagCount: 6,
    status: 'declined',
  },
  {
    id: 'MD005',
    passenger: 'Eve Patel',
    airline: 'KLM',
    flight: 'KL1009',
    outboundDate: '2026-06-09',
    band: 'requires-review',
    flagCount: 3,
    status: 'urgent',
  },
  {
    id: 'MD006',
    passenger: 'Faisal Khan',
    airline: 'Air India',
    flight: 'AI161',
    outboundDate: '2026-06-10',
    band: 'fit-with-conditions',
    flagCount: 1,
    status: 'cleared',
  },
  {
    id: 'MD007',
    passenger: 'Grace Murphy',
    airline: 'ANA',
    flight: 'NH101',
    outboundDate: '2026-06-12',
    band: 'fit',
    flagCount: 0,
    status: 'submitted',
  },
  {
    id: 'MD008',
    passenger: 'Hiro Tanaka',
    airline: 'Starlux',
    flight: 'JX001',
    outboundDate: '2026-06-13',
    band: 'fit-with-conditions',
    flagCount: 1,
    status: 'reviewed',
  },
];
