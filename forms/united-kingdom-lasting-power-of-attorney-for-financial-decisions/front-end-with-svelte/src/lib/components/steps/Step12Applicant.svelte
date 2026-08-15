<script lang="ts">
  import { store } from '#lib/stores/lpa.svelte.js';
  import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

  // Track per-attorney "applicant" selection in local state, then keep
  // the canonical list of applicant signatures in sync with the LPA's
  // `signatures` array (section 15 is the registration signature).
  let selectedAttorneyIds = $state<string[]>([]);

  // Pre-populate the local selection from any existing applicant signatures.
  $effect(() => {
    const kind = store.data.registrationApplication.applicantKind;
    if (kind === 'attorneys') {
      const existing = store.data.signatures
        .filter((s) => s.role === 'applicant' && s.lp1fSection === 15)
        .map((s) => s.signatoryPersonId);
      // Only seed once if our local state is empty.
      if (selectedAttorneyIds.length === 0 && existing.length > 0) {
        selectedAttorneyIds = existing;
      }
    } else {
      // Clear out any stray applicant signatures if the donor is applying.
      const hasStrayApplicant = store.data.signatures.some(
        (s) => s.role === 'applicant' && s.lp1fSection === 15,
      );
      if (hasStrayApplicant) {
        store.data.signatures = store.data.signatures.filter(
          (s) => !(s.role === 'applicant' && s.lp1fSection === 15),
        );
      }
      if (selectedAttorneyIds.length > 0) selectedAttorneyIds = [];
    }
  });

  function toggleAttorney(personId: string, checked: boolean) {
    if (checked) {
      if (!selectedAttorneyIds.includes(personId)) {
        selectedAttorneyIds = [...selectedAttorneyIds, personId];
      }
    } else {
      selectedAttorneyIds = selectedAttorneyIds.filter((id) => id !== personId);
    }
    // Keep applicant signature placeholders in sync; signatures get filled
    // in step 15 (signature blob + date) but the records exist now.
    const wantedIds = new Set(selectedAttorneyIds);
    // Drop any applicant signatures whose attorney is no longer selected.
    store.data.signatures = store.data.signatures.filter(
      (s) =>
        !(s.role === 'applicant' && s.lp1fSection === 15) ||
        wantedIds.has(s.signatoryPersonId),
    );
    // Add placeholders for newly selected attorneys.
    for (const id of selectedAttorneyIds) {
      const exists = store.data.signatures.some(
        (s) =>
          s.role === 'applicant' &&
          s.lp1fSection === 15 &&
          s.signatoryPersonId === id,
      );
      if (!exists) {
        store.data.signatures.push({
          id: `sig-applicant-${id}`,
          signatoryPersonId: id,
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
  }

  const applicantOptions = [
    { value: 'donor', label: 'The donor is applying to register the LPA' },
    { value: 'attorneys', label: 'One or more attorneys are applying to register the LPA' },
  ];
</script>

<section>
  <h2 class="text-xl font-semibold mb-2">Step 12 &mdash; Applicant (LP1F section 12)</h2>
  <p class="text-sm text-base-content/70 mb-3">
    Only the donor or one or more attorneys may apply to register the LPA. When attorneys
    are appointed jointly, every joint attorney must apply (and sign section 15).
  </p>

  <RadioGroup
    name="applicantKind"
    options={applicantOptions}
    bind:value={store.data.registrationApplication.applicantKind}
  />

  {#if store.data.registrationApplication.applicantKind === 'attorneys'}
    <div class="mt-4 space-y-3">
      <h3 class="text-sm font-semibold text-base-content/80">Which attorneys are applying?</h3>
      {#if store.data.attorneys.length === 0}
        <p class="text-sm text-error">
          No attorneys have been added yet. Go back to step 2 to add at least one.
        </p>
      {/if}
      {#each store.data.attorneys as a (a.person.id)}
        <div class="border border-base-300 rounded p-3 bg-base-200 space-y-2">
          <label class="inline-flex items-start gap-2">
            <input
              type="checkbox"
              class="mt-1"
              checked={selectedAttorneyIds.includes(a.person.id)}
              onchange={(e) =>
                toggleAttorney(a.person.id, (e.currentTarget as HTMLInputElement).checked)}
            />
            <span class="text-sm text-base-content/80">
              Attorney #{a.ordinal} &mdash; {a.person.firstNames} {a.person.lastName}
            </span>
          </label>
          {#if selectedAttorneyIds.includes(a.person.id)}
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 ml-6 text-sm text-base-content/80">
              <p>
                <span class="font-medium">Full name:</span>
                {`${a.person.firstNames} ${a.person.lastName}`.trim() || '(not set)'}
              </p>
              <p>
                <span class="font-medium">Date of birth:</span>
                {a.person.dateOfBirth || '(not set)'}
              </p>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</section>
