<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import MedicationEntry from '$lib/components/ui/MedicationEntry.svelte';

	const med = assessment.data.currentMedications;
</script>

<Fieldset title="Current Medications" description="List all current medications relevant to your urological condition">
	<h3 class="mb-2 text-sm font-semibold text-base-content/70">Alpha-Blockers</h3>
	<MedicationEntry bind:medications={med.alphaBlockers} />
	{#if med.alphaBlockers.length === 0}
		<p class="mt-2 mb-4 text-sm text-base-content/60">No alpha-blockers added.</p>
	{/if}

	<h3 class="mb-2 mt-6 text-sm font-semibold text-base-content/70">5-Alpha-Reductase Inhibitors</h3>
	<MedicationEntry bind:medications={med.fiveAlphaReductaseInhibitors} />
	{#if med.fiveAlphaReductaseInhibitors.length === 0}
		<p class="mt-2 mb-4 text-sm text-base-content/60">No 5-alpha-reductase inhibitors added.</p>
	{/if}

	<h3 class="mb-2 mt-6 text-sm font-semibold text-base-content/70">Anticholinergics</h3>
	<MedicationEntry bind:medications={med.anticholinergics} />
	{#if med.anticholinergics.length === 0}
		<p class="mt-2 mb-4 text-sm text-base-content/60">No anticholinergics added.</p>
	{/if}

	<h3 class="mb-2 mt-6 text-sm font-semibold text-base-content/70">Other Medications</h3>
	<MedicationEntry bind:medications={med.otherMedications} />
	{#if med.otherMedications.length === 0}
		<p class="mt-2 mb-4 text-sm text-base-content/60">No other medications added.</p>
	{/if}
</Fieldset>
