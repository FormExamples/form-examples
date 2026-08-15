<script lang="ts">
  import { store } from '#lib/stores/lpa.svelte.js';
  import Field from '#lib/components/ui/Field.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';
  import SignaturePad from '#lib/components/ui/SignaturePad.svelte';

  const app = $derived(store.data.registrationApplication);

  // Build the list of applicant signatories from the registration choice
  // made in step 12.
  function applicantsToSign(): { personId: string; label: string }[] {
    if (app.applicantKind === 'donor') {
      return [
        {
          personId: store.data.donor.id,
          label: `Donor — ${store.data.donor.firstNames} ${store.data.donor.lastName}`.trim(),
        },
      ];
    }
    if (app.applicantKind === 'attorneys') {
      // Anyone who has an applicant placeholder signature from step 12.
      const ids = new Set(
        store.data.signatures
          .filter((s) => s.role === 'applicant' && s.lp1fSection === 15)
          .map((s) => s.signatoryPersonId),
      );
      return store.data.attorneys
        .filter((a) => ids.has(a.person.id))
        .map((a) => ({
          personId: a.person.id,
          label: `Attorney #${a.ordinal} — ${a.person.firstNames} ${a.person.lastName}`.trim(),
        }));
    }
    return [];
  }

  const applicants = $derived(applicantsToSign());

  // Ensure a section-15 applicant signature exists for the donor, when
  // applicable.
  $effect(() => {
    if (app.applicantKind === 'donor') {
      const exists = store.data.signatures.some(
        (s) =>
          s.role === 'applicant' &&
          s.lp1fSection === 15 &&
          s.signatoryPersonId === store.data.donor.id,
      );
      if (!exists) {
        store.data.signatures.push({
          id: `sig-applicant-${store.data.donor.id}`,
          signatoryPersonId: store.data.donor.id,
          role: 'applicant',
          lp1fSection: 15,
          signatureBlobPath: '',
          signedOn: '',
          signedOnBehalfFullName: '',
          isWitnessed: false,
          witness: null,
        });
      }
    }
  });

  function sigFor(personId: string) {
    return store.data.signatures.find(
      (s) =>
        s.role === 'applicant' &&
        s.lp1fSection === 15 &&
        s.signatoryPersonId === personId,
    );
  }

  const allJointAttorneysSigned = $derived.by(() => {
    if (store.data.decisionMode !== 'jointly') return true;
    if (app.applicantKind !== 'attorneys') return true;
    return store.data.attorneys.every((a) => {
      const sig = sigFor(a.person.id);
      return !!sig && !!sig.signedOn;
    });
  });
</script>

<section>
  <h2 class="text-xl font-semibold mb-2">Step 15 &mdash; Registration signature (LP1F section 15)</h2>
  <p class="text-sm text-base-content/70 mb-3">
    Each applicant signs the registration request. If attorneys are appointed jointly, every
    joint attorney must sign here.
  </p>

  {#if app.applicantKind === ''}
    <p class="text-sm text-error">
      Choose an applicant kind in step 12 first.
    </p>
  {/if}

  <div class="space-y-4">
    {#each applicants as a (a.personId)}
      {@const sig = sigFor(a.personId)}
      {#if sig}
        <div class="border border-base-300 rounded p-3 bg-base-200 space-y-3">
          <h3 class="text-sm font-semibold text-base-content/80">{a.label}</h3>
          <SignaturePad bind:value={sig.signatureBlobPath} label="Applicant signature" />
          <Field label="Date signed">
            <DateInput bind:value={sig.signedOn} />
          </Field>
        </div>
      {/if}
    {/each}
  </div>

  {#if !allJointAttorneysSigned}
    <p class="mt-4 text-sm text-error">
      Attorneys are appointed jointly. Every joint attorney must sign section 15 before
      the OPG will accept the registration application.
    </p>
  {/if}
</section>
