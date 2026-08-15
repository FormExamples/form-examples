<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Checkbox from '#lib/components/ui/Checkbox.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const a = assessment.data.airway;
</script>

<Fieldset title="A — Airway" description="Airway assessment and intervention.">
	<h3 class="mb-2 text-base font-semibold text-base-content">Assessment</h3>
	<Checkbox
		label="Normal — airway is clear and patent"
		name="awNormal"
		bind:checked={a.assessmentNormal}
	/>
	<TextAreaInput
		label="Findings (e.g. obstruction, gurgling, stridor)"
		name="awFindings"
		bind:value={a.assessmentFindings}
		rows={3}
	/>

	<h3 class="mt-6 mb-2 text-base font-semibold text-base-content">Intervention</h3>
	<Checkbox
		label="Neck Immobilization"
		name="awNeckImmob"
		bind:checked={a.interventions.neckImmobilization}
	/>
	<Checkbox
		label="Head-Tilt Chin-Lift"
		name="awHeadTilt"
		bind:checked={a.interventions.headTiltChinLift}
	/>
	<Checkbox
		label="Jaw Thrust"
		name="awJawThrust"
		bind:checked={a.interventions.jawThrust}
	/>
	<Checkbox
		label="Choking Care"
		name="awChokingCare"
		bind:checked={a.interventions.chokingCare}
	/>
	<Checkbox label="None" name="awNone" bind:checked={a.interventions.none} />
</Fieldset>
