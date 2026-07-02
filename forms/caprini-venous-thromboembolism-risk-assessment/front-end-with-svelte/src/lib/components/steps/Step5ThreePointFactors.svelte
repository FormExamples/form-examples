<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateCapriniGrade } from '$lib/engine/caprini-grader';
	import { pointsColor } from '$lib/engine/utils';
	import type { YesNo } from '$lib/engine/types';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const s = assessment.data.threePoint as unknown as Record<string, YesNo>;
	const subtotal = $derived(calculateCapriniGrade(assessment.data).groupSubtotals['3-point']);

	const factors: { field: string; label: string }[] = [
		{ field: 'historyOfVte', label: 'Personal history of venous thromboembolism (DVT or PE)' },
		{ field: 'familyHistoryOfThrombosis', label: 'Family history of thrombosis' },
		{ field: 'factorVLeiden', label: 'Factor V Leiden mutation' },
		{ field: 'prothrombin20210a', label: 'Prothrombin 20210A mutation' },
		{ field: 'lupusAnticoagulant', label: 'Lupus anticoagulant positive' },
		{ field: 'anticardiolipinAntibodies', label: 'Elevated anticardiolipin antibodies' },
		{ field: 'elevatedHomocysteine', label: 'Elevated serum homocysteine' },
		{ field: 'heparinInducedThrombocytopenia', label: 'Heparin-induced thrombocytopenia (HIT)' },
		{ field: 'otherThrombophilia', label: 'Other congenital or acquired thrombophilia' }
	];

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Step 5 of 8 — 3-point risk factors">
	<p class="hint">Each factor scores 3 points when present. Answer yes or no for each.</p>

	{#each factors as f (f.field)}
		<Field label={f.label}>
			<RadioGroup label={f.label}>
				{#each yesNo as opt (opt.value)}
					<label>
						<input
							type="radio"
							class="radio-input"
							name={`threePoint-${f.field}`}
							value={opt.value}
							bind:group={s[f.field]}
						/>
						{opt.label}
					</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}

	<Field label="3-point subtotal">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointsColor(subtotal)}">
			{subtotal} point{subtotal === 1 ? '' : 's'}
		</span>
	</Field>
</Fieldset>
