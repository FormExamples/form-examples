<script lang="ts">
  import { store } from '$lib/stores/assessment.svelte.js';
  import TextField from '$lib/components/ui/TextField.svelte';
  import SelectField from '$lib/components/ui/SelectField.svelte';
</script>

<section>
  <h2 class="text-xl font-semibold mb-4">Step 1 — Submitting agent</h2>
  <p class="text-sm text-base-content/70 mb-4">
    Identify who is filing this MEDIF (passenger themselves, accessible-travel
    agent, attending clinician, or family member) and the airline booking
    reference.
  </p>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <TextField label="Name" bind:value={store.data.submitter.submitterName} />
    <SelectField
      label="Role"
      bind:value={store.data.submitter.submitterRole}
      options={[
        { value: 'passenger', label: 'Passenger' },
        { value: 'agent', label: 'Accessible-travel agent' },
        { value: 'clinician', label: 'Clinician' },
        { value: 'family-member', label: 'Family member' },
      ]}
    />
    <TextField label="Email" type="email" bind:value={store.data.submitter.submitterEmail} />
    <TextField label="Phone" type="tel" bind:value={store.data.submitter.submitterPhone} />
    <TextField label="Organisation" bind:value={store.data.submitter.submitterOrganisation} />
    <TextField
      label="Airline booking reference (PNR)"
      bind:value={store.data.submitter.airlineBookingReference}
    />
  </div>
</section>
