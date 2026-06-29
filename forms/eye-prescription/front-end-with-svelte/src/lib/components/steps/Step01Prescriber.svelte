<script lang="ts">
  import { assessment } from '$lib/stores/assessment.svelte';
  import StepCard from '$lib/components/ui/StepCard.svelte';
  import FormField from '$lib/components/ui/FormField.svelte';
  const input = 'input w-full';
  const select = 'select w-full';
</script>

<StepCard step={1} title="Prescriber identification" description="GOC-registered optometrist or dispensing optician.">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4">
    <FormField label="Prescriber name" required>
      <input id="prescriberName" class={input} type="text" bind:value={assessment.data.prescriber.name} />
    </FormField>
    <FormField label="GOC registration number" required>
      <input id="gocRegistrationNumber" class={input} type="text" bind:value={assessment.data.prescriber.gocRegistrationNumber} />
    </FormField>
    <FormField label="Role">
      <select class={select} bind:value={assessment.data.prescriber.role}>
        <option value="">—</option>
        <option value="optometrist">Optometrist</option>
        <option value="dispensing-optician">Dispensing optician</option>
        <option value="ophthalmologist">Ophthalmologist</option>
        <option value="student">Student</option>
      </select>
    </FormField>
    <FormField label="Practice name">
      <input class={input} type="text" bind:value={assessment.data.prescriber.practiceName} />
    </FormField>
    <FormField label="Practice address">
      <input class={input} type="text" bind:value={assessment.data.prescriber.practiceAddress} />
    </FormField>
    <FormField label="Postcode">
      <input class={input} type="text" bind:value={assessment.data.prescriber.postcode} />
    </FormField>
    <FormField label="Country (ISO 3166-1 alpha-2)">
      <input class={input} type="text" maxlength="2" bind:value={assessment.data.prescriber.countryAsIso31661Alpha2} />
    </FormField>
    <FormField label="Email">
      <input class={input} type="email" bind:value={assessment.data.prescriber.email} />
    </FormField>
    <FormField label="Phone">
      <input class={input} type="tel" bind:value={assessment.data.prescriber.phone} />
    </FormField>
  </div>
</StepCard>
