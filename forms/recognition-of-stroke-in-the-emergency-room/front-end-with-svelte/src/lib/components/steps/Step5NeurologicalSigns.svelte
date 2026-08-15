<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateRosierGrade } from '#lib/engine/rosier-grader.js';
	import { pointColor, signed } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const s = assessment.data.signs;
	const grade = $derived(calculateRosierGrade(assessment.data));
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const criteria = [
		{
			field: 'facialWeakness' as const,
			label: 'Is there new acute onset of asymmetric facial weakness?',
			pointKey: 'facialWeaknessPoint' as const
		},
		{
			field: 'armWeakness' as const,
			label: 'Is there new acute onset of asymmetric arm weakness?',
			pointKey: 'armWeaknessPoint' as const
		},
		{
			field: 'legWeakness' as const,
			label: 'Is there new acute onset of asymmetric leg weakness?',
			pointKey: 'legWeaknessPoint' as const
		},
		{
			field: 'speechDisturbance' as const,
			label: 'Is there new acute onset of speech disturbance?',
			pointKey: 'speechDisturbancePoint' as const
		},
		{
			field: 'visualFieldDefect' as const,
			label: 'Is there new acute onset of visual field defect?',
			pointKey: 'visualFieldDefectPoint' as const
		}
	];
</script>

<Fieldset legend="Step 5 of 6 — Neurological signs">
	<p class="hint">
		Five new, acute-onset neurological signs. Each answered "Yes" adds 1 point to the ROSIER total.
	</p>

	{#each criteria as c (c.field)}
		<Field label={c.label}>
			<RadioGroup label={c.label}>
				{#each yesNo as opt (opt.value)}
					<label>
						<input
							type="radio"
							class="radio-input"
							name={`signs-${c.field}`}
							value={opt.value}
							bind:group={s[c.field]}
						/>
						{opt.label}
					</label>
				{/each}
			</RadioGroup>
		</Field>

		<Field label="Point">
			<span
				class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointColor(
					grade[c.pointKey]
				)}"
			>
				{signed(grade[c.pointKey])} point {grade[c.pointKey] === 0 ? '(not present)' : '(present)'}
			</span>
		</Field>
	{/each}
</Fieldset>
