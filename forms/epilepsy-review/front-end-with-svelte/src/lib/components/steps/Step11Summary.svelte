<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const s = assessment.data.summary;
</script>

<Fieldset legend="Step 11 of 11 — Summary and care plan">
	<p class="hint">
		The agreed care plan and clinician note. Seizure control and review completeness are computed on
		submit.
	</p>

	<Field label="Specialist (neurology) review needed" inputId="summary-specialistReviewNeeded">
		<Select
			id="summary-specialistReviewNeeded"
			label="Specialist (neurology) review needed"
			bind:value={s.specialistReviewNeeded}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field label="Next review due" inputId="summary-nextReviewDue">
		<DateInput id="summary-nextReviewDue" label="Next review due" bind:value={s.nextReviewDue} />
	</Field>

	<Field label="Care plan" inputId="summary-carePlan">
		<TextAreaInput
			id="summary-carePlan"
			label="Care plan"
			rows={4}
			placeholder="Agreed self-management and rescue plan, planned medication changes, and recall interval."
			bind:value={s.carePlan}
		/>
	</Field>

	<Field label="Review context / clinician note" inputId="summary-reviewContext">
		<TextAreaInput
			id="summary-reviewContext"
			label="Review context / clinician note"
			rows={4}
			placeholder="Free-text summary drawing the review together."
			bind:value={s.reviewContext}
		/>
	</Field>
</Fieldset>
