<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const c = assessment.data.context;
</script>

<Fieldset legend="Step 1 of 11 — Review context and identification">
	<p class="hint">Who is reviewing, when, the review type, and patient identification.</p>

	<Field label="Reviewing clinician name" required inputId="context-clinicianName">
		<TextInput
			id="context-clinicianName"
			label="Reviewing clinician name"
			placeholder="e.g. Sister J. Okonkwo"
			required
			bind:value={c.clinicianName}
		/>
	</Field>

	<Field label="Clinician role" required inputId="context-clinicianRole">
		<Select id="context-clinicianRole" label="Clinician role" required bind:value={c.clinicianRole}>
			<option value="">— Select —</option>
			<option value="gp">GP</option>
			<option value="practice-nurse">Practice nurse</option>
			<option value="respiratory-nurse">Respiratory nurse</option>
			<option value="pharmacist">Clinical pharmacist</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Date of review" inputId="context-reviewedAt">
		<TextInput
			id="context-reviewedAt"
			label="Date of review"
			type="date"
			class="date-input"
			bind:value={c.reviewedAt}
		/>
	</Field>

	<Field label="Review type" required inputId="context-reviewType">
		<Select id="context-reviewType" label="Review type" required bind:value={c.reviewType}>
			<option value="">— Select —</option>
			<option value="routine-annual">Routine annual</option>
			<option value="post-exacerbation">Post-exacerbation</option>
			<option value="opportunistic">Opportunistic</option>
		</Select>
	</Field>

	<Field label="Patient identifier" required inputId="context-patientIdentifier">
		<TextInput
			id="context-patientIdentifier"
			label="Patient identifier"
			placeholder="NHS number or local identifier"
			required
			bind:value={c.patientIdentifier}
		/>
	</Field>

	<Field
		label="Age band"
		required
		inputId="context-ageBand"
		description="COPD review is for adults (16 years and over)."
	>
		<Select id="context-ageBand" label="Age band" required bind:value={c.ageBand}>
			<option value="">— Select —</option>
			<option value="18-39">18-39</option>
			<option value="40-59">40-59</option>
			<option value="60-79">60-79</option>
			<option value=">=80">80 and over</option>
		</Select>
	</Field>

	<Field label="Sex" required inputId="context-sex">
		<Select id="context-sex" label="Sex" required bind:value={c.sex}>
			<option value="">— Select —</option>
			<option value="female">Female</option>
			<option value="male">Male</option>
			<option value="intersex">Intersex</option>
			<option value="unknown">Unknown</option>
		</Select>
	</Field>
</Fieldset>
