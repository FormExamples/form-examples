<script lang="ts">
	// Step-local convenience wrapper: a standardised-score number input (mean
	// 100, SD 15) with an auto-derived band + severity readout.
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import { scoreBandLabel, scoreSeverity, severityLabel } from '#lib/engine/utils.js';

	let {
		label,
		id,
		value = $bindable<number | null>(null)
	}: {
		label: string;
		id: string;
		value?: number | null;
	} = $props();

	const band = $derived(scoreBandLabel(value));
	const sev = $derived(severityLabel(scoreSeverity(value)));
</script>

<Field {label} description="Standardised score (mean 100, SD 15)" inputId={id}>
	<div class="score-row">
		<NumberInput {id} {label} min={40} max={160} bind:value />
		<p class="readout">
			{#if value === null || value === undefined}
				<span class="text-base-content/60">—</span>
			{:else}
				<strong>{band}</strong> <span class="text-base-content/60">({sev})</span>
			{/if}
		</p>
	</div>
</Field>

<style>
	.score-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		align-items: center;
		gap: 1rem;
	}
	.readout {
		margin: 0;
		font-size: 0.875rem;
	}
	@media (max-width: 640px) {
		.score-row {
			grid-template-columns: 1fr;
		}
	}
</style>
