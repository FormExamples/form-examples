<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import ZaritItemField from './ZaritItemField.svelte';
	import { zaritItems, normalizeInstrumentForm } from '$lib/engine/zarit-rules';

	const instrumentForm = $derived(normalizeInstrumentForm(assessment.data));
</script>

<Fieldset legend="Step 4 of 5 — Burden items">
	<p class="hint">
		The carer rates each statement on the 0-4 frequency scale (0 = Never … 4 = Nearly always). A
		higher rating means greater perceived burden; there is no reverse-scoring.
		{#if instrumentForm === 'zbi12'}
			On the ZBI-12 short form, only the twelve short-form items are scored; the remaining items may
			still be recorded but do not contribute to the total.
		{/if}
	</p>

	{#each zaritItems as item (item.number)}
		<ZaritItemField {item} />
	{/each}
</Fieldset>
