<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { gradeBloodspot } from '$lib/engine/bloodspot-grader';
	import { CONDITIONS } from '$lib/engine/bloodspot-rules';
	import { outcomeColor, outcomeLabel, resultClassColor, resultClassLabel } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const conditions = assessment.data.conditions;
	const grade = $derived(gradeBloodspot(assessment.data));
</script>

<Fieldset legend="Step 6 of 7 — Condition results">
	<p class="hint">
		Record one result class per condition. Carrier is a valid result for sickle cell disease only.
		Any suspected result triggers an urgent specialist referral.
	</p>

	{#each CONDITIONS as cond (cond.code)}
		<Field label={`${cond.label} (${cond.short})`} inputId={`conditions-${cond.field}`}>
			<Select
				id={`conditions-${cond.field}`}
				label={`${cond.label} (${cond.short})`}
				bind:value={conditions[cond.field]}
			>
				<option value="">— Select —</option>
				<option value="not-suspected">Not suspected</option>
				<option value="suspected">Suspected</option>
				{#if cond.carrierValid}
					<option value="carrier">Carrier</option>
				{/if}
				<option value="repeat-required">Repeat required</option>
				<option value="declined">Declined</option>
				<option value="pending">Pending</option>
			</Select>
		</Field>
	{/each}

	<Field label="Live overall screening outcome">
		<span class="inline-flex flex-wrap items-center gap-3">
			<span
				class="inline-block rounded-full border px-3 py-1 text-sm font-bold {outcomeColor(
					grade.overallOutcome
				)}"
			>
				{outcomeLabel(grade.overallOutcome)}
			</span>
			{#if grade.referrals.length > 0}
				<span class="text-sm font-semibold text-error">
					{grade.referrals.length} urgent referral{grade.referrals.length === 1 ? '' : 's'}
				</span>
			{/if}
		</span>
	</Field>

	{#if grade.conditionResults.some((c) => c.result === 'suspected')}
		<p class="hint">
			Suspected: {grade.conditionResults
				.filter((c) => c.result === 'suspected')
				.map((c) => c.short)
				.join(', ')}
			<span
				class="ml-2 inline-block rounded-full border px-2 py-0.5 text-xs font-bold {resultClassColor(
					'suspected'
				)}">{resultClassLabel('suspected')}</span
			>
		</p>
	{/if}
</Fieldset>
