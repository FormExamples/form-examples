<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import MedicationEntry from '$lib/components/ui/MedicationEntry.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const med = assessment.data.currentMedications;
</script>

<Fieldset title="Current Medications" description="List all current medications and supplements">
	<h3 class="mb-2 text-sm font-semibold text-base-content/80">Hormonal Medications</h3>
	<MedicationEntry bind:medications={med.hormonal} />
	{#if med.hormonal.length === 0}
		<p class="mt-2 mb-4 text-sm text-base-content/60">No hormonal medications added.</p>
	{/if}

	<h3 class="mb-2 mt-6 text-sm font-semibold text-base-content/80">Non-Hormonal Medications</h3>
	<MedicationEntry bind:medications={med.nonHormonal} />
	{#if med.nonHormonal.length === 0}
		<p class="mt-2 mb-4 text-sm text-base-content/60">No non-hormonal medications added.</p>
	{/if}

	<div class="mt-6">
		<TextAreaInput
			label="Supplements and over-the-counter products"
			name="supplements"
			bind:value={med.supplements}
			placeholder="e.g., iron supplements, folic acid, vitamins..."
		/>
	</div>
</Fieldset>
