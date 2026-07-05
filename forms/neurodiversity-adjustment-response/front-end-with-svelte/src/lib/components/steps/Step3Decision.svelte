<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;

	const isDecline = $derived(
		d.overallDecision === 'declined' || d.overallDecision === 'partially-agreed'
	);
</script>

<Fieldset legend="3. Decision">
	<p class="hint">
		The overall decision and its rationale. Where anything is declined, record the reasonableness
		category an employment tribunal would weigh.
	</p>

	<Field label="Overall decision" inputId="overallDecision" required>
		<Select id="overallDecision" label="Overall decision" bind:value={d.overallDecision} required>
			<option value="">Select…</option>
			<option value="agreed">Agreed</option>
			<option value="partially-agreed">Partially agreed</option>
			<option value="alternative-offered">Alternative offered</option>
			<option value="declined">Declined</option>
			<option value="deferred">Deferred</option>
		</Select>
	</Field>

	<Field
		label="Decision rationale"
		inputId="decisionRationale"
		description="Explain the decision, including the reasonableness justification where anything is declined."
	>
		<TextAreaInput
			id="decisionRationale"
			label="Decision rationale"
			rows={5}
			placeholder="Why this decision was reached, and the reasonableness justification for anything not agreed…"
			bind:value={d.decisionRationale}
		/>
	</Field>

	<Field
		label="Decline-reason category"
		inputId="declineReasonCategory"
		description="Only relevant where an adjustment is declined."
	>
		<Select
			id="declineReasonCategory"
			label="Decline-reason category"
			bind:value={d.declineReasonCategory}
		>
			<option value="">Not applicable</option>
			<option value="not-reasonable">Not reasonable</option>
			<option value="disproportionate-cost">Disproportionate cost</option>
			<option value="health-and-safety">Health and safety</option>
			<option value="operational-impact">Operational impact</option>
			<option value="alternative-provided">Alternative provided</option>
			<option value="insufficient-information">Insufficient information</option>
			<option value="none">None</option>
		</Select>
	</Field>

	{#if isDecline && d.decisionRationale.trim() === ''}
		<Alert type="warning" heading="Rationale strongly recommended">
			<p>
				Declining or partly declining adjustments for a worker likely covered by the Equality Act
				2010 without a recorded rationale or an alternative is the principal driver of
				discrimination risk. Record why, and offer alternatives where feasible.
			</p>
		</Alert>
	{/if}
</Fieldset>
