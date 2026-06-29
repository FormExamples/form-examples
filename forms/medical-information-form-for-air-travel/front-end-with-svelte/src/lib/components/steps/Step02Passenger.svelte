<script lang="ts">
  import { store } from '$lib/stores/assessment.svelte.js';
  import TextField from '$lib/components/ui/TextField.svelte';
  import SelectField from '$lib/components/ui/SelectField.svelte';
</script>

<section>
  <h2 class="text-xl font-semibold mb-4">Step 2 — Passenger identification</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <TextField label="First name" bind:value={store.data.passenger.firstName} />
    <TextField id="passengerLastName" label="Last name" bind:value={store.data.passenger.lastName} />
    <TextField id="passengerDateOfBirth" label="Date of birth" type="date" bind:value={store.data.passenger.dateOfBirth} />
    <SelectField
      label="Sex"
      bind:value={store.data.passenger.sex}
      options={[
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' },
      ]}
    />
    <TextField label="Nationality" bind:value={store.data.passenger.nationality} />
    <TextField label="Passport number" bind:value={store.data.passenger.passportNumber} />
    <TextField label="National health ID (NHS / equivalent)" bind:value={store.data.passenger.nationalHealthId} />
    <TextField label="Address" bind:value={store.data.passenger.address} />
    <TextField label="Emergency contact name" bind:value={store.data.passenger.emergencyContactName} />
    <TextField label="Emergency contact phone" type="tel" bind:value={store.data.passenger.emergencyContactPhone} />
  </div>
</section>
