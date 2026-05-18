import type { CertificateRow } from '$lib/types';
import { SAMPLE_CERTIFICATES } from '$lib/data/sample-certificates';

export async function fetchCertificates(): Promise<CertificateRow[]> {
  try {
    const res = await fetch('/api/certificates');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as CertificateRow[];
  } catch (_) {
    return SAMPLE_CERTIFICATES;
  }
}
