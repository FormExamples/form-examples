<script lang="ts">
  import { assessment } from '$lib/stores/assessment.svelte';
  import StepCard from '$lib/components/ui/StepCard.svelte';
  import FormField from '$lib/components/ui/FormField.svelte';
  const input = 'input w-full';

  function onBirthBlur(): void {
    assessment.maybeSuggestExpiry();
  }
</script>

<StepCard step={2} title="Patient identification">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4">
    <FormField label="Patient name" required>
      <input id="patientName" class={input} type="text" bind:value={assessment.data.patient.name} />
    </FormField>
    <FormField label="Date of birth" required>
      <input id="patientBirthDate" class={input} type="date" bind:value={assessment.data.patient.birthDate} onblur={onBirthBlur} />
    </FormField>
    <FormField label="Sex">
      <select class={input} bind:value={assessment.data.patient.sex}>
        <option value="">—</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
        <option value="unknown">Unknown</option>
      </select>
    </FormField>
    <FormField label="NHS number">
      <input class={input} type="text" bind:value={assessment.data.patient.unitedKingdomNhsNumber} />
    </FormField>
    <FormField label="Address">
      <input class={input} type="text" bind:value={assessment.data.patient.postalAddressAsFullText} />
    </FormField>
    <FormField label="Postcode">
      <input class={input} type="text" bind:value={assessment.data.patient.postcode} />
    </FormField>
    <FormField label="Country">
      <input class={input} type="text" maxlength="2" bind:value={assessment.data.patient.countryAsIso31661Alpha2} />
    </FormField>
    <FormField label="Email">
      <input class={input} type="email" bind:value={assessment.data.patient.email} />
    </FormField>
    <FormField label="Phone">
      <input class={input} type="tel" bind:value={assessment.data.patient.phone} />
    </FormField>
  </div>
</StepCard>
