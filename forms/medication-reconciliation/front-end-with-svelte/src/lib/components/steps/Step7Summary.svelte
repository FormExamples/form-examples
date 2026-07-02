<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import LiveStatus from '$lib/components/LiveStatus.svelte';

	const n = assessment.data.note;
</script>

<Fieldset legend="Step 7 of 7 — Summary and sign-off">
	<p class="hint">
		The computed status and counts, plus a free-text clinical note. Submit to generate the full
		report.
	</p>

	<Field label="Reconciliation summary">
		<LiveStatus />
	</Field>

	<Field label="Clinical note and sign-off" inputId="note-clinicalNote">
		<TextAreaInput
			id="note-clinicalNote"
			label="Clinical note and sign-off"
			rows={4}
			placeholder="Free-text note: outstanding actions, escalation, and sign-off."
			bind:value={n.clinicalNote}
		/>
	</Field>
</Fieldset>
