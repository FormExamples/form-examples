<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateCssrsGrade } from '$lib/engine/cssrs-grader';
	import { ideationLevelLabel } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const ide = assessment.data.ideation;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
	const grade = $derived(calculateCssrsGrade(assessment.data));

	const items = [
		{
			key: 'wishToBeDead' as const,
			name: 'ideation-wishToBeDead',
			label: 'Q1 — Wish to be dead (level 1)',
			help: 'Passive wish to be dead or to go to sleep and not wake up.'
		},
		{
			key: 'nonSpecificActiveThoughts' as const,
			name: 'ideation-nonSpecificActiveThoughts',
			label: 'Q2 — Non-specific active suicidal thoughts (level 2)',
			help: 'General active thoughts of ending one’s life, without methods, intent, or plan.'
		},
		{
			key: 'activeIdeationMethods' as const,
			name: 'ideation-activeIdeationMethods',
			label: 'Q3 — Active ideation with any methods, no plan (level 3)',
			help: 'Thinking of at least one method, but without a specific plan or intent to act.'
		},
		{
			key: 'activeIdeationIntent' as const,
			name: 'ideation-activeIdeationIntent',
			label: 'Q4 — Active ideation with some intent to act (level 4)',
			help: 'Active thoughts with some intent to act, without a fully worked-out plan.'
		},
		{
			key: 'activeIdeationPlan' as const,
			name: 'ideation-activeIdeationPlan',
			label: 'Q5 — Active ideation with specific plan and intent (level 5)',
			help: 'Active thoughts with a specific plan AND intent to carry it out.'
		}
	];
</script>

<Fieldset legend="Step 3 of 8 — Suicidal ideation (Q1-Q5)">
	<p class="hint">
		Ask each item in ascending order and record it independently; the highest affirmative item sets
		the ideation level (0 when none are present).
	</p>

	{#each items as item (item.key)}
		<Field label={item.label} description={item.help}>
			<RadioGroup label={item.label}>
				{#each yesNo as opt (opt.value)}
					<label>
						<input
							type="radio"
							class="radio-input"
							name={item.name}
							value={opt.value}
							bind:group={ide[item.key]}
						/>
						{opt.label}
					</label>
				{/each}
			</RadioGroup>
		</Field>
	{/each}

	<Field label="Reference timeframe" inputId="ideation-ideationTimeframe">
		<Select
			id="ideation-ideationTimeframe"
			label="Reference timeframe"
			bind:value={ide.ideationTimeframe}
		>
			<option value="">— Select —</option>
			<option value="past-month">Past month (current risk)</option>
			<option value="lifetime-worst">Lifetime / worst point</option>
		</Select>
	</Field>

	<Field label="Live ideation level">
		<span class="inline-block rounded-full border border-base-300 bg-base-300 px-3 py-1 text-sm font-bold text-base-content">
			{ideationLevelLabel(grade.ideationLevel)}
		</span>
	</Field>
</Fieldset>
