<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import YesNoNA from '#lib/components/ui/YesNoNA.svelte';

	const d = assessment.data.trainingCompetence;
</script>

<Fieldset legend="Training & Competence">
	<p class="hint">Mandatory training, fire marshals, infection control, induction.</p>

	<YesNoNA id="mandatoryTrainingUpToDate" label="Mandatory training is up to date for all staff." bind:value={d.mandatoryTrainingUpToDate} />
	<YesNoNA id="fireMarshalsTrained" label="Trained fire marshals are appointed and on rota." bind:value={d.fireMarshalsTrained} />
	<YesNoNA id="manualHandlingTrainingCurrent" label="Manual handling training is current for relevant staff." bind:value={d.manualHandlingTrainingCurrent} />
	<YesNoNA id="infectionControlTrainingCurrent" label="Infection control training is current." bind:value={d.infectionControlTrainingCurrent} />
	<YesNoNA id="trainingRecordsAccessible" label="Training records are accessible for audit." bind:value={d.trainingRecordsAccessible} />
	<YesNoNA id="inductionForNewStartersCompleted" label="Induction is completed for new starters." bind:value={d.inductionForNewStartersCompleted} />

	<Field label="Observations" inputId="trainObservations">
		<TextAreaInput id="trainObservations" label="Observations" rows={3} placeholder="Completion-rate snapshots, refresher schedules, etc.…" bind:value={d.observations} />
	</Field>
</Fieldset>
