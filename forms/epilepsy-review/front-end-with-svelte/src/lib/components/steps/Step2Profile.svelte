<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const p = assessment.data.profile;
</script>

<Fieldset legend="Step 2 of 11 — Patient and epilepsy profile">
	<p class="hint">Identifier, demographics, and the epilepsy diagnosis.</p>

	<Field label="Patient identifier" required inputId="profile-patientIdentifier">
		<TextInput
			id="profile-patientIdentifier"
			label="Patient identifier"
			placeholder="e.g. NHS 943 476 5919 or local MRN"
			required
			bind:value={p.patientIdentifier}
		/>
	</Field>

	<Field label="Age band" inputId="profile-ageBand">
		<Select id="profile-ageBand" label="Age band" bind:value={p.ageBand}>
			<option value="">— Select —</option>
			<option value="18-39">18-39</option>
			<option value="40-59">40-59</option>
			<option value="60-79">60-79</option>
			<option value=">=80">80 and over</option>
		</Select>
	</Field>

	<Field label="Sex" inputId="profile-sex">
		<Select id="profile-sex" label="Sex" bind:value={p.sex}>
			<option value="">— Select —</option>
			<option value="female">Female</option>
			<option value="male">Male</option>
			<option value="intersex">Intersex</option>
			<option value="unknown">Unknown</option>
		</Select>
	</Field>

	<Field label="Epilepsy type / syndrome" inputId="profile-epilepsyType">
		<Select id="profile-epilepsyType" label="Epilepsy type / syndrome" bind:value={p.epilepsyType}>
			<option value="">— Select —</option>
			<option value="focal">Focal</option>
			<option value="generalised">Generalised</option>
			<option value="combined">Combined</option>
			<option value="unknown">Unknown</option>
		</Select>
	</Field>

	<Field label="Age at onset (years)" inputId="profile-ageAtOnset">
		<NumberInput
			id="profile-ageAtOnset"
			label="Age at onset (years)"
			min={0}
			max={120}
			step={1}
			placeholder="e.g. 24"
			bind:value={p.ageAtOnset}
		/>
	</Field>

	<Field label="Years since diagnosis" inputId="profile-yearsSinceDiagnosis">
		<NumberInput
			id="profile-yearsSinceDiagnosis"
			label="Years since diagnosis"
			min={0}
			max={120}
			step={1}
			placeholder="e.g. 8"
			bind:value={p.yearsSinceDiagnosis}
		/>
	</Field>

	<Field label="Learning disability" inputId="profile-learningDisability">
		<Select id="profile-learningDisability" label="Learning disability" bind:value={p.learningDisability}>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>
</Fieldset>
