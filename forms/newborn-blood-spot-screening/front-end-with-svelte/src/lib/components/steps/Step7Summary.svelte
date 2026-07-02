<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { gradeBloodspot } from '$lib/engine/bloodspot-grader';
	import { outcomeColor, outcomeLabel, referralStatusLabel } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const m = assessment.data.summary;
	const grade = $derived(gradeBloodspot(assessment.data));
</script>

<Fieldset legend="Step 7 of 7 — Summary and outcome">
	<p class="hint">
		Live overall screening outcome and a free-text clinical context. Submit to generate the full
		report.
	</p>

	<Field label="Live overall screening outcome">
		<span class="inline-flex flex-wrap items-center gap-3">
			<span
				class="inline-block rounded-full border px-3 py-1 text-sm font-bold {outcomeColor(
					grade.overallOutcome
				)}"
			>
				{outcomeLabel(grade.overallOutcome)}
			</span>
			<span class="text-sm text-base-content/70">
				Referral status: {referralStatusLabel(grade.referralStatus)}
				{#if grade.ageAtSampleDays !== null}
					· age at sample: day {grade.ageAtSampleDays}
				{/if}
			</span>
		</span>
	</Field>

	<Field label="Clinical context" inputId="summary-clinicalContext">
		<TextAreaInput
			id="summary-clinicalContext"
			label="Clinical context"
			rows={4}
			placeholder="Free-text clinical context: findings, decisions, and any referral already actioned."
			bind:value={m.clinicalContext}
		/>
	</Field>
</Fieldset>
