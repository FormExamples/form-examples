<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const c = assessment.data.context;
</script>

<Fieldset legend="Step 1 of 11 — Review context">
	<p class="hint">Who is reviewing, when, where, and how long since the last review.</p>

	<Field label="Reviewing clinician name" required inputId="context-reviewerName">
		<TextInput
			id="context-reviewerName"
			label="Reviewing clinician name"
			placeholder="e.g. Dr A. Rahman"
			required
			bind:value={c.reviewerName}
		/>
	</Field>

	<Field label="Reviewer role" required inputId="context-reviewerRole">
		<Select id="context-reviewerRole" label="Reviewer role" required bind:value={c.reviewerRole}>
			<option value="">— Select —</option>
			<option value="gp">General practitioner</option>
			<option value="practice-nurse">Practice nurse</option>
			<option value="epilepsy-nurse">Epilepsy specialist nurse</option>
			<option value="neurologist">Neurologist</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Date of review" inputId="context-reviewedAt">
		<DateInput id="context-reviewedAt" label="Date of review" bind:value={c.reviewedAt} />
	</Field>

	<Field label="Care setting" inputId="context-careSetting">
		<Select id="context-careSetting" label="Care setting" bind:value={c.careSetting}>
			<option value="">— Select —</option>
			<option value="general-practice">General practice</option>
			<option value="epilepsy-clinic">Epilepsy clinic</option>
			<option value="community">Community</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Review type" inputId="context-reviewType">
		<Select id="context-reviewType" label="Review type" bind:value={c.reviewType}>
			<option value="">— Select —</option>
			<option value="annual">Annual</option>
			<option value="interim">Interim</option>
		</Select>
	</Field>

	<Field
		label="Months since last review"
		description="More than 12 months raises a review-overdue flag."
		inputId="context-monthsSinceLastReview"
	>
		<NumberInput
			id="context-monthsSinceLastReview"
			label="Months since last review"
			min={0}
			max={120}
			step={0.5}
			placeholder="e.g. 12"
			bind:value={c.monthsSinceLastReview}
		/>
	</Field>
</Fieldset>
