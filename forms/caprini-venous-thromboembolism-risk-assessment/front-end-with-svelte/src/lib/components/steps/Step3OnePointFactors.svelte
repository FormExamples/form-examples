<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateCapriniGrade } from '#lib/engine/caprini-grader.js';
	import { pointsColor } from '#lib/engine/utils.js';
	import type { YesNo } from '#lib/engine/types.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const s = assessment.data.onePoint as unknown as Record<string, YesNo>;
	const subtotal = $derived(calculateCapriniGrade(assessment.data).groupSubtotals['1-point']);

	const factors: { field: string; label: string }[] = [
		{ field: 'minorSurgery', label: 'Minor surgery planned (< 45 minutes)' },
		{ field: 'recentMajorSurgery', label: 'Major surgery within the past month' },
		{ field: 'varicoseVeins', label: 'Varicose veins' },
		{ field: 'inflammatoryBowelDisease', label: 'History of inflammatory bowel disease' },
		{ field: 'swollenLegs', label: 'Swollen legs (current oedema)' },
		{ field: 'obesity', label: 'Obesity (BMI >= 25)' },
		{ field: 'acuteMyocardialInfarction', label: 'Acute myocardial infarction' },
		{ field: 'congestiveHeartFailure', label: 'Congestive heart failure within the past month' },
		{ field: 'sepsis', label: 'Sepsis within the past month' },
		{
			field: 'seriousLungDisease',
			label: 'Serious lung disease including pneumonia within the past month'
		},
		{ field: 'abnormalPulmonaryFunction', label: 'Abnormal pulmonary function (e.g. COPD)' },
		{ field: 'medicalPatientBedRest', label: 'Medical patient currently on bed rest' },
		{ field: 'oralContraceptiveOrHrt', label: 'Oral contraceptive or hormone replacement therapy' },
		{ field: 'pregnancyOrPostpartum', label: 'Pregnancy or postpartum within the past month' },
		{
			field: 'adversePregnancyHistory',
			label: 'History of recurrent pregnancy loss or adverse pregnancy outcome'
		}
	];

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Step 3 of 8 — 1-point risk factors">
	<p class="hint">Each factor scores 1 point when present. Answer yes or no for each.</p>

	{#each factors as f (f.field)}
		<Field label={f.label}>
			<RadioGroup label={f.label}>
				{#each yesNo as opt (opt.value)}
					<label>
						<input
							type="radio"
							class="radio-input"
							name={`onePoint-${f.field}`}
							value={opt.value}
							bind:group={s[f.field]}
						/>
						{opt.label}
					</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}

	<Field label="1-point subtotal">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointsColor(subtotal)}">
			{subtotal} point{subtotal === 1 ? '' : 's'}
		</span>
	</Field>
</Fieldset>
