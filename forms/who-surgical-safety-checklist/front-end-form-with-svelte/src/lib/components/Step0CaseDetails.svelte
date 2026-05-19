<script lang="ts">
  import { store } from '$lib/stores/checklist.svelte.js';
  import TextField from '$lib/components/ui/TextField.svelte';
  import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

  const c = $derived(store.data);
</script>

<section>
  <h2 class="text-xl font-semibold mb-1">Step 0 — Case details</h2>
  <p class="text-sm text-slate-600 mb-4">
    Capture patient, theatre, procedure, and team identification before starting
    Sign In.
  </p>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <TextField label="Site / hospital" bind:value={store.data.siteName} />
    <TextField label="Operating room" bind:value={store.data.operatingRoom} />
    <TextField label="Case date" type="date" bind:value={store.data.caseDate} />
    <TextField
      label="Case start (wheels-in)"
      type="datetime-local"
      bind:value={store.data.caseStartAt}
    />
    <TextField
      label="Planned procedure"
      bind:value={store.data.plannedProcedure}
    />
    <TextField
      label="Surgical specialty"
      bind:value={store.data.surgicalSpecialty}
    />
    <RadioGroup
      label="Urgency"
      bind:value={store.data.urgency}
      options={[
        { value: 'elective', label: 'Elective' },
        { value: 'urgent', label: 'Urgent' },
        { value: 'emergency', label: 'Emergency' },
        { value: 'immediate', label: 'Immediate' },
      ]}
    />
    <RadioGroup
      label="Laterality"
      bind:value={store.data.laterality}
      options={[
        { value: 'left', label: 'Left' },
        { value: 'right', label: 'Right' },
        { value: 'bilateral', label: 'Bilateral' },
        { value: 'midline', label: 'Midline' },
        { value: 'na', label: 'N/A' },
      ]}
    />
    <RadioGroup
      label="Paediatric patient?"
      hint="Drives the 7 ml/kg blood-loss threshold."
      bind:value={store.data.isPaediatric}
      options={[
        { value: 'yes', label: 'Yes' },
        { value: 'no', label: 'No' },
      ]}
    />
  </div>

  <h3 class="text-lg font-semibold mt-6 mb-2">Lead clinicians</h3>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <TextField label="Lead surgeon ID" bind:value={store.data.surgeonId} />
    <TextField
      label="Anaesthetist ID"
      bind:value={store.data.anaesthetistId}
    />
    <TextField label="Lead nurse ID" bind:value={store.data.leadNurseId} />
  </div>

  <h3 class="text-lg font-semibold mt-6 mb-2">Abandonment</h3>
  <TextField
    label="Abandoned reason (leave blank if not abandoned)"
    multiline
    bind:value={store.data.abandonedReason}
    hint="Setting any non-empty reason marks the case as abandoned."
  />

  <p class="text-xs text-slate-500 mt-3">
    Patient ID: <code>{c.patientId || '—'}</code>
  </p>
</section>
