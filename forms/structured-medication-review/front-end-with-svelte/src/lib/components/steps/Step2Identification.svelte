<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const i = assessment.data.identification;
</script>

<Fieldset legend="Step 2 of 8 — Patient identification">
	<p class="hint">Local identifier, age band, sex, frailty, and long-term conditions.</p>

	<Field label="Patient identifier" required inputId="identification-patientIdentifier">
		<TextInput
			id="identification-patientIdentifier"
			label="Patient identifier"
			placeholder="e.g. GP-204817 or NHS number"
			required
			bind:value={i.patientIdentifier}
		/>
	</Field>

	<Field label="Age band" required inputId="identification-ageBand">
		<Select id="identification-ageBand" label="Age band" required bind:value={i.ageBand}>
			<option value="">— Select —</option>
			<option value="18-39">18-39</option>
			<option value="40-64">40-64</option>
			<option value="65-74">65-74</option>
			<option value="75-84">75-84</option>
			<option value="85-plus">85 and over</option>
		</Select>
	</Field>

	<Field label="Sex" required inputId="identification-sex">
		<Select id="identification-sex" label="Sex" required bind:value={i.sex}>
			<option value="">— Select —</option>
			<option value="female">Female</option>
			<option value="male">Male</option>
			<option value="intersex">Intersex</option>
			<option value="unknown">Unknown</option>
		</Select>
	</Field>

	<Field label="Frailty status" inputId="identification-frailtyStatus">
		<Select id="identification-frailtyStatus" label="Frailty status" bind:value={i.frailtyStatus}>
			<option value="">— Select —</option>
			<option value="fit">Fit</option>
			<option value="mild">Mild frailty</option>
			<option value="moderate">Moderate frailty</option>
			<option value="severe">Severe frailty</option>
		</Select>
	</Field>

	<Field label="Lives in a care home?" inputId="identification-livesInCareHome">
		<Select
			id="identification-livesInCareHome"
			label="Lives in a care home?"
			bind:value={i.livesInCareHome}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field label="Long-term conditions" inputId="identification-longTermConditions">
		<TextAreaInput
			id="identification-longTermConditions"
			label="Long-term conditions"
			rows={2}
			placeholder="e.g. Hypertension, type 2 diabetes, osteoarthritis, depression"
			bind:value={i.longTermConditions}
		/>
	</Field>
</Fieldset>
