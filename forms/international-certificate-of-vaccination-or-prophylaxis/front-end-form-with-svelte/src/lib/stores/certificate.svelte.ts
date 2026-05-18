import { emptyCertificate, type Certificate } from '$lib/engine/types';

class CertificateStore {
  data = $state<Certificate>(emptyCertificate());

  reset() {
    this.data = emptyCertificate();
  }
}

export const certificateStore = new CertificateStore();
