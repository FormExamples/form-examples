<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const b = assessment.data.boneCalcium;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
	const radios = [
		{ key: 'fragilityFracture', label: 'Fragility fracture history' },
		{ key: 'bonePain', label: 'Bone pain' }
	] as const;
</script>

<Fieldset legend="Bone & Calcium">
	<p class="hint">PTH 1.6–6.9 pmol/L · Vitamin D ≥50 sufficient (nmol/L) · Corrected calcium 2.20–2.60 mmol/L.</p>

	<div class="field-grid">
		<Field label="PTH (pmol/L)" inputId="pth">
			<NumberInput id="pth" label="PTH" step="0.1" min={0} bind:value={b.pth} />
		</Field>
		<Field label="Vitamin D (nmol/L)" inputId="vitaminD">
			<NumberInput id="vitaminD" label="Vitamin D" min={0} bind:value={b.vitaminD} />
		</Field>
		<Field label="Corrected calcium (mmol/L)" inputId="calciumCorrected">
			<NumberInput id="calciumCorrected" label="Corrected calcium" step="0.01" min={0} bind:value={b.calciumCorrected} />
		</Field>
		<Field label="Phosphate (mmol/L)" inputId="phosphate">
			<NumberInput id="phosphate" label="Phosphate" step="0.01" min={0} bind:value={b.phosphate} />
		</Field>
	</div>

	{#each radios as r (r.key)}
		<Field label={r.label}>
			<RadioGroup label={r.label}>
				{#each yesNo as opt (opt.value)}
					<label>
						<input type="radio" class="radio-input" name={r.key} value={opt.value} bind:group={b[r.key]} />
						{opt.label}
					</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}

	<Field label="DEXA scan performed">
		<RadioGroup label="DEXA scan performed">
			{#each yesNo as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="dexaScanDone" value={opt.value} bind:group={b.dexaScanDone} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if b.dexaScanDone === 'yes'}
		<Field label="DEXA result" inputId="dexaResult">
			<TextInput id="dexaResult" label="DEXA result" placeholder="e.g. T-score −2.6 lumbar spine" bind:value={b.dexaResult} />
		</Field>
	{/if}

	<Field label="Bone notes" inputId="boneNotes">
		<TextAreaInput id="boneNotes" label="Bone notes" rows={3} bind:value={b.boneNotes} />
	</Field>
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
</style>
