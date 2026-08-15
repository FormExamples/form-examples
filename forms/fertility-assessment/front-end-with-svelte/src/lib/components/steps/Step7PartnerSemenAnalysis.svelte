<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const p = assessment.data.partnerSemen;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
	const smokingOptions = [
		{ value: 'never', label: 'Never' },
		{ value: 'former', label: 'Former' },
		{ value: 'current', label: 'Current' }
	];
	const alcoholOptions = [
		{ value: 'none', label: 'None' },
		{ value: 'low', label: 'Low' },
		{ value: 'moderate', label: 'Moderate' },
		{ value: 'heavy', label: 'Heavy' }
	];
</script>

<Fieldset legend="Partner Factors & Semen Analysis">
	<p class="hint">Partner lifestyle and WHO 2021 semen analysis (if completed).</p>

	<Field label="Partner age (years)" inputId="partnerSemen-partnerAgeYears">
		<NumberInput id="partnerSemen-partnerAgeYears" label="Partner age" min={0} max={100} bind:value={p.partnerAgeYears} />
	</Field>

	<Field label="Partner smoking status">
		<RadioGroup label="Partner smoking status">
			{#each smokingOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="partnerSmoking" value={opt.value} bind:group={p.partnerSmoking} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Partner alcohol intake">
		<RadioGroup label="Partner alcohol intake">
			{#each alcoholOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="partnerAlcohol" value={opt.value} bind:group={p.partnerAlcohol} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Partner occupational hazards" inputId="partnerSemen-partnerOccupationalHazards">
		<TextAreaInput id="partnerSemen-partnerOccupationalHazards" label="Partner occupational hazards" rows={2} placeholder="Heat, chemicals, radiation, prolonged sitting…" bind:value={p.partnerOccupationalHazards} />
	</Field>

	<Field label="Partner medical history relevant to fertility" inputId="partnerSemen-partnerMedicalHistory">
		<TextAreaInput id="partnerSemen-partnerMedicalHistory" label="Partner medical history" rows={3} placeholder="Mumps orchitis, varicocele, undescended testes, prior surgery…" bind:value={p.partnerMedicalHistory} />
	</Field>

	<Field label="Has the partner had a semen analysis?">
		<RadioGroup label="Has the partner had a semen analysis?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="semenAnalysisDone" value={opt.value} bind:group={p.semenAnalysisDone} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if p.semenAnalysisDone === 'yes'}
		<Field label="Semen analysis date" inputId="partnerSemen-semenAnalysisDate">
			<DateInput id="partnerSemen-semenAnalysisDate" label="Semen analysis date" bind:value={p.semenAnalysisDate} />
		</Field>

		<div class="field-grid">
			<Field label="Volume (mL)" inputId="partnerSemen-semenVolumeMl">
				<NumberInput id="partnerSemen-semenVolumeMl" label="Volume" min={0} max={20} step={0.1} bind:value={p.semenVolumeMl} />
			</Field>
			<Field label="Concentration (million / mL)" inputId="partnerSemen-semenConcentrationMillionPerMl">
				<NumberInput id="partnerSemen-semenConcentrationMillionPerMl" label="Concentration" min={0} max={500} step={0.1} bind:value={p.semenConcentrationMillionPerMl} />
			</Field>
		</div>

		<div class="field-grid field-grid-3">
			<Field label="Total motility (%)" inputId="partnerSemen-semenTotalMotilityPercent">
				<NumberInput id="partnerSemen-semenTotalMotilityPercent" label="Total motility" min={0} max={100} bind:value={p.semenTotalMotilityPercent} />
			</Field>
			<Field label="Progressive motility (%)" inputId="partnerSemen-semenProgressiveMotilityPercent">
				<NumberInput id="partnerSemen-semenProgressiveMotilityPercent" label="Progressive motility" min={0} max={100} bind:value={p.semenProgressiveMotilityPercent} />
			</Field>
			<Field label="Normal morphology (%)" inputId="partnerSemen-semenNormalMorphologyPercent">
				<NumberInput id="partnerSemen-semenNormalMorphologyPercent" label="Normal morphology" min={0} max={100} bind:value={p.semenNormalMorphologyPercent} />
			</Field>
		</div>

		<Field label="Semen analysis notes" inputId="partnerSemen-semenNotes">
			<TextAreaInput id="partnerSemen-semenNotes" label="Semen analysis notes" rows={3} bind:value={p.semenNotes} />
		</Field>
	{/if}
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
