<script lang="ts">
  import { store } from '$lib/stores/prescription.svelte.js';
  import StepCard from '$lib/components/ui/StepCard.svelte';
  import FormField from '$lib/components/ui/FormField.svelte';
  const input = 'block w-full rounded border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500';

  function onBirthBlur(): void {
    store.maybeSuggestExpiry();
  }
</script>

<StepCard step={2} title="Patient identification">
  <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4">
    <FormField label="Patient name" required>
      <input class={input} type="text" bind:value={store.data.patient.name} />
    </FormField>
    <FormField label="Date of birth" required>
      <input class={input} type="date" bind:value={store.data.patient.birthDate} onblur={onBirthBlur} />
    </FormField>
    <FormField label="Sex">
      <select class={input} bind:value={store.data.patient.sex}>
        <option value="">—</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
        <option value="unknown">Unknown</option>
      </select>
    </FormField>
    <FormField label="NHS number">
      <input class={input} type="text" bind:value={store.data.patient.unitedKingdomNhsNumber} />
    </FormField>
    <FormField label="Address">
      <input class={input} type="text" bind:value={store.data.patient.postalAddressAsFullText} />
    </FormField>
    <FormField label="Postcode">
      <input class={input} type="text" bind:value={store.data.patient.postcode} />
    </FormField>
    <FormField label="Country">
      <input class={input} type="text" maxlength="2" bind:value={store.data.patient.countryAsIso31661Alpha2} />
    </FormField>
    <FormField label="Email">
      <input class={input} type="email" bind:value={store.data.patient.email} />
    </FormField>
    <FormField label="Phone">
      <input class={input} type="tel" bind:value={store.data.patient.phone} />
    </FormField>
  </div>
</StepCard>
