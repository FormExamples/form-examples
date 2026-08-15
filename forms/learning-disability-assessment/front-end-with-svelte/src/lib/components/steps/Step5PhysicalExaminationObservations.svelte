<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateBMI, bmiCategory } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const p = assessment.data.physicalExamination;

	$effect(() => {
		assessment.data.physicalExamination.bmi = calculateBMI(p.weight, p.height);
	});

	const yesNoUnknown = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' },
		{ value: 'unknown', label: 'Unknown' }
	];
</script>

<Fieldset legend="Physical Examination & Observations">
	<p class="hint">Vital signs, BMI, and national screening status.</p>

	<div class="field-grid field-grid-3">
		<Field label="Weight (kg)" inputId="weight">
			<NumberInput id="weight" label="Weight" min={1} max={400} bind:value={p.weight} />
		</Field>
		<Field label="Height (cm)" inputId="height">
			<NumberInput id="height" label="Height" min={50} max={250} bind:value={p.height} />
		</Field>
		<Field label="BMI" description="Auto-calculated">
			{#if p.bmi}
				<p class="bmi-value">{p.bmi} <span class="bmi-cat">({bmiCategory(p.bmi)})</span></p>
			{:else}
				<p class="bmi-value bmi-empty">—</p>
			{/if}
		</Field>
	</div>

	<div class="field-grid field-grid-3">
		<Field label="Systolic BP (mmHg)" inputId="bloodPressureSystolic">
			<NumberInput id="bloodPressureSystolic" label="Systolic BP" min={50} max={260} bind:value={p.bloodPressureSystolic} />
		</Field>
		<Field label="Diastolic BP (mmHg)" inputId="bloodPressureDiastolic">
			<NumberInput id="bloodPressureDiastolic" label="Diastolic BP" min={30} max={180} bind:value={p.bloodPressureDiastolic} />
		</Field>
		<Field label="Pulse (bpm)" inputId="pulse">
			<NumberInput id="pulse" label="Pulse" min={30} max={220} bind:value={p.pulse} />
		</Field>
	</div>

	<Field label="Vision check up to date?">
		<RadioGroup label="Vision check up to date?">
			{#each yesNoUnknown as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="visionChecked" value={opt.value} bind:group={p.visionChecked} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Hearing check up to date?">
		<RadioGroup label="Hearing check up to date?">
			{#each yesNoUnknown as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="hearingChecked" value={opt.value} bind:group={p.hearingChecked} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Dental check up to date?">
		<RadioGroup label="Dental check up to date?">
			{#each yesNoUnknown as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="dentalChecked" value={opt.value} bind:group={p.dentalChecked} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Vaccinations up to date?">
		<RadioGroup label="Vaccinations up to date?">
			{#each yesNoUnknown as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="vaccinationsUpToDate" value={opt.value} bind:group={p.vaccinationsUpToDate} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Cervical screening up to date (if applicable)?">
		<RadioGroup label="Cervical screening up to date?">
			{#each yesNoUnknown as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="cervicalScreening" value={opt.value} bind:group={p.cervicalScreening} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Breast screening up to date (if applicable)?">
		<RadioGroup label="Breast screening up to date?">
			{#each yesNoUnknown as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="breastScreening" value={opt.value} bind:group={p.breastScreening} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Bowel cancer screening up to date (if applicable)?">
		<RadioGroup label="Bowel cancer screening up to date?">
			{#each yesNoUnknown as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="bowelScreening" value={opt.value} bind:group={p.bowelScreening} /> {opt.label}</label>
			{/each}
		</RadioGroup>
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
	.bmi-value {
		margin: 0;
		font-weight: 500;
	}
	.bmi-cat {
		color: var(--color-base-content);
		opacity: 0.6;
		font-weight: 400;
	}
	.bmi-empty {
		opacity: 0.6;
	}
</style>
