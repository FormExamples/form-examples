<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TriStateField from '#lib/components/ui/TriStateField.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const d = assessment.data.criticalCriteriaReview;
</script>

<Fieldset legend="Critical Criteria Review & Overall Result">
	<p class="hint">
		Final critical-criteria checks. Both items are phrased positively, so "Performed" means the
		candidate met the criterion; any "Not performed" forces an automatic Fail.
	</p>

	<TriStateField
		label="Did NOT perform any dangerous or harmful intervention."
		name="dangerousIntervention"
		critical
		bind:value={d.dangerousIntervention}
	/>
	<TriStateField
		label="Provided spinal protection when indicated by MOI."
		name="spinalProtection"
		critical
		bind:value={d.spinalProtection}
	/>

	<Field label="Examiner notes" inputId="examinerNotes">
		<TextAreaInput id="examinerNotes" label="Examiner notes" rows={3} bind:value={d.examinerNotes} />
	</Field>
	<Field label="Debrief notes" inputId="debriefNotes">
		<TextAreaInput id="debriefNotes" label="Debrief notes" rows={3} bind:value={d.debriefNotes} />
	</Field>
</Fieldset>
