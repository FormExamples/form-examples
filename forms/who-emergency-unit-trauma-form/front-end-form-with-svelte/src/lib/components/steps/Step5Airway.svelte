<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const a = assessment.data.airway;

	const spineOptions = [
		{ value: 'before-arrival', label: 'Done before arrival' },
		{ value: 'in-eu', label: 'Done in EU' },
		{ value: 'not-needed', label: 'Not needed' }
	];
</script>

<Fieldset
	title="Airway (A)"
	description="Primary survey — airway findings, obstruction, interventions and spine stabilisation."
>
	<Checkbox label="Normal (no abnormal findings)" name="airwayNormal" bind:checked={a.normal} />

	<h3 class="mt-4 mb-2 text-base font-semibold text-gray-800">Concerning findings</h3>
	<Checkbox label="Swelling" name="airwaySwelling" bind:checked={a.swelling} />
	<Checkbox label="Stridor" name="airwayStridor" bind:checked={a.stridor} />
	<Checkbox label="Voice changes" name="airwayVoiceChanges" bind:checked={a.voiceChanges} />
	<Checkbox label="Burns" name="airwayBurns" bind:checked={a.burns} />

	<h3 class="mt-4 mb-2 text-base font-semibold text-gray-800">Obstructed by</h3>
	<Checkbox label="Tongue" name="airwayObstructedTongue" bind:checked={a.obstructedByTongue} />
	<Checkbox label="Blood" name="airwayObstructedBlood" bind:checked={a.obstructedByBlood} />
	<Checkbox label="Secretion" name="airwayObstructedSecretion" bind:checked={a.obstructedBySecretion} />
	<Checkbox label="Vomit" name="airwayObstructedVomit" bind:checked={a.obstructedByVomit} />
	<Checkbox label="Foreign body" name="airwayObstructedForeignBody" bind:checked={a.obstructedByForeignBody} />

	<h3 class="mt-4 mb-2 text-base font-semibold text-gray-800">Interventions</h3>
	<Checkbox label="Repositioning" name="airwayInterventionRepositioning" bind:checked={a.interventionRepositioning} />
	<Checkbox label="Suction" name="airwayInterventionSuction" bind:checked={a.interventionSuction} />
	<Checkbox label="OPA (oropharyngeal airway)" name="airwayInterventionOpa" bind:checked={a.interventionOpa} />
	<Checkbox label="NPA (nasopharyngeal airway)" name="airwayInterventionNpa" bind:checked={a.interventionNpa} />
	<Checkbox label="LMA (laryngeal mask airway)" name="airwayInterventionLma" bind:checked={a.interventionLma} />
	<Checkbox label="BVM (bag-valve mask)" name="airwayInterventionBvm" bind:checked={a.interventionBvm} />
	<Checkbox label="ETT (endotracheal tube)" name="airwayInterventionEtt" bind:checked={a.interventionEtt} />

	<h3 class="mt-4 mb-2 text-base font-semibold text-gray-800">Spine stabilization</h3>
	<RadioGroup
		label="Spine stabilized"
		name="spineStabilized"
		options={spineOptions}
		bind:value={a.spineStabilized}
	/>

	<TextAreaInput label="Notes" name="airwayNotes" bind:value={a.notes} rows={2} />
</Fieldset>
