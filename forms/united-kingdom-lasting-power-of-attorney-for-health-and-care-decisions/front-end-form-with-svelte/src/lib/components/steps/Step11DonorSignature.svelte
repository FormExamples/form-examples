<script lang="ts">
  import FormField from '$lib/components/ui/FormField.svelte';
  import SelectField from '$lib/components/ui/SelectField.svelte';
  import YesNoField from '$lib/components/ui/YesNoField.svelte';
  import { lpaStore } from '$lib/stores/lpa.svelte.js';
  import type { Signature } from '$lib/engine/types.js';

  function changed() {
    lpaStore.recompute();
  }
  function ensure(): Signature {
    let s = lpaStore.application.signatures.find((s) => s.signerRole === 'donor');
    if (!s) {
      s = {
        signerRole: 'donor',
        signerIndex: 0,
        signedAt: '',
        signatureMethod: '',
        witnessName: '',
        witnessAddress: '',
        witnessSignedAt: '',
        witnessIsAttorney: '',
      };
      lpaStore.application.signatures.push(s);
      changed();
    }
    return s;
  }
  const sig = $derived(ensure());
</script>

<div class="space-y-4">
  <p class="text-sm text-slate-700">
    The donor must sign <strong>first</strong>, before the certificate provider and the
    attorneys (R-MCA-ORDER-DONOR-FIRST).
  </p>

  <div class="grid gap-3 sm:grid-cols-2">
    <FormField
      label="Donor signed at"
      type="datetime-local"
      required
      bind:value={sig.signedAt}
      onchange={changed}
    />
    <SelectField
      label="Signature method"
      bind:value={sig.signatureMethod}
      options={[
        { value: 'wet-ink', label: 'Wet-ink' },
        { value: 'electronic', label: 'Electronic' },
        { value: 'mark-with-witness', label: 'Mark with witness (donor unable to sign)' },
      ]}
      onchange={changed}
    />
    <FormField label="Witness full name" bind:value={sig.witnessName} onchange={changed} />
    <FormField
      label="Witness signed at"
      type="datetime-local"
      bind:value={sig.witnessSignedAt}
      onchange={changed}
    />
    <div class="sm:col-span-2">
      <FormField label="Witness address" bind:value={sig.witnessAddress} onchange={changed} />
    </div>
    <YesNoField
      label="Witness is also an attorney in this LPA?"
      bind:value={sig.witnessIsAttorney}
      hint="Must be no (R-MCA-WIT-NOT-ATT)."
      onchange={changed}
    />
  </div>
</div>
