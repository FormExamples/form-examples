<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateRosierGrade } from '$lib/engine/rosier-grader';
	import { pointColor, signed } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const m = assessment.data.mimics;
	const grade = $derived(calculateRosierGrade(assessment.data));
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const criteria = [
		{
			field: 'lossOfConsciousness' as const,
			label: 'Has there been loss of consciousness or syncope?',
			pointKey: 'lossOfConsciousnessPoint' as const
		},
		{
			field: 'seizureActivity' as const,
			label: 'Has there been seizure activity?',
			pointKey: 'seizureActivityPoint' as const
		}
	];
</script>

<Fieldset legend="Step 4 of 6 — Mimic exclusions">
	<p class="hint">
		Two common stroke mimics. Each answered "Yes" subtracts 1 point from the ROSIER total.
	</p>

	{#each criteria as c (c.field)}
		<Field label={c.label}>
			<RadioGroup label={c.label}>
				{#each yesNo as opt (opt.value)}
					<label>
						<input
							type="radio"
							class="radio-input"
							name={`mimics-${c.field}`}
							value={opt.value}
							bind:group={m[c.field]}
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
