<script lang="ts">
  import { store } from '$lib/stores/checklist.svelte.js';
  import TextField from '$lib/components/ui/TextField.svelte';
  import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
  import YesNa from '$lib/components/ui/YesNa.svelte';

  function signOff() {
    if (!store.data.signInCompletedAt) {
      store.data.signInCompletedAt = new Date().toISOString();
    }
  }
  function clearSignOff() {
    store.data.signInCompletedAt = '';
  }
</script>

<section>
  <h2 class="text-xl font-semibold mb-1">Step 1 — Sign In</h2>
  <p class="text-sm text-slate-600 mb-4">
    Before induction of anaesthesia. Required: at least nurse and anaesthetist.
  </p>

  <div class="space-y-4">
    <RadioGroup
      label="1. Has the patient confirmed identity, site, procedure, and consent?"
      bind:value={store.data.signInIdentitySiteProcedureConsent}
      options={[{ value: 'yes', label: 'Yes' }]}
    />

    <YesNa
      label="2. Is the surgical site marked?"
      bind:value={store.data.signInSiteMarked}
    />

    <RadioGroup
      label="3. Anaesthesia machine and medication check complete?"
      bind:value={store.data.signInAnaesthesiaCheckComplete}
      options={[{ value: 'yes', label: 'Yes' }]}
    />

    <RadioGroup
      label="4. Is the pulse oximeter on the patient and functioning?"
      bind:value={store.data.signInPulseOximeterOnPatient}
      options={[{ value: 'yes', label: 'Yes' }]}
    />

    <RadioGroup
      label="5. Does the patient have a known allergy?"
      bind:value={store.data.signInKnownAllergy}
      options={[
        { value: 'no', label: 'No' },
        { value: 'yes', label: 'Yes' },
      ]}
    />
    {#if store.data.signInKnownAllergy === 'yes'}
      <TextField
        label="Allergy detail"
        bind:value={store.data.signInKnownAllergyDetail}
        placeholder="Allergen — reaction"
      />
    {/if}

    <RadioGroup
      label="6. Difficult airway or aspiration risk?"
      bind:value={store.data.signInDifficultAirwayAspirationRisk}
      options={[
        { value: 'no', label: 'No' },
        {
          value: 'yes-equipment-available',
          label: 'Yes — equipment and assistance available',
        },
      ]}
    />

    <RadioGroup
      label="7. Risk of > 500 ml blood loss (7 ml/kg in children)?"
      bind:value={store.data.signInBloodLossRisk}
      options={[
        { value: 'no', label: 'No' },
        {
          value: 'yes-two-ivs-and-fluids-planned',
          label: 'Yes — two IVs and fluids planned',
        },
      ]}
    />
  </div>

  <h3 class="text-lg font-semibold mt-6 mb-2">Sign In coordinator sign-off</h3>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <TextField
      label="Coordinator name"
      bind:value={store.data.signInCoordinatorName}
    />
    <RadioGroup
      label="Coordinator role"
      bind:value={store.data.signInCoordinatorRole}
      options={[
        { value: 'circulating-nurse', label: 'Circulating nurse' },
        { value: 'anaesthetist', label: 'Anaesthetist' },
        { value: 'surgeon', label: 'Surgeon' },
        { value: 'other', label: 'Other' },
      ]}
    />
  </div>
  <div class="flex items-center gap-3 mt-3">
    <button
      type="button"
      class="px-3 py-1.5 rounded bg-brand-600 text-white hover:bg-brand-700 text-sm"
      onclick={signOff}
    >
      Sign Sign-In now
    </button>
    {#if store.data.signInCompletedAt}
      <span class="text-sm text-slate-700">
        Signed at <code>{store.data.signInCompletedAt}</code>
      </span>
      <button
        type="button"
        class="text-sm text-red-700 underline"
        onclick={clearSignOff}>Clear</button
      >
    {/if}
  </div>
</section>
