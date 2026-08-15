<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const d = assessment.data.recommendation;
</script>

<Fieldset legend="Recommendation (R) — Requested Action">
	<p class="hint">Be specific about what you are asking the receiving provider to do.</p>

	<Field label="Requested action" required inputId="requestedAction">
		<TextAreaInput
			id="requestedAction"
			label="Requested action"
			rows={3}
			required
			placeholder="e.g. Accept for HDU monitoring; review by gastroenterology within 4 hours."
			bind:value={d.requestedAction}
		/>
	</Field>

	<Field label="Expected outcomes / goals of transfer" inputId="expectedOutcomes">
		<TextAreaInput id="expectedOutcomes" label="Expected outcomes / goals of transfer" rows={2} bind:value={d.expectedOutcomes} />
	</Field>

	<Field label="Ongoing care plan" required inputId="ongoingCarePlan">
		<TextAreaInput
			id="ongoingCarePlan"
			label="Ongoing care plan"
			rows={3}
			required
			placeholder="Treatments to continue, reviews booked, escalation plan."
			bind:value={d.ongoingCarePlan}
		/>
	</Field>

	<Field label="Pending results / follow-up" inputId="pendingResults">
		<TextAreaInput
			id="pendingResults"
			label="Pending results / follow-up"
			rows={2}
			placeholder="Tests booked, samples sent, results outstanding and how to chase them."
			bind:value={d.pendingResults}
		/>
	</Field>
</Fieldset>
