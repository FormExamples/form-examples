<script lang="ts">
  import { store } from '#lib/stores/assessment.svelte.js';
  import TextField from '#lib/components/ui/TextField.svelte';
  import SelectField from '#lib/components/ui/SelectField.svelte';
</script>

<section>
  <h2 class="text-xl font-semibold mb-4">Step 5 — Attending physician</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <TextField id="physicianName" label="Physician name" bind:value={store.data.physician.physicianName} />
    <TextField label="Specialty" bind:value={store.data.physician.specialty} />
    <SelectField
      label="Registration body"
      bind:value={store.data.physician.registrationBody}
      options={[
        { value: 'GMC', label: 'GMC' },
        { value: 'NMC', label: 'NMC' },
        { value: 'HCPC', label: 'HCPC' },
        { value: 'other', label: 'Other' },
      ]}
    />
    <TextField label="Registration number" bind:value={store.data.physician.registrationNumber} />
    <TextField label="Clinic" bind:value={store.data.physician.clinic} />
    <TextField label="Email" type="email" bind:value={store.data.physician.email} />
    <TextField label="Phone" type="tel" bind:value={store.data.physician.phone} />
    <TextField label="Address" bind:value={store.data.physician.address} />
    <TextField label="Signature date" type="date" bind:value={store.data.physician.signatureDate} />
  </div>
</section>
