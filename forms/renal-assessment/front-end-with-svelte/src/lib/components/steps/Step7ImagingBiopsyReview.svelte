<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';

	const i = assessment.data.imagingBiopsy;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Imaging & Biopsy Review">
	<p class="hint">Ultrasound, CT/MRI, and biopsy results if performed.</p>

	<Field label="Renal ultrasound performed?">
		<RadioGroup label="Renal ultrasound performed?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="usDone" value={opt.value} bind:group={i.renalUltrasoundDone} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if i.renalUltrasoundDone === 'yes'}
		<div class="field-grid">
			<Field label="Right kidney length (mm)" inputId="rightKidneyLengthMm">
				<NumberInput id="rightKidneyLengthMm" label="Right kidney length" min={0} max={250} bind:value={i.rightKidneyLengthMm} />
			</Field>
			<Field label="Left kidney length (mm)" inputId="leftKidneyLengthMm">
				<NumberInput id="leftKidneyLengthMm" label="Left kidney length" min={0} max={250} bind:value={i.leftKidneyLengthMm} />
			</Field>
		</div>
		<Field label="Cysts seen?">
			<RadioGroup label="Cysts seen?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="cysts" value={opt.value} bind:group={i.cysts} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
		<Field label="Hydronephrosis?">
			<RadioGroup label="Hydronephrosis?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="hydro" value={opt.value} bind:group={i.hydronephrosis} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
		<Field label="Stones?">
			<RadioGroup label="Stones?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="imgStones" value={opt.value} bind:group={i.stones} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
		<Field label="Ultrasound findings" inputId="ultrasoundFindings">
			<TextAreaInput id="ultrasoundFindings" label="Ultrasound findings" rows={3} placeholder="Echogenicity, corticomedullary differentiation, etc." bind:value={i.ultrasoundFindings} />
		</Field>
	{/if}

	<Field label="CT or MRI performed?">
		<RadioGroup label="CT or MRI performed?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="ctMri" value={opt.value} bind:group={i.ctOrMri} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if i.ctOrMri === 'yes'}
		<Field label="CT / MRI findings" inputId="ctMriFindings">
			<TextAreaInput id="ctMriFindings" label="CT / MRI findings" rows={3} bind:value={i.ctMriFindings} />
		</Field>
	{/if}

	<Field label="Renal biopsy performed?">
		<RadioGroup label="Renal biopsy performed?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="biopsy" value={opt.value} bind:group={i.biopsyDone} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if i.biopsyDone === 'yes'}
		<Field label="Biopsy date" inputId="biopsyDate">
			<DateInput id="biopsyDate" label="Biopsy date" bind:value={i.biopsyDate} />
		</Field>
		<Field label="Biopsy result / histopathology" inputId="biopsyResult">
			<TextAreaInput id="biopsyResult" label="Biopsy result / histopathology" rows={3} placeholder="e.g. IgA nephropathy, FSGS, diabetic glomerulosclerosis…" bind:value={i.biopsyResult} />
		</Field>
	{/if}
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
