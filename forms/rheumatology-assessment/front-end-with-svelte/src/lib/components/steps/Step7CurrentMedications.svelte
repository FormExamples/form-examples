<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import MedicationEntry from '$lib/components/ui/MedicationEntry.svelte';

	const d = assessment.data.currentMedications;
</script>

<Fieldset legend="Current Medications">
	<p class="hint">All medications currently being taken for rheumatological and other conditions.</p>

	<h3 class="section-h">DMARDs (Disease-Modifying Anti-Rheumatic Drugs)</h3>
	<MedicationEntry bind:medications={d.dmards} />
	{#if d.dmards.length === 0}<p class="hint">No DMARDs added.</p>{/if}

	<h3 class="section-h">Biologics</h3>
	<MedicationEntry bind:medications={d.biologics} />
	{#if d.biologics.length === 0}<p class="hint">No biologics added.</p>{/if}

	<h3 class="section-h">NSAIDs</h3>
	<MedicationEntry bind:medications={d.nsaids} />
	{#if d.nsaids.length === 0}<p class="hint">No NSAIDs added.</p>{/if}

	<h3 class="section-h">Steroids</h3>
	<MedicationEntry bind:medications={d.steroids} />
	{#if d.steroids.length === 0}<p class="hint">No steroids added.</p>{/if}

	<h3 class="section-h">Pain Medication</h3>
	<MedicationEntry bind:medications={d.painMedication} />
	{#if d.painMedication.length === 0}<p class="hint">No pain medication added.</p>{/if}

	<h3 class="section-h">Supplements</h3>
	<MedicationEntry bind:medications={d.supplements} />
	{#if d.supplements.length === 0}<p class="hint">No supplements added.</p>{/if}
</Fieldset>

<style>.section-h { font-weight: 600; margin: 1rem 0 0.5rem; color: var(--color-text); }</style>
