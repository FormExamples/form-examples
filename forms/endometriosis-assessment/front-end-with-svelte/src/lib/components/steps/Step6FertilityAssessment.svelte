<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const f = assessment.data.fertilityAssessment;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Fertility Assessment">
	<p class="hint">Conception history and fertility concerns.</p>

	<Field label="Currently trying to conceive?">
		<RadioGroup label="Currently trying to conceive?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="tryingToConceive" value={opt.value} bind:group={f.tryingToConceive} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if f.tryingToConceive === 'yes'}
		<Field label="Duration trying (months)" inputId="durationTryingMonths">
			<NumberInput id="durationTryingMonths" label="Duration trying" min={0} max={300} bind:value={f.durationTryingMonths} />
		</Field>
	{/if}

	<div class="field-grid">
		<Field label="Previous pregnancies" inputId="previousPregnancies">
			<NumberInput id="previousPregnancies" label="Previous pregnancies" min={0} max={30} bind:value={f.previousPregnancies} />
		</Field>
		<Field label="Live births" inputId="liveBirths">
			<NumberInput id="liveBirths" label="Live births" min={0} max={30} bind:value={f.liveBirths} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Miscarriages" inputId="miscarriages">
			<NumberInput id="miscarriages" label="Miscarriages" min={0} max={30} bind:value={f.miscarriages} />
		</Field>
		<Field label="Ectopic pregnancies" inputId="ectopicPregnancies">
			<NumberInput id="ectopicPregnancies" label="Ectopic pregnancies" min={0} max={30} bind:value={f.ectopicPregnancies} />
		</Field>
	</div>

	<Field label="Previous fertility treatment?">
		<RadioGroup label="Previous fertility treatment?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="previousFertilityTreatment" value={opt.value} bind:group={f.previousFertilityTreatment} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if f.previousFertilityTreatment === 'yes'}
		<Field label="Fertility treatment details" inputId="fertilityTreatmentDetails">
			<TextInput id="fertilityTreatmentDetails" label="Fertility treatment details" bind:value={f.fertilityTreatmentDetails} />
		</Field>
	{/if}

	<Field label="AMH level (pmol/L)" inputId="amhLevel">
		<NumberInput id="amhLevel" label="AMH level" min={0} max={200} step="0.1" bind:value={f.amhLevel} />
	</Field>

	<Field label="Partner semen analysis" inputId="partnerSemenAnalysis">
		<Select id="partnerSemenAnalysis" label="Partner semen analysis" bind:value={f.partnerSemenAnalysis}>
			<option value="">-- Select --</option>
			<option value="normal">Normal</option>
			<option value="abnormal">Abnormal</option>
			<option value="not-done">Not done</option>
		</Select>
	</Field>

	<Field label="Future fertility concerns?">
		<RadioGroup label="Future fertility concerns?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="futureFertilityConcerns" value={opt.value} bind:group={f.futureFertilityConcerns} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Fertility notes" inputId="fertilityNotes">
		<TextAreaInput id="fertilityNotes" label="Fertility notes" rows={2} bind:value={f.fertilityNotes} />
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
