<script lang="ts">
  import FormField from '#lib/components/ui/FormField.svelte';
  import SelectField from '#lib/components/ui/SelectField.svelte';
  import YesNoField from '#lib/components/ui/YesNoField.svelte';
  import { lpaStore } from '#lib/stores/lpa.svelte.js';
  import type { Signature } from '#lib/engine/types.js';

  function changed() {
    lpaStore.recompute();
  }

  function ensureCp(): Signature {
    let s = lpaStore.application.signatures.find((s) => s.signerRole === 'certificate-provider');
    if (!s) {
      s = {
        signerRole: 'certificate-provider',
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

  function ensureAtt(idx: number): Signature {
    let s = lpaStore.application.signatures.find(
      (s) => s.signerRole === 'attorney' && s.signerIndex === idx,
    );
    if (!s) {
      s = {
        signerRole: 'attorney',
        signerIndex: idx,
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

  const cpSig = $derived(ensureCp());
  const attorneys = $derived(lpaStore.application.attorneys);

  const METHODS = [
    { value: 'wet-ink', label: 'Wet-ink' },
    { value: 'electronic', label: 'Electronic' },
    { value: 'mark-with-witness', label: 'Mark with witness' },
  ];
</script>

<div class="space-y-6">
  <p class="text-sm text-base-content/80">
    Order: donor → certificate provider → attorneys. Each signature requires an independent
    witness who is not an attorney.
  </p>

  <section class="rounded-lg border border-base-300 bg-base-200 p-4">
    <h3 class="mb-3 font-medium text-base-content">Certificate provider signature</h3>
    <div class="grid gap-3 sm:grid-cols-2">
      <FormField label="Signed at" type="datetime-local" bind:value={cpSig.signedAt} onchange={changed} />
      <SelectField label="Method" bind:value={cpSig.signatureMethod} options={METHODS} onchange={changed} />
      <FormField label="Witness name" bind:value={cpSig.witnessName} onchange={changed} />
      <FormField label="Witness signed at" type="datetime-local" bind:value={cpSig.witnessSignedAt} onchange={changed} />
      <div class="sm:col-span-2">
        <FormField label="Witness address" bind:value={cpSig.witnessAddress} onchange={changed} />
      </div>
      <YesNoField label="Witness is an attorney?" bind:value={cpSig.witnessIsAttorney} onchange={changed} />
    </div>
  </section>

  {#each attorneys as att, i (i)}
    {@const sig = ensureAtt(i)}
    <section class="rounded-lg border border-base-300 bg-base-200 p-4">
      <h3 class="mb-3 font-medium text-base-content">
        Attorney #{i + 1} — {att.givenNames} {att.familyName}
      </h3>
      <div class="grid gap-3 sm:grid-cols-2">
        <FormField label="Signed at" type="datetime-local" bind:value={sig.signedAt} onchange={changed} />
        <SelectField label="Method" bind:value={sig.signatureMethod} options={METHODS} onchange={changed} />
        <FormField label="Witness name" bind:value={sig.witnessName} onchange={changed} />
        <FormField label="Witness signed at" type="datetime-local" bind:value={sig.witnessSignedAt} onchange={changed} />
        <div class="sm:col-span-2">
          <FormField label="Witness address" bind:value={sig.witnessAddress} onchange={changed} />
        </div>
        <YesNoField label="Witness is an attorney?" bind:value={sig.witnessIsAttorney} onchange={changed} />
      </div>
    </section>
  {/each}
</div>
