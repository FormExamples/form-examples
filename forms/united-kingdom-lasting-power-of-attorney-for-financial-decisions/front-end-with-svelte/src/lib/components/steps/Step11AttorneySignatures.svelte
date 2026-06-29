<script lang="ts">
  import { store } from '$lib/stores/lpa.svelte.js';
  import { createEmptyPerson } from '$lib/factory.js';
  import type { Signature, SignatureRole } from '$lib/types.js';
  import Field from '$lib/components/ui/Field.svelte';
  import TextInput from '$lib/components/ui/TextInput.svelte';
  import DateInput from '$lib/components/ui/DateInput.svelte';
  import SignaturePad from '$lib/components/ui/SignaturePad.svelte';
  import AddressInput from '$lib/components/ui/AddressInput.svelte';

  // Each attorney or replacement attorney must have a corresponding section-11
  // signature record with a witness. We make sure one exists for every listed
  // person on render; surplus records are not removed (the underlying person
  // may have been replaced).
  function ensureAttorneySignature(
    personId: string,
    role: SignatureRole,
  ): Signature {
    let sig = store.data.signatures.find(
      (s) => s.lp1fSection === 11 && s.signatoryPersonId === personId,
    );
    if (!sig) {
      sig = {
        id: `sig-${role}-${personId}`,
        signatoryPersonId: personId,
        role,
        lp1fSection: 11,
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
</script>

<section>
  <h2 class="text-xl font-semibold mb-2">Step 11 &mdash; Attorney signatures (LP1F section 11)</h2>
  <p class="text-sm text-base-content/70 mb-3">
    Each attorney and each replacement attorney signs in turn, with their own witness. The
    witness must not be the donor. Attorneys sign after the certificate provider.
  </p>

  {#if store.data.attorneys.length === 0 && store.data.replacementAttorneys.length === 0}
    <p class="text-sm text-error">
      No attorneys have been added in section 2 or section 4. Return to step 2 to add at
      least one attorney before collecting signatures.
    </p>
  {/if}

  <div class="space-y-6">
    {#each store.data.attorneys as a (a.person.id)}
      {@const sig = ensureAttorneySignature(a.person.id, 'attorney')}
      <div class="border border-base-300 rounded p-3 bg-base-200 space-y-3">
        <h3 class="text-sm font-semibold text-base-content/80">
          Attorney #{a.ordinal} &mdash; {a.person.firstNames} {a.person.lastName}
        </h3>
        <SignaturePad bind:value={sig.signatureBlobPath} label="Attorney signature" />
        <Field label="Date signed">
          <DateInput bind:value={sig.signedOn} />
        </Field>
        <h4 class="text-sm font-semibold text-base-content/80 mt-2">Witness</h4>
        {#if sig.witness}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Witness first names">
              <TextInput bind:value={sig.witness.person.firstNames} />
            </Field>
            <Field label="Witness last name">
              <TextInput bind:value={sig.witness.person.lastName} />
            </Field>
          </div>
          <AddressInput bind:address={sig.witness.person.address} />
          <SignaturePad
            bind:value={sig.witness.witnessSignatureBlobPath}
            label="Witness signature"
          />
          <Field label="Witness date">
            <DateInput bind:value={sig.witness.witnessedOn} />
          </Field>
        {/if}
      </div>
    {/each}

    {#each store.data.replacementAttorneys as r (r.person.id)}
      {@const sig = ensureAttorneySignature(r.person.id, 'replacement_attorney')}
      <div class="border border-base-300 rounded p-3 bg-base-200 space-y-3">
        <h3 class="text-sm font-semibold text-base-content/80">
          Replacement #{r.ordinal} &mdash; {r.person.firstNames} {r.person.lastName}
        </h3>
        <SignaturePad bind:value={sig.signatureBlobPath} label="Replacement attorney signature" />
        <Field label="Date signed">
          <DateInput bind:value={sig.signedOn} />
        </Field>
        <h4 class="text-sm font-semibold text-base-content/80 mt-2">Witness</h4>
        {#if sig.witness}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Witness first names">
              <TextInput bind:value={sig.witness.person.firstNames} />
            </Field>
            <Field label="Witness last name">
              <TextInput bind:value={sig.witness.person.lastName} />
            </Field>
          </div>
          <AddressInput bind:address={sig.witness.person.address} />
          <SignaturePad
            bind:value={sig.witness.witnessSignatureBlobPath}
            label="Witness signature"
          />
          <Field label="Witness date">
            <DateInput bind:value={sig.witness.witnessedOn} />
          </Field>
        {/if}
      </div>
    {/each}
  </div>
</section>
