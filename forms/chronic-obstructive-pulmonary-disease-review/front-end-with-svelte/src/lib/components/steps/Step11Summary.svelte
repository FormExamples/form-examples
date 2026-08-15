<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const n = assessment.data.note;
</script>

<Fieldset legend="Step 11 of 11 — Summary and classification">
	<p class="hint">
		The GOLD airflow grade, ABE group, symptom / exacerbation axes, and review completeness are
		computed on submit and shown in the report. Add a free-text clinician note below.
	</p>

	<Field label="Clinician note" inputId="note-clinicianNote">
		<TextAreaInput
			id="note-clinicianNote"
			label="Clinician note"
			rows={4}
			placeholder="Free-text summary: decisions made, therapy changes, referrals, and safety-netting advice."
			bind:value={n.clinicianNote}
		/>
	</Field>
</Fieldset>
