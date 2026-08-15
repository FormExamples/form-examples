<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import ActionPlanEntry from '#lib/components/ui/ActionPlanEntry.svelte';

	const h = assessment.data.healthActionPlan;
</script>

<Fieldset legend="Health Action Plan">
	<p class="hint">List actions agreed with the person, who owns each, and when they are due.</p>

	<Field label="Health actions">
		<ActionPlanEntry bind:actions={h.actions} />
	</Field>

	<Field label="Next review date" inputId="nextReviewDate">
		<DateInput id="nextReviewDate" label="Next review date" bind:value={h.nextReviewDate} />
	</Field>

	<Field label="Plan shared with" inputId="sharedWith">
		<TextInput id="sharedWith" label="Plan shared with" placeholder="e.g. carer, GP, day service" bind:value={h.sharedWith} />
	</Field>

	<Field label="Plan notes" inputId="planNotes">
		<TextAreaInput id="planNotes" label="Plan notes" rows={4} placeholder="Anything else that supports the plan…" bind:value={h.planNotes} />
	</Field>
</Fieldset>
