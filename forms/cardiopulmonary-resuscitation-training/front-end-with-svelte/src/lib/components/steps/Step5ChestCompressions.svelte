<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.chestCompressions;
	const tri = [
		{ value: 'yes', label: 'Demonstrated' },
		{ value: 'no', label: 'Not yet' },
		{ value: 'na', label: 'Not assessed' }
	];
	const items = [
		{ name: 'correctHandPosition', label: 'Correct hand position (centre of chest, lower half of sternum).', critical: false },
		{ name: 'fullChestRecoil', label: 'Allows full chest recoil between compressions.', critical: false },
		{ name: 'minimisedInterruptions', label: 'Minimises interruptions in chest compressions (<10 s).', critical: false },
		{ name: 'compressionsAtCorrectRate', label: 'Compressions delivered at AHA rate of 100-120 per minute.', critical: true },
		{ name: 'compressionsAtCorrectDepth', label: 'Compressions delivered to AHA depth of 5-6 cm for an adult.', critical: true }
	] as const;
</script>

<Fieldset legend="Chest Compressions">
	<p class="hint">
		Record measured rate and depth; the critical-action rules derive from these
		measurements when not marked explicitly. AHA targets: 100-120/min, 5-6 cm.
	</p>

	<div class="field-grid">
		<Field label="Measured compression rate (per minute)" inputId="compressionRate">
			<NumberInput id="compressionRate" label="Compression rate" min={0} max={250} bind:value={d.compressionRate} />
		</Field>
		<Field label="Measured compression depth (cm)" inputId="compressionDepth">
			<NumberInput id="compressionDepth" label="Compression depth" min={0} max={12} step="0.1" bind:value={d.compressionDepth} />
		</Field>
	</div>

	{#each items as item (item.name)}
		<Field label={item.label}>
			<RadioGroup label={item.label}>
				{#each tri as opt (opt.value)}
					<label><input type="radio" class="radio-input" name={item.name} value={opt.value} bind:group={d[item.name]} /> {opt.label}</label>
				{/each}
			</RadioGroup>
			{#if item.critical}
				<p class="hint critical-hint">Critical action — any failure forces an overall Fail.</p>
			{/if}
		</Field>
	{/each}
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.field-grid {
			grid-template-columns: 1fr;
		}
	}
	.critical-hint {
		font-weight: 600;
	}
</style>
