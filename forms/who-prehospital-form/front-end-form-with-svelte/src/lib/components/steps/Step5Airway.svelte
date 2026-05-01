<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import SectionCard from '$lib/components/ui/SectionCard.svelte';
	import Checkbox from '$lib/components/ui/Checkbox.svelte';
	import TextArea from '$lib/components/ui/TextArea.svelte';

	const a = assessment.data.airway;
</script>

<SectionCard
	title="Airway (A)"
	description="Primary survey: airway assessment and interventions."
>
	<Checkbox label="Normal (NML)" name="airwayNormal" bind:checked={a.normal} />

	<h3 class="mt-4 mb-2 text-base font-semibold text-gray-800">Findings</h3>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<Checkbox label="Voice changes" name="voiceChanges" bind:checked={a.voiceChanges} />
		<Checkbox label="Stridor" name="airwayStridor" bind:checked={a.stridor} />
		<Checkbox
			label="Oral / airway burns"
			name="oralAirwayBurns"
			bind:checked={a.oralAirwayBurns}
		/>
		<Checkbox label="Angioedema" name="angioedema" bind:checked={a.angioedema} />
	</div>

	<h3 class="mt-4 mb-2 text-base font-semibold text-gray-800">Obstructed by</h3>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<Checkbox
			label="Tongue"
			name="obstructedByTongue"
			bind:checked={a.obstructedByTongue}
		/>
		<Checkbox
			label="Blood"
			name="obstructedByBlood"
			bind:checked={a.obstructedByBlood}
		/>
		<Checkbox
			label="Secretions"
			name="obstructedBySecretions"
			bind:checked={a.obstructedBySecretions}
		/>
		<Checkbox
			label="Vomit"
			name="obstructedByVomit"
			bind:checked={a.obstructedByVomit}
		/>
		<Checkbox
			label="Foreign body"
			name="obstructedByForeignBody"
			bind:checked={a.obstructedByForeignBody}
		/>
	</div>

	<h3 class="mt-4 mb-2 text-base font-semibold text-gray-800">Airway interventions</h3>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<Checkbox
			label="Repositioning"
			name="interventionRepositioning"
			bind:checked={a.interventionRepositioning}
		/>
		<Checkbox
			label="Suction"
			name="interventionSuction"
			bind:checked={a.interventionSuction}
		/>
		<Checkbox label="OPA" name="interventionOpa" bind:checked={a.interventionOpa} />
		<Checkbox label="NPA" name="interventionNpa" bind:checked={a.interventionNpa} />
		<Checkbox label="LMA" name="interventionLma" bind:checked={a.interventionLma} />
		<Checkbox label="BVM" name="interventionBvm" bind:checked={a.interventionBvm} />
		<Checkbox label="ETT" name="interventionEtt" bind:checked={a.interventionEtt} />
	</div>

	<h3 class="mt-4 mb-2 text-base font-semibold text-gray-800">C-spine stabilisation</h3>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<Checkbox label="Not needed" name="cSpineNotNeeded" bind:checked={a.cSpineNotNeeded} />
		<Checkbox label="Done" name="cSpineDone" bind:checked={a.cSpineDone} />
	</div>

	<TextArea label="Notes" name="airwayNotes" bind:value={a.notes} rows={2} />
</SectionCard>
