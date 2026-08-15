<script lang="ts">
  import { store } from '#lib/stores/lpa.svelte.js';
  import CheckboxField from '#lib/components/ui/CheckboxField.svelte';
</script>

<section>
  <h2 class="text-xl font-semibold mb-2">Step 8 &mdash; Legal rights (LP1F section 8)</h2>
  <p class="text-sm text-base-content/70 mb-3">
    The donor must read and understand the legal-rights statement printed on the LP1F. By
    confirming below, the donor acknowledges they have read this section.
  </p>
  <div class="bg-base-200 rounded p-3 text-sm text-base-content/80">
    <p>
      As donor, I understand: my attorneys will act in my best interests under the Mental
      Capacity Act 2005; the LPA must be registered with the OPG before it can be used; I can
      cancel the LPA at any time while I have mental capacity; I am giving my attorneys legal
      authority to manage my property and financial affairs.
    </p>
  </div>
  <div class="mt-3">
    <CheckboxField
      label="I have read and understood the legal rights statement."
      bind:checked={store.data.legalRightsAcknowledged}
    />
  </div>
</section>
