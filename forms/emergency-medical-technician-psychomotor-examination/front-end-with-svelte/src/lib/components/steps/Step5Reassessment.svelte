<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TriStateField from '#lib/components/ui/TriStateField.svelte';

	const d = assessment.data.reassessment;
</script>

<Fieldset legend="Reassessment">
	<p class="hint">Ongoing reassessment of the patient and the effectiveness of interventions.</p>

	<TriStateField label="Repeats mental-status assessment." name="repeatsMentalStatus" bind:value={d.repeatsMentalStatus} />
	<TriStateField label="Repeats airway assessment." name="repeatsAirway" bind:value={d.repeatsAirway} />
	<TriStateField label="Repeats breathing assessment." name="repeatsBreathing" bind:value={d.repeatsBreathing} />
	<TriStateField label="Repeats circulation assessment." name="repeatsCirculation" bind:value={d.repeatsCirculation} />
	<TriStateField label="Repeats and records vital signs." name="repeatsVitals" bind:value={d.repeatsVitals} />
	<TriStateField label="Repeats focused assessment regarding patient complaint or injuries." name="repeatsFocusedExam" bind:value={d.repeatsFocusedExam} />
	<TriStateField label="Evaluates effectiveness of interventions and adjusts as needed." name="evaluatesInterventions" bind:value={d.evaluatesInterventions} />
	<TriStateField label="Manages and reassesses transport interventions en route." name="transportInterventions" bind:value={d.transportInterventions} />
	<TriStateField
		label="Provides patient hand-off / radio report within 15 minutes of arrival on scene."
		name="fifteenMinuteCall"
		critical
		bind:value={d.fifteenMinuteCall}
	/>
</Fieldset>
