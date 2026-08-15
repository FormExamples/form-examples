<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import YesNoNA from '#lib/components/ui/YesNoNA.svelte';

	const d = assessment.data.ergonomicsManualHandling;
</script>

<Fieldset legend="Ergonomics & Manual Handling">
	<p class="hint">Manual handling assessments, lifting aids, DSE assessments, postural risks.</p>

	<YesNoNA id="manualHandlingAssessmentCurrent" label="Manual handling risk assessment is current." bind:value={d.manualHandlingAssessmentCurrent} />
	<YesNoNA id="liftingAidsAvailable" label="Lifting aids and hoists are available and serviced." bind:value={d.liftingAidsAvailable} />
	<YesNoNA id="dseAssessmentsCompleted" label="DSE (Display Screen Equipment) assessments completed for staff." bind:value={d.dseAssessmentsCompleted} />
	<YesNoNA id="workstationsAdjustable" label="Workstations are appropriately adjustable." bind:value={d.workstationsAdjustable} />
	<YesNoNA id="repetitiveStrainConcerns" label="No repetitive strain or postural concerns reported." bind:value={d.repetitiveStrainConcerns} />
	<YesNoNA id="patientHandlingPlansInPlace" label="Patient handling plans are in place where applicable." bind:value={d.patientHandlingPlansInPlace} />

	<Field label="Observations" inputId="ergoObservations">
		<TextAreaInput id="ergoObservations" label="Observations" rows={3} placeholder="Hoist service stickers, DSE returns rate, etc.…" bind:value={d.observations} />
	</Field>
</Fieldset>
