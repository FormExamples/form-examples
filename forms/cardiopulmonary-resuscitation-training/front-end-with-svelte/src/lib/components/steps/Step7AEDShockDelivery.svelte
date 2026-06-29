<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.aedShockDelivery;
	const tri = [
		{ value: 'yes', label: 'Demonstrated' },
		{ value: 'no', label: 'Not yet' },
		{ value: 'na', label: 'Not assessed' }
	];
	const items = [
		{ name: 'poweredOnPromptly', label: 'Powers on the AED as soon as it is available.', critical: false },
		{ name: 'correctPadPlacement', label: 'Places pads in correct anterolateral position on bare chest.', critical: false },
		{ name: 'clearedDuringAnalysis', label: 'Ensures everyone is clear during rhythm analysis.', critical: false },
		{ name: 'deliveredShockSafely', label: 'Delivers shock with a clear "everyone clear" call and no unsafe contact.', critical: true },
		{ name: 'resumedCompressionsImmediately', label: 'Resumes chest compressions immediately after shock.', critical: false }
	] as const;
</script>

<Fieldset legend="AED Use & Shock Delivery">
	<p class="hint">Automated external defibrillator use and safe shock delivery.</p>

	<Field label="Time to first shock (seconds)" description="Target under 90 seconds" inputId="timeToFirstShockSeconds">
		<NumberInput id="timeToFirstShockSeconds" label="Time to first shock" min={0} max={600} bind:value={d.timeToFirstShockSeconds} />
	</Field>

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
	.critical-hint {
		font-weight: 600;
	}
</style>
