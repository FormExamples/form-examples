<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Checkbox from '#lib/components/ui/Checkbox.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const e = assessment.data.exposure;
</script>

<Fieldset
	title="E — Exposure / Other"
	description="Exposure assessment, intervention, and any medication taken by the patient."
>
	<h3 class="mb-2 text-base font-semibold text-base-content">Assessment</h3>
	<Checkbox
		label="Normal — no exposure-related findings"
		name="exNormal"
		bind:checked={e.assessmentNormal}
	/>
	<TextAreaInput
		label="Findings (e.g. burns, environmental exposure, wounds, bite)"
		name="exFindings"
		bind:value={e.assessmentFindings}
		rows={3}
	/>

	<h3 class="mt-6 mb-2 text-base font-semibold text-base-content">Intervention</h3>
	<Checkbox
		label="Recovery Position"
		name="exRecovery"
		bind:checked={e.interventions.recoveryPosition}
	/>
	<Checkbox
		label="Burn Care"
		name="exBurnCare"
		bind:checked={e.interventions.burnCare}
	/>
	<Checkbox
		label="Wound Care"
		name="exWoundCare"
		bind:checked={e.interventions.woundCare}
	/>
	<Checkbox
		label="Drowning Care"
		name="exDrowningCare"
		bind:checked={e.interventions.drowningCare}
	/>
	<Checkbox
		label="Snakebite Care"
		name="exSnakebiteCare"
		bind:checked={e.interventions.snakebiteCare}
	/>
	<Checkbox label="None" name="exNone" bind:checked={e.interventions.none} />

	<h3 class="mt-6 mb-2 text-base font-semibold text-base-content">
		Any medication taken?
	</h3>
	<Checkbox
		label="None"
		name="exMedNone"
		bind:checked={e.medicationTakenNone}
	/>
	<TextAreaInput
		label="Describe medications taken (name, dose, time)"
		name="exMedDetails"
		bind:value={e.medicationTakenDetails}
		rows={3}
	/>
</Fieldset>
