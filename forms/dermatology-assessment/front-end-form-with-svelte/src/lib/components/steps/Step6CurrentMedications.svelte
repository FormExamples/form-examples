<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import MedicationEntry from '$lib/components/ui/MedicationEntry.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const med = assessment.data.currentMedications;
</script>

<Fieldset legend="Current Medications">
	<p class="hint">List all current treatments for your skin condition.</p>

	<Field label="Topical Medications">
		<MedicationEntry bind:medications={med.topicals} />
		{#if med.topicals.length === 0}
			<p class="hint">No topical medications added.</p>
		{/if}
	</Field>

	<Field label="Systemic Medications">
		<MedicationEntry bind:medications={med.systemics} />
		{#if med.systemics.length === 0}
			<p class="hint">No systemic medications added.</p>
		{/if}
	</Field>

	<Field label="Biologic Therapies">
		<MedicationEntry bind:medications={med.biologics} />
		{#if med.biologics.length === 0}
			<p class="hint">No biologic therapies added.</p>
		{/if}
	</Field>

	<Field label="Over-the-counter products currently in use" inputId="otcProducts">
		<TextAreaInput id="otcProducts" label="OTC products" rows={3} placeholder="e.g., moisturisers, sunscreen, medicated shampoos..." bind:value={med.otcProducts} />
	</Field>
</Fieldset>
