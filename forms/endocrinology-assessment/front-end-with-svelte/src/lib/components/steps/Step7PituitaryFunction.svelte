<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const p = assessment.data.pituitaryFunction;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
	const radios = [
		{ key: 'headaches', label: 'Headaches' },
		{ key: 'visualDisturbance', label: 'Visual disturbance' },
		{ key: 'acromegalicFeatures', label: 'Acromegalic features' }
	] as const;
</script>

<Fieldset legend="Pituitary Function">
	<p class="hint">Prolactin (&lt;500 mU/L women, &lt;325 men) · IGF-1 · GH; visual disturbance suggests mass effect.</p>

	<div class="field-grid field-grid-3">
		<Field label="Prolactin (mU/L)" inputId="prolactin">
			<NumberInput id="prolactin" label="Prolactin" min={0} bind:value={p.prolactin} />
		</Field>
		<Field label="IGF-1 (nmol/L)" inputId="igf1">
			<NumberInput id="igf1" label="IGF-1" step="0.1" min={0} bind:value={p.igf1} />
		</Field>
		<Field label="Growth hormone (ng/mL)" inputId="growthHormone">
			<NumberInput id="growthHormone" label="Growth hormone" step="0.1" min={0} bind:value={p.growthHormone} />
		</Field>
	</div>

	{#each radios as r (r.key)}
		<Field label={r.label}>
			<RadioGroup label={r.label}>
				{#each yesNo as opt (opt.value)}
					<label>
						<input type="radio" class="radio-input" name={r.key} value={opt.value} bind:group={p[r.key]} />
						{opt.label}
					</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}

	<Field label="Pituitary imaging performed">
		<RadioGroup label="Pituitary imaging performed">
			{#each yesNo as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="pituitaryImagingDone" value={opt.value} bind:group={p.pituitaryImagingDone} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if p.pituitaryImagingDone === 'yes'}
		<Field label="Imaging findings" inputId="pituitaryImagingFindings">
			<TextInput id="pituitaryImagingFindings" label="Imaging findings" bind:value={p.pituitaryImagingFindings} />
		</Field>
	{/if}

	<Field label="Pituitary notes" inputId="pituitaryNotes">
		<TextAreaInput id="pituitaryNotes" label="Pituitary notes" rows={3} bind:value={p.pituitaryNotes} />
	</Field>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	.field-grid.field-grid-3 {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
	@media (max-width: 640px) {
		.field-grid,
		.field-grid.field-grid-3 {
			grid-template-columns: 1fr;
		}
	}
</style>
