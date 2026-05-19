<script lang="ts">
  import { store } from '$lib/stores/checklist.svelte.js';
  import TextField from '$lib/components/ui/TextField.svelte';
  import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
  import YesNo from '$lib/components/ui/YesNo.svelte';
  import YesNoNa from '$lib/components/ui/YesNoNa.svelte';

  function signOff() {
    if (!store.data.signOutCompletedAt) {
      store.data.signOutCompletedAt = new Date().toISOString();
    }
    if (!store.data.caseEndAt) {
      store.data.caseEndAt = new Date().toISOString();
    }
  }
  function clearSignOff() {
    store.data.signOutCompletedAt = '';
  }
</script>

<section>
  <h2 class="text-xl font-semibold mb-1">Step 3 — Sign Out</h2>
  <p class="text-sm text-slate-600 mb-4">
    Before the patient leaves the operating room. Required: nurse, anaesthetist,
    surgeon.
  </p>

  <div class="space-y-4">
    <RadioGroup
      label="1. Nurse verbally confirms: name of the procedure recorded"
      bind:value={store.data.signOutProcedureNameConfirmed}
      options={[{ value: 'yes', label: 'Confirmed' }]}
    />

    <YesNo
      label="2. Nurse verbally confirms: instrument, sponge, and needle counts"
      bind:value={store.data.signOutCountsConfirmed}
    />

    <YesNoNa
      label="3. Nurse verbally confirms: specimen labelling (read aloud, including patient name)"
      bind:value={store.data.signOutSpecimensLabelled}
    />

    <TextField
      label="4. Equipment problems to be addressed"
      multiline
      bind:value={store.data.signOutEquipmentProblems}
    />

    <TextField
      label="5. Key concerns for recovery and management of this patient"
      multiline
      bind:value={store.data.signOutRecoveryConcerns}
    />
  </div>

  <h3 class="text-lg font-semibold mt-6 mb-2">Sign Out coordinator sign-off</h3>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <TextField
      label="Coordinator name"
      bind:value={store.data.signOutCoordinatorName}
    />
    <RadioGroup
      label="Coordinator role"
      bind:value={store.data.signOutCoordinatorRole}
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
      Sign Sign-Out now (records wheels-out time)
    </button>
    {#if store.data.signOutCompletedAt}
      <span class="text-sm text-slate-700">
        Signed at <code>{store.data.signOutCompletedAt}</code>
      </span>
      <button
        type="button"
        class="text-sm text-red-700 underline"
        onclick={clearSignOff}>Clear</button
      >
    {/if}
  </div>
</section>
