<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const a = assessment.data.airway;
</script>

<Fieldset
	title="Airway (A)"
	description="Primary survey — airway findings, obstruction and interventions."
>
	<Checkbox label="Normal (no abnormal findings)" name="airwayNormal" bind:checked={a.normal} />

	<h3 class="mt-4 mb-2 text-base font-semibold text-base-content">Findings</h3>
	<Checkbox label="Angioedema" name="airwayAngioedema" bind:checked={a.angioedema} />
	<Checkbox label="Stridor" name="airwayStridor" bind:checked={a.stridor} />
	<Checkbox label="Voice changes" name="airwayVoiceChanges" bind:checked={a.voiceChanges} />
	<Checkbox label="Oral / airway burns" name="airwayBurns" bind:checked={a.oralAirwayBurns} />

	<h3 class="mt-4 mb-2 text-base font-semibold text-base-content">Obstructed by</h3>
	<Checkbox label="Tongue" name="airwayObstructedTongue" bind:checked={a.obstructedByTongue} />
	<Checkbox label="Blood" name="airwayObstructedBlood" bind:checked={a.obstructedByBlood} />
	<Checkbox label="Secretions" name="airwayObstructedSecretions" bind:checked={a.obstructedBySecretions} />
	<Checkbox label="Vomit" name="airwayObstructedVomit" bind:checked={a.obstructedByVomit} />
	<Checkbox label="Foreign body" name="airwayObstructedForeignBody" bind:checked={a.obstructedByForeignBody} />

	<h3 class="mt-4 mb-2 text-base font-semibold text-base-content">Interventions</h3>
	<Checkbox label="Repositioning" name="airwayInterventionRepositioning" bind:checked={a.interventionRepositioning} />
	<Checkbox label="Suction" name="airwayInterventionSuction" bind:checked={a.interventionSuction} />
	<Checkbox label="OPA (oropharyngeal airway)" name="airwayInterventionOpa" bind:checked={a.interventionOpa} />
	<Checkbox label="NPA (nasopharyngeal airway)" name="airwayInterventionNpa" bind:checked={a.interventionNpa} />
	<Checkbox label="LMA (laryngeal mask airway)" name="airwayInterventionLma" bind:checked={a.interventionLma} />
	<Checkbox label="BVM (bag-valve mask)" name="airwayInterventionBvm" bind:checked={a.interventionBvm} />
	<Checkbox label="ETT (endotracheal tube)" name="airwayInterventionEtt" bind:checked={a.interventionEtt} />

	<TextAreaInput label="Notes" name="airwayNotes" bind:value={a.notes} rows={2} />
</Fieldset>
