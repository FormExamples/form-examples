<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const a = assessment.data.asaAirway;

	// Mallampati class is numeric; bridge the string-valued <select> to a number.
	let mallampati = $state(a.mallampatiClass === null ? '' : String(a.mallampatiClass));
	$effect(() => {
		a.mallampatiClass = mallampati === '' ? null : Number(mallampati);
	});
</script>

<Fieldset legend="Step 3 of 12 — ASA & airway assessment">
	<p class="hint">ASA physical status and airway examination.</p>

	<Field label="ASA physical status" required inputId="asaAirway-asaStatus">
		<Select id="asaAirway-asaStatus" label="ASA physical status" required bind:value={a.asaStatus}>
			<option value="">— Select —</option>
			<option value="I">I — healthy</option>
			<option value="II">II — mild systemic disease</option>
			<option value="III">III — severe systemic disease</option>
			<option value="IV">IV — severe, constant threat to life</option>
			<option value="V">V — moribund</option>
			<option value="VI">VI — brain-dead organ donor</option>
		</Select>
	</Field>

	<Field label="ASA emergency (E) modifier?" inputId="asaAirway-asaEmergencyModifier">
		<Select id="asaAirway-asaEmergencyModifier" label="ASA emergency (E) modifier?" bind:value={a.asaEmergencyModifier}>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field label="Mallampati class" inputId="asaAirway-mallampatiClass">
		<Select id="asaAirway-mallampatiClass" label="Mallampati class" bind:value={mallampati}>
			<option value="">— Select —</option>
			<option value="1">1</option>
			<option value="2">2</option>
			<option value="3">3</option>
			<option value="4">4</option>
		</Select>
	</Field>

	<Field label="Mouth opening (cm)" inputId="asaAirway-mouthOpeningCm">
		<NumberInput id="asaAirway-mouthOpeningCm" label="Mouth opening (cm)" min={0} step="any" bind:value={a.mouthOpeningCm} />
	</Field>

	<Field label="Thyromental distance (cm)" inputId="asaAirway-thyromentalDistanceCm">
		<NumberInput id="asaAirway-thyromentalDistanceCm" label="Thyromental distance (cm)" min={0} step="any" bind:value={a.thyromentalDistanceCm} />
	</Field>

	<Field label="Dentition / loose teeth" inputId="asaAirway-dentition">
		<TextInput id="asaAirway-dentition" label="Dentition / loose teeth" placeholder="e.g. Intact; crown UL6" bind:value={a.dentition} />
	</Field>

	<Field
		label="Anticipated difficult airway?"
		description="A 'yes' raises a difficult-airway safety flag."
		inputId="asaAirway-anticipatedDifficultAirway"
	>
		<Select id="asaAirway-anticipatedDifficultAirway" label="Anticipated difficult airway?" bind:value={a.anticipatedDifficultAirway}>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field label="Prior difficult intubation?" inputId="asaAirway-priorDifficultIntubation">
		<Select id="asaAirway-priorDifficultIntubation" label="Prior difficult intubation?" bind:value={a.priorDifficultIntubation}>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>
</Fieldset>
