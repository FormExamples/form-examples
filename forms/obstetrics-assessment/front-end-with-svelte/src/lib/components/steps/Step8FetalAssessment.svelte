<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const f = assessment.data.fetalAssessment;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Fetal Assessment">
	<p class="hint">Growth, lie, presentation, movements, and auscultation.</p>

	<Field label="Symphysis-fundal height (cm)" inputId="fundalHeight">
		<NumberInput id="fundalHeight" label="Symphysis-fundal height" min={10} max={50} bind:value={f.fundalHeight} />
	</Field>

	<div class="field-grid">
		<Field label="Fetal lie" inputId="fetalLie">
			<Select id="fetalLie" label="Fetal lie" bind:value={f.fetalLie}>
				<option value="">— Select —</option>
				<option value="longitudinal">Longitudinal</option>
				<option value="transverse">Transverse</option>
				<option value="oblique">Oblique</option>
				<option value="unstable">Unstable</option>
			</Select>
		</Field>
		<Field label="Presentation" inputId="fetalPresentation">
			<Select id="fetalPresentation" label="Presentation" bind:value={f.fetalPresentation}>
				<option value="">— Select —</option>
				<option value="cephalic">Cephalic</option>
				<option value="breech">Breech</option>
				<option value="shoulder">Shoulder</option>
				<option value="unknown">Unknown</option>
			</Select>
		</Field>
	</div>

	<Field label="Engaged?">
		<RadioGroup label="Engaged?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="engaged" value={opt.value} bind:group={f.engaged} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Fetal movements as reported by patient" inputId="fetalMovementsReported">
		<Select id="fetalMovementsReported" label="Fetal movements reported" bind:value={f.fetalMovementsReported}>
			<option value="">— Select —</option>
			<option value="normal">Normal pattern</option>
			<option value="increased">Increased</option>
			<option value="reduced">Reduced</option>
			<option value="absent">Absent</option>
			<option value="not-yet-felt">Not yet felt (early gestation)</option>
		</Select>
	</Field>

	<Field label="Fetal heart rate (bpm)" inputId="fetalHeartRate">
		<NumberInput id="fetalHeartRate" label="Fetal heart rate" min={80} max={200} bind:value={f.fetalHeartRate} />
	</Field>

	<Field label="Reduced fetal movements (clinically)?">
		<RadioGroup label="Reduced fetal movements (clinically)?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="reducedFetalMovements" value={opt.value} bind:group={f.reducedFetalMovements} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Growth concern (SGA / LGA / IUGR)?">
		<RadioGroup label="Growth concern?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="growthConcern" value={opt.value} bind:group={f.growthConcern} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if f.growthConcern === 'yes'}
		<Field label="Growth concern details" inputId="growthConcernDetails">
			<TextInput id="growthConcernDetails" label="Growth concern details" bind:value={f.growthConcernDetails} />
		</Field>
	{/if}

	<Field label="Other fetal notes" inputId="fetalNotes">
		<TextAreaInput id="fetalNotes" label="Other fetal notes" rows={3} placeholder="Any other observations about the fetus." bind:value={f.fetalNotes} />
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
