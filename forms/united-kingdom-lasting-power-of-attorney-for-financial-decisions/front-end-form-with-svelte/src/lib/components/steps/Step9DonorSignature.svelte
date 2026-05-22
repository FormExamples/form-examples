<script lang="ts">
  import { store } from '$lib/stores/lpa.svelte.js';
  import { createEmptyPerson } from '$lib/factory.js';
  import Field from '$lib/components/ui/Field.svelte';
  import TextInput from '$lib/components/ui/TextInput.svelte';
  import DateInput from '$lib/components/ui/DateInput.svelte';
  import SignaturePad from '$lib/components/ui/SignaturePad.svelte';
  import AddressInput from '$lib/components/ui/AddressInput.svelte';

  // Ensure exactly one signature exists for the donor at LP1F section 9.
  function ensureDonorSignature() {
    let sig = store.data.signatures.find(
      (s) => s.role === 'donor' && s.lp1fSection === 9,
    );
    if (!sig) {
      sig = {
        id: `sig-donor-${store.data.donor.id}`,
        signatoryPersonId: store.data.donor.id,
        role: 'donor',
        lp1fSection: 9,
        signatureBlobPath: '',
        signedOn: '',
        signedOnBehalfFullName: '',
        isWitnessed: true,
        witness: {
          person: createEmptyPerson(),
          witnessSignatureBlobPath: '',
          witnessedOn: '',
        },
      };
      store.data.signatures.push(sig);
    }
    return sig;
  }

  const donorSig = $derived(ensureDonorSignature());
</script>

<section>
  <h2 class="text-xl font-semibold mb-2">Step 9 &mdash; Donor signature (LP1F section 9)</h2>
  <p class="text-sm text-slate-600 mb-3">
    The donor signs in the presence of an adult witness. The witness must not be the donor or
    one of the attorneys. If the donor cannot physically sign, attach LPC continuation sheet 3.
  </p>
  <div class="space-y-4">
    <SignaturePad bind:value={donorSig.signatureBlobPath} label="Donor signature" />
    <Field label="Date signed">
      <DateInput bind:value={donorSig.signedOn} />
    </Field>
    <Field label="Signed on behalf (full name, optional)" hint="Only complete if the donor cannot sign and another adult signs at the donor's direction; requires LPC sheet 3.">
      <TextInput bind:value={donorSig.signedOnBehalfFullName} />
    </Field>

    <h3 class="text-sm font-semibold mt-3 text-slate-700">Witness</h3>
    {#if donorSig.witness}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field label="Witness first names">
          <TextInput bind:value={donorSig.witness.person.firstNames} />
        </Field>
        <Field label="Witness last name">
          <TextInput bind:value={donorSig.witness.person.lastName} />
        </Field>
      </div>
      <AddressInput bind:address={donorSig.witness.person.address} />
      <SignaturePad bind:value={donorSig.witness.witnessSignatureBlobPath} label="Witness signature" />
      <Field label="Witness date">
        <DateInput bind:value={donorSig.witness.witnessedOn} />
      </Field>
    {/if}
  </div>
</section>
