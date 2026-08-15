<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateCapriniGrade } from '#lib/engine/caprini-grader.js';
	import { pointsColor } from '#lib/engine/utils.js';
	import type { YesNo } from '#lib/engine/types.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const s = assessment.data.twoPoint as unknown as Record<string, YesNo>;
	const subtotal = $derived(calculateCapriniGrade(assessment.data).groupSubtotals['2-point']);

	const factors: { field: string; label: string }[] = [
		{ field: 'arthroscopicSurgery', label: 'Arthroscopic surgery' },
		{ field: 'majorOpenSurgery', label: 'Major open surgery (> 45 minutes)' },
		{ field: 'laparoscopicSurgery', label: 'Laparoscopic surgery (> 45 minutes)' },
		{ field: 'malignancy', label: 'Malignancy (present or previous)' },
		{ field: 'confinedToBed', label: 'Confined to bed (> 72 hours)' },
		{ field: 'immobilisingCast', label: 'Immobilising plaster cast' },
		{ field: 'centralVenousAccess', label: 'Central venous access (central line)' }
	];

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Step 4 of 8 — 2-point risk factors">
	<p class="hint">Each factor scores 2 points when present. Answer yes or no for each.</p>

	{#each factors as f (f.field)}
		<Field label={f.label}>
			<RadioGroup label={f.label}>
				{#each yesNo as opt (opt.value)}
					<label>
						<input
							type="radio"
							class="radio-input"
							name={`twoPoint-${f.field}`}
							value={opt.value}
							bind:group={s[f.field]}
						/>
						{opt.label}
					</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}

	<Field label="2-point subtotal">
		<span class="inline-block rounded-full border px-3 py-1 text-sm font-bold {pointsColor(subtotal)}">
			{subtotal} point{subtotal === 1 ? '' : 's'}
		</span>
	</Field>
</Fieldset>
