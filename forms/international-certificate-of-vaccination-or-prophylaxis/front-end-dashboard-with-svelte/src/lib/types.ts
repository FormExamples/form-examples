export interface CertificateRow {
  id: string;
  serial: string;
  surname: string;
  givenNames: string;
  centre: string;
  issuingCountryAsIso31661Alpha3: string;
  primaryDisease: string;
  entriesCount: number;
  vaccinationDate: string;
  validityStatus: 'valid' | 'waiver' | 'expired' | 'draft';
  status: 'draft' | 'issued' | 'reissued' | 'revoked';
  issuedAt: string;
  entries: EntryRow[];
}

export interface EntryRow {
  disease: string;
  vaccinationDate: string;
  manufacturer: string;
  batchNumber: string;
  validityStartsOn: string;
  validityEndsOn: string | null;
  validityIsLifetime: 'yes' | 'no' | '';
}
