<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateCapriniGrade } from '$lib/engine/caprini-grader';
	import { pointsColor } from '$lib/engine/utils';
	import type { YesNo } from '$lib/engine/types';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const s = assessment.data.fivePoint as unknown as Record<string, YesNo>;
	const subtotal = $derived(calculateCapriniGrade(assessment.data).groupSubtotals['5-point']);

	const factors: { field: string; label: string }[] = [
		{ field: 'stroke', label: 'Stroke within the past month' },
		{ field: 'electiveArthroplasty', label: 'Elective arthroplasty (hip or knee replacement)' },
		{ field: 'hipPelvisLegFracture', label: 'Hip, pelvis, or leg fracture' },
		{
			field: 'acuteSpinalCordInjury',
			label: 'Acute spinal cord injury with paralysis within the past month'
		},
		{ field: 'multipleTrauma', label: 'Multiple trauma within the past month' }
	];

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Step 6 of 8 — 5-point risk factors">
	<p class="hint">Each factor scores 5 points when present. Answer yes or no for each.</p>

	{#each factors as f (f.field)}
		<Field label={f.label}>
			<RadioGroup label={f.label}>
				{#each yesNo as opt (opt.value)}
					<label>
						<input
							type="radio"
							class="radio-input"
							name={`fivePoint-${f.field}`}
							value={opt.value}
							bind:group={s[f.field]}
						/>
						{opt.label}
					</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}

	<Field label="5-point subtotal">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointsColor(subtotal)}">
			{subtotal} point{subtotal === 1 ? '' : 's'}
		</span>
	</Field>
</Fieldset>
