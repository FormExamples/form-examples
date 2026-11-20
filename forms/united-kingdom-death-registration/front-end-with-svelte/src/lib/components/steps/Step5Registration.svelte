<script lang="ts">
  import { assessment } from '#lib/stores/assessment.svelte.js';
  import Fieldset from '#lib/components/ui/Fieldset.svelte';
  import Field from '#lib/components/ui/Field.svelte';
  import { TextInput } from '@lilydesignsystem/svelte-headless';
  import Select from '#lib/components/ui/Select.svelte';
  import DateInput from '#lib/components/ui/DateInput.svelte';

  const p = assessment.data.registration;
</script>

<Fieldset legend="Step 5 of 6 — Registration appointment">
  <p class="hint">Where and when the death is registered, and the date this assessment is made.</p>

  <Field label="Register office" inputId="registration-registerOffice">
    <TextInput
      id="registration-registerOffice"
      label="Register office"
      placeholder="The district where the death occurred"
      bind:value={p.registerOffice}
    />
  </Field>
  <Field label="Appointment booked?" inputId="registration-appointmentBooked">
    <Select
      id="registration-appointmentBooked"
      label="Appointment booked?"
      bind:value={p.appointmentBooked}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <Field label="Supporting documents to hand?" inputId="registration-supportingDocumentsAvailable">
    <Select
      id="registration-supportingDocumentsAvailable"
      label="Supporting documents to hand?"
      bind:value={p.supportingDocumentsAvailable}
    >
      <option value="">— Select —</option>
      <option value="yes">Yes</option>
      <option value="no">No</option>
    </Select>
  </Field>
  <p class="hint">
    Birth or marriage certificate, passport, NHS medical card, driving licence, proof of address.
    Helpful, not mandatory.
  </p>
  <Field label="Date registered" inputId="registration-registrationDate">
    <DateInput
      id="registration-registrationDate"
      label="Date registered"
      bind:value={p.registrationDate}
    />
  </Field>
  <p class="hint">Leave empty until the death has been registered.</p>
  <Field label="Assessment date (today)" inputId="registration-asOfDate">
    <DateInput id="registration-asOfDate" label="Assessment date (today)" bind:value={p.asOfDate} />
  </Field>
  <p class="hint">Used to count the days since the medical examiner confirmed.</p>
</Fieldset>
