<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import type { YesNo, PhysicalExamination } from '$lib/engine/types';

	const p = assessment.data.physicalExamination;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	type ExamKey = {
		[K in keyof PhysicalExamination]: PhysicalExamination[K] extends YesNo ? K : never;
	}[keyof PhysicalExamination];

	const findings: { key: ExamKey; label: string }[] = [
		{ key: 'peripheralEdema', label: 'Peripheral edema?' },
		{ key: 'pulmonaryEdema', label: 'Pulmonary edema (crackles)?' },
		{ key: 'jvdElevated', label: 'Elevated JVD?' },
		{ key: 'pallor', label: 'Pallor?' },
		{ key: 'uremicSkin', label: 'Uremic skin changes (dry, scratch marks, frost)?' },
		{ key: 'flankTenderness', label: 'Flank tenderness?' },
		{ key: 'palpableKidneys', label: 'Palpable kidneys?' },
		{ key: 'bladderDistension', label: 'Bladder distension?' }
	];
</script>

<Fieldset legend="Physical Examination">
	<p class="hint">Targeted exam findings relevant to kidney disease.</p>

	<div class="field-grid field-grid-3">
		<Field label="Systolic BP (mmHg)" inputId="systolicBp">
			<NumberInput id="systolicBp" label="Systolic BP" min={50} max={280} bind:value={p.systolicBp} />
		</Field>
		<Field label="Diastolic BP (mmHg)" inputId="diastolicBp">
			<NumberInput id="diastolicBp" label="Diastolic BP" min={30} max={180} bind:value={p.diastolicBp} />
		</Field>
		<Field label="Heart rate (bpm)" inputId="heartRate">
			<NumberInput id="heartRate" label="Heart rate" min={20} max={250} bind:value={p.heartRate} />
		</Field>
	</div>

	{#each findings as item (item.key)}
		<Field label={item.label}>
			<RadioGroup label={item.label}>
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name={item.key} value={opt.value} bind:group={p[item.key]} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}

	<Field label="Examination notes" inputId="examNotes">
		<TextAreaInput id="examNotes" label="Examination notes" rows={3} placeholder="Other relevant findings…" bind:value={p.examNotes} />
	</Field>
</Fieldset>

<style>
	.field-grid-3 {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.field-grid-3 {
			grid-template-columns: 1fr;
		}
	}
</style>
