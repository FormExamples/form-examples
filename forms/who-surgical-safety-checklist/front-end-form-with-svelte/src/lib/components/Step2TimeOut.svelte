<script lang="ts">
  import { store } from '$lib/stores/checklist.svelte.js';
  import TextField from '$lib/components/ui/TextField.svelte';
  import NumberField from '$lib/components/ui/NumberField.svelte';
  import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
  import YesNa from '$lib/components/ui/YesNa.svelte';
  import { createEmptyTeamMember } from '$lib/checklist/factory.js';

  function signOff() {
    if (!store.data.timeOutCompletedAt) {
      store.data.timeOutCompletedAt = new Date().toISOString();
    }
  }
  function clearSignOff() {
    store.data.timeOutCompletedAt = '';
  }
  function addMember() {
    store.data.teamMembers = [...store.data.teamMembers, createEmptyTeamMember()];
  }
  function removeMember(i: number) {
    store.data.teamMembers = store.data.teamMembers.filter((_, idx) => idx !== i);
  }
</script>

<section>
  <h2 class="text-xl font-semibold mb-1">Step 2 — Time Out</h2>
  <p class="text-sm text-slate-600 mb-4">
    Before skin incision. Required: nurse, anaesthetist, surgeon.
  </p>

  <div class="space-y-4">
    <RadioGroup
      label="1. All team members have introduced themselves by name and role"
      bind:value={store.data.timeOutTeamIntroductionsConfirmed}
      options={[{ value: 'yes', label: 'Confirmed' }]}
    />

    <RadioGroup
      label="2. Patient name, procedure, and incision site confirmed"
      bind:value={store.data.timeOutPatientProcedureIncisionConfirmed}
      options={[{ value: 'yes', label: 'Confirmed' }]}
    />

    <YesNa
      label="3. Antibiotic prophylaxis given within the last 60 minutes?"
      bind:value={store.data.timeOutAntibioticProphylaxisWithin60Min}
    />

    <TextField
      label="4. Surgeon — critical or non-routine steps"
      multiline
      bind:value={store.data.timeOutSurgeonCriticalSteps}
    />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <NumberField
        label="5. Surgeon — anticipated case duration"
        suffix="minutes"
        min={0}
        bind:value={store.data.timeOutSurgeonCaseDurationMinutes}
      />
      <NumberField
        label="6. Surgeon — anticipated blood loss"
        suffix="ml"
        min={0}
        bind:value={store.data.timeOutSurgeonAnticipatedBloodLossMl}
      />
    </div>

    <TextField
      label="7. Anaesthetist — patient-specific concerns"
      multiline
      bind:value={store.data.timeOutAnaesthetistPatientConcerns}
    />

    <RadioGroup
      label="8. Nursing — sterility (including indicator results) confirmed"
      bind:value={store.data.timeOutNursingSterilityConfirmed}
      options={[{ value: 'yes', label: 'Confirmed' }]}
    />

    <TextField
      label="9. Nursing — equipment issues or concerns"
      multiline
      bind:value={store.data.timeOutNursingEquipmentConcerns}
    />

    <YesNa
      label="10. Is essential imaging displayed?"
      bind:value={store.data.timeOutEssentialImagingDisplayed}
    />
  </div>

  <h3 class="text-lg font-semibold mt-6 mb-2">Operating-team roster</h3>
  <p class="text-sm text-slate-600 mb-2">
    Add one row per person introduced during the Time Out.
  </p>
  {#each store.data.teamMembers as member, i (i)}
    <div class="grid grid-cols-1 md:grid-cols-4 gap-3 mb-2 items-end">
      <TextField label="Name" bind:value={store.data.teamMembers[i].name} />
      <RadioGroup
        label="Role"
        bind:value={store.data.teamMembers[i].role}
        options={[
          { value: 'surgeon', label: 'Surgeon' },
          { value: 'anaesthetist', label: 'Anaesthetist' },
          { value: 'circulating-nurse', label: 'Circulating nurse' },
          { value: 'scrub-nurse', label: 'Scrub nurse' },
          { value: 'other', label: 'Other' },
        ]}
      />
      <RadioGroup
        label="Introduced?"
        bind:value={store.data.teamMembers[i].introducedDuringTimeOut}
        options={[
          { value: 'yes', label: 'Yes' },
          { value: 'no', label: 'No' },
        ]}
      />
      <button
        type="button"
        class="px-2 py-1 text-sm text-red-700 border border-red-300 rounded hover:bg-red-50"
        onclick={() => removeMember(i)}
      >
        Remove
      </button>
    </div>
  {/each}
  <button
    type="button"
    class="mt-2 px-3 py-1.5 rounded border border-slate-300 text-slate-700 text-sm hover:bg-slate-100"
    onclick={addMember}
  >
    + Add team member
  </button>

  <h3 class="text-lg font-semibold mt-6 mb-2">Time Out coordinator sign-off</h3>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <TextField
      label="Coordinator name"
      bind:value={store.data.timeOutCoordinatorName}
    />
    <RadioGroup
      label="Coordinator role"
      bind:value={store.data.timeOutCoordinatorRole}
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
      Sign Time-Out now
    </button>
    {#if store.data.timeOutCompletedAt}
      <span class="text-sm text-slate-700">
        Signed at <code>{store.data.timeOutCompletedAt}</code>
      </span>
      <button
        type="button"
        class="text-sm text-red-700 underline"
        onclick={clearSignOff}>Clear</button
      >
    {/if}
  </div>
</section>
