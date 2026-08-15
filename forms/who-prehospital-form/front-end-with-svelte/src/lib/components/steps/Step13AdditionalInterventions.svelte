<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Checkbox from '#lib/components/ui/Checkbox.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';

	const a = assessment.data.additionalInterventions;
</script>

<Fieldset
	title="Additional Interventions"
	description="Medications given and procedures performed during prehospital care."
>
	<h3 class="mb-2 text-base font-semibold text-base-content">Medications given</h3>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<Checkbox
			label="Bronchodilators"
			name="medsBronchodilators"
			bind:checked={a.medsBronchodilators}
		/>
		<Checkbox label="Epinephrine" name="medsEpinephrine" bind:checked={a.medsEpinephrine} />
		<Checkbox label="Aspirin" name="medsAspirin" bind:checked={a.medsAspirin} />
		<Checkbox
			label="Seizure medication"
			name="medsSeizureMedication"
			bind:checked={a.medsSeizureMedication}
		/>
		<Checkbox label="Analgesia" name="medsAnalgesia" bind:checked={a.medsAnalgesia} />
		<Checkbox
			label="IV fluid infusion"
			name="medsIvFluidInfusion"
			bind:checked={a.medsIvFluidInfusion}
		/>
	</div>
	<TextInput label="Other medications" name="medsOther" bind:value={a.medsOther} />

	<h3 class="mt-4 mb-2 text-base font-semibold text-base-content">Procedures</h3>
	<div class="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
		<Checkbox
			label="Wound bandaging"
			name="procWoundBandaging"
			bind:checked={a.procWoundBandaging}
		/>
		<Checkbox label="Burn dressing" name="procBurnDressing" bind:checked={a.procBurnDressing} />
		<Checkbox
			label="Splinting / reduction"
			name="procSplintingReduction"
			bind:checked={a.procSplintingReduction}
		/>
		<Checkbox
			label="Pelvic stabilisation"
			name="procPelvicStabilization"
			bind:checked={a.procPelvicStabilization}
		/>
		<Checkbox label="ECG" name="procEcg" bind:checked={a.procEcg} />
	</div>
	<TextInput label="Other procedures" name="procOther" bind:value={a.procOther} />
</Fieldset>
