<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const id = assessment.data.identification;
	const dx = assessment.data.diagnosis;
</script>

<Fieldset legend="Step 2 of 9 — Patient and diagnosis">
	<p class="hint">Patient identification and the established heart-failure diagnosis and subtype.</p>

	<Field label="Patient identifier" required inputId="identification-patientIdentifier">
		<TextInput
			id="identification-patientIdentifier"
			label="Patient identifier"
			placeholder="e.g. NHS number or local ID"
			required
			bind:value={id.patientIdentifier}
		/>
	</Field>

	<Field label="Age band" inputId="identification-ageBand">
		<Select id="identification-ageBand" label="Age band" bind:value={id.ageBand}>
			<option value="">— Select —</option>
			<option value="18-39">18–39</option>
			<option value="40-59">40–59</option>
			<option value="60-79">60–79</option>
			<option value=">=80">80 and over</option>
		</Select>
	</Field>

	<Field label="Sex" inputId="identification-sex">
		<Select id="identification-sex" label="Sex" bind:value={id.sex}>
			<option value="">— Select —</option>
			<option value="female">Female</option>
			<option value="male">Male</option>
			<option value="intersex">Intersex</option>
			<option value="unknown">Unknown</option>
		</Select>
	</Field>

	<Field label="Year of diagnosis" inputId="diagnosis-yearOfDiagnosis">
		<NumberInput
			id="diagnosis-yearOfDiagnosis"
			label="Year of diagnosis"
			min={1950}
			max={2100}
			step={1}
			bind:value={dx.yearOfDiagnosis}
		/>
	</Field>

	<Field
		label="Heart-failure type"
		required
		inputId="diagnosis-heartFailureType"
		description="Drives the indicated medication-pillar set: all four pillars for HFrEF; SGLT2 inhibitor for HFmrEF/HFpEF."
	>
		<Select
			id="diagnosis-heartFailureType"
			label="Heart-failure type"
			required
			bind:value={dx.heartFailureType}
		>
			<option value="">— Select —</option>
			<option value="reduced">Reduced EF (HFrEF)</option>
			<option value="mildly-reduced">Mildly-reduced EF (HFmrEF)</option>
			<option value="preserved">Preserved EF (HFpEF)</option>
			<option value="unknown">Unknown</option>
		</Select>
	</Field>

	<Field label="Most recent LVEF (%)" inputId="diagnosis-latestLvef">
		<NumberInput
			id="diagnosis-latestLvef"
			label="Most recent LVEF (%)"
			min={0}
			max={100}
			step={0.1}
			bind:value={dx.latestLvef}
		/>
	</Field>

	<Field label="Date of last echocardiogram" inputId="diagnosis-lastEchoDate">
		<DateInput
			id="diagnosis-lastEchoDate"
			label="Date of last echocardiogram"
			bind:value={dx.lastEchoDate}
		/>
	</Field>

	<Field label="Aetiology" inputId="diagnosis-aetiology">
		<Select id="diagnosis-aetiology" label="Aetiology" bind:value={dx.aetiology}>
			<option value="">— Select —</option>
			<option value="ischaemic">Ischaemic</option>
			<option value="hypertensive">Hypertensive</option>
			<option value="valvular">Valvular</option>
			<option value="other">Other</option>
			<option value="unknown">Unknown</option>
		</Select>
	</Field>
</Fieldset>
