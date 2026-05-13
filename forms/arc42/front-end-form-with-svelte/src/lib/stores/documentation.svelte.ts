import { createEmptyDocumentation } from '$lib/grading/factory.js';
import type { Arc42Documentation } from '$lib/grading/types.js';

class DocumentationStore {
  data: Arc42Documentation = $state(createEmptyDocumentation());

  reset() {
    this.data = createEmptyDocumentation();
  }
}

export const store = new DocumentationStore();
