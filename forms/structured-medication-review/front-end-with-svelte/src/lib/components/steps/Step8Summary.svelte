<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import LiveStatus from '#lib/components/LiveStatus.svelte';

	const n = assessment.data.note;
</script>

<Fieldset legend="Step 8 of 8 — Summary and outputs">
	<p class="hint">
		The live burden indicator and review status, plus a free-text clinical note. Submit to generate
		the full report.
	</p>

	<Field label="Review summary">
		<LiveStatus />
	</Field>

	<Field label="Clinical note" inputId="note-clinicalNote">
		<TextAreaInput
			id="note-clinicalNote"
			label="Clinical note"
			rows={4}
			placeholder="Free-text clinical note: context, rationale, and any actions already taken."
			bind:value={n.clinicalNote}
		/>
	</Field>
</Fieldset>
