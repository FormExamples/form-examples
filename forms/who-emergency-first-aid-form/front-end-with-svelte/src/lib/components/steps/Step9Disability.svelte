<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const d = assessment.data.disability;
</script>

<Fieldset
	title="D — Disability"
	description="Neurological assessment and intervention."
>
	<h3 class="mb-2 text-base font-semibold text-base-content">Assessment</h3>
	<Checkbox
		label="Normal — alert, oriented, no neurological deficit"
		name="dsNormal"
		bind:checked={d.assessmentNormal}
	/>
	<TextAreaInput
		label="Findings (e.g. AVPU level, pupils, focal deficit, glucose, temperature)"
		name="dsFindings"
		bind:value={d.assessmentFindings}
		rows={3}
	/>

	<h3 class="mt-6 mb-2 text-base font-semibold text-base-content">Intervention</h3>
	<Checkbox
		label="Spinal Immobilisation"
		name="dsSpinalImmob"
		bind:checked={d.interventions.spinalImmobilisation}
	/>
	<Checkbox
		label="Glucose Given"
		name="dsGlucose"
		bind:checked={d.interventions.glucoseGiven}
	/>
	<Checkbox
		label="Seizure Care"
		name="dsSeizureCare"
		bind:checked={d.interventions.seizureCare}
	/>
	<Checkbox
		label="High Temperature Care"
		name="dsHighTemp"
		bind:checked={d.interventions.highTemperatureCare}
	/>
	<Checkbox
		label="Low Temperature Care"
		name="dsLowTemp"
		bind:checked={d.interventions.lowTemperatureCare}
	/>
	<Checkbox label="None" name="dsNone" bind:checked={d.interventions.none} />
</Fieldset>
