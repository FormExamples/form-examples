<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import LikertItem from '#lib/components/ui/LikertItem.svelte';
	import { surveyItems, RETENTION_INTENT_OPTIONS } from '#lib/engine/rules.js';
	import type { LikertValue } from '#lib/engine/types.js';

	const d = assessment.data.overall;
	const likert = d as unknown as Record<string, LikertValue>;
	const items = surveyItems.filter((it) => it.domain === 'overall');
	const enpsScale = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
</script>

<Fieldset legend="Overall Experience & Retention Intent">
	<p class="hint">
		Your overall view of working here, plus an eNPS-style recommendation question
		and your retention intent.
	</p>

	{#each items as item (item.id)}
		<LikertItem id={item.id} label={item.label} bind:value={likert[item.id]} />
	{/each}

	<Field
		label="On a scale of 0–10, how likely are you to recommend this organisation as a place to work?"
		inputId="recommendScore-0"
	>
		<RadioGroup label="Recommend score from 0 to 10">
			<div class="enps-scale">
				{#each enpsScale as n (n)}
					<label class="enps-option">
						<input
							type="radio"
							class="radio-input"
							id={`recommendScore-${n}`}
							name="recommendScore"
							value={n}
							bind:group={d.recommendScore}
						/>
						<span>{n}</span>
					</label>
				{/each}
			</div>
		</RadioGroup>
	</Field>

	<Field label="Retention intent" inputId="retentionIntent">
		<Select id="retentionIntent" label="Retention intent" bind:value={d.retentionIntent}>
			<option value="">-- Select --</option>
			{#each RETENTION_INTENT_OPTIONS as opt (opt.value)}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</Select>
	</Field>

	<Field
		label="What is the single most important thing we could do to improve your experience?"
		description="Optional. Please do not include any identifying details."
		inputId="suggestionsForImprovement"
	>
		<TextAreaInput
			id="suggestionsForImprovement"
			label="Suggestions for improvement"
			rows={3}
			bind:value={d.suggestionsForImprovement}
		/>
	</Field>

	<Field
		label="Any other comments?"
		description="Optional. Please do not include any identifying details."
		inputId="otherComments"
	>
		<TextAreaInput
			id="otherComments"
			label="Other comments"
			rows={3}
			bind:value={d.otherComments}
		/>
	</Field>
</Fieldset>

<style>
	.enps-scale {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1rem;
	}
	.enps-option {
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		font-size: 0.875rem;
	}
</style>
