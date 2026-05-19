<script lang="ts">
  import Field from '$lib/components/ui/Field.svelte';
  import { store } from '$lib/store.svelte.js';
</script>

<section aria-labelledby="step2-heading">
  <h2 id="step2-heading" class="text-xl font-semibold mb-4">Step 2 — Patient identification</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <Field id="patient-name" label="Patient name">
      <input
        id="patient-name"
        type="text"
        class="w-full border rounded px-2 py-1"
        bind:value={store.data.patient.name}
      />
    </Field>
    <Field id="patient-dob" label="Date of birth">
      <input
        id="patient-dob"
        type="date"
        class="w-full border rounded px-2 py-1"
        bind:value={store.data.patient.birthDate}
      />
    </Field>
    <Field id="patient-nhs" label="NHS number" hint="Ten-digit identifier, optionally formatted with spaces.">
      <input
        id="patient-nhs"
        type="text"
        class="w-full border rounded px-2 py-1"
        bind:value={store.data.patient.unitedKingdomNhsNumber}
      />
    </Field>
    <Field id="patient-postcode" label="Postcode">
      <input
        id="patient-postcode"
        type="text"
        class="w-full border rounded px-2 py-1"
        bind:value={store.data.patient.postcode}
      />
    </Field>
    <Field id="patient-address" label="Postal address">
      <textarea
        id="patient-address"
        rows={3}
        class="w-full border rounded px-2 py-1"
        bind:value={store.data.patient.postalAddressAsFullText}
      ></textarea>
    </Field>
    <div class="grid grid-cols-1 gap-4">
      <Field id="patient-employer" label="Employer name">
        <input
          id="patient-employer"
          type="text"
          class="w-full border rounded px-2 py-1"
          bind:value={store.data.patient.employerName}
        />
      </Field>
      <Field id="patient-occupation" label="Occupation">
        <input
          id="patient-occupation"
          type="text"
          class="w-full border rounded px-2 py-1"
          bind:value={store.data.patient.occupation}
        />
      </Field>
    </div>
  </div>
</section>
