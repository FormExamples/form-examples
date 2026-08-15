<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import LiveStatus from '#lib/components/LiveStatus.svelte';

	const s = assessment.data.summary;
</script>

<Fieldset legend="Step 8 of 8 — Summary and completeness">
	<p class="hint">
		The computed care-plan status, completeness percent, and flagged issues, plus a handover note.
		Submit to generate the full report.
	</p>

	<Field label="Completeness summary">
		<LiveStatus />
	</Field>

	<Field label="Handover note and sign-off" inputId="summary-handoverNote">
		<TextAreaInput
			id="summary-handoverNote"
			label="Handover note and sign-off"
			rows={4}
			placeholder="Free-text note for handover: outstanding actions, escalation, and sign-off."
			bind:value={s.handoverNote}
		/>
	</Field>

	<Field label="Overall plan review date" inputId="summary-reviewDate">
		<TextInput
			id="summary-reviewDate"
			label="Overall plan review date"
			type="date"
			class="date-input"
			bind:value={s.reviewDate}
		/>
	</Field>
</Fieldset>
