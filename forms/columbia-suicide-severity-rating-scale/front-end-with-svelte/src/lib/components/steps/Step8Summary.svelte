<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateCssrsGrade } from '$lib/engine/cssrs-grader';
	import { riskTierLabel, riskTierColor, ideationLevelLabel } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const s = assessment.data.summary;
	const grade = $derived(calculateCssrsGrade(assessment.data));
</script>

<Fieldset legend="Step 8 of 8 — Summary and risk tier">
	<p class="hint">
		The computed risk tier and ideation level update below. Add a free-text clinical note, then
		submit to generate the full report.
	</p>

	<Field label="Live risk tier">
		<span class="inline-flex flex-wrap items-center gap-3">
			<span
				class="inline-block rounded-full border px-3 py-1 text-sm font-bold {riskTierColor(
					grade.riskTier
				)}"
			>
				{riskTierLabel(grade.riskTier)}
			</span>
			<span class="text-sm text-base-content/70">{ideationLevelLabel(grade.ideationLevel)}</span>
		</span>
	</Field>

	<Field label="Behaviour and lethality summary">
		<span class="text-sm text-base-content/70">
			{grade.suicidalBehaviourPresent
				? grade.recentBehaviour
					? 'Suicidal behaviour present, within the past 3 months.'
					: 'Suicidal behaviour present, more than 3 months ago / lifetime.'
				: 'No suicidal behaviour recorded.'}
			{grade.highLethality ? ' High-lethality attempt.' : ''}
		</span>
	</Field>

	<Field label="Clinical note" inputId="summary-clinicalNote">
		<TextAreaInput
			id="summary-clinicalNote"
			label="Clinical note"
			rows={4}
			placeholder="Free-text clinical note: context, safety plan, escalation already actioned, and follow-up."
			bind:value={s.clinicalNote}
		/>
	</Field>
</Fieldset>
