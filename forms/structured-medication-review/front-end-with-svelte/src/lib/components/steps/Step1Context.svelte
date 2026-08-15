<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const c = assessment.data.context;
</script>

<Fieldset legend="Step 1 of 8 — Review context">
	<p class="hint">Who is reviewing, when, where, and how the consultation is conducted.</p>

	<Field label="Reviewing clinician name" required inputId="context-clinicianName">
		<TextInput
			id="context-clinicianName"
			label="Reviewing clinician name"
			placeholder="e.g. Priya Nair, clinical pharmacist"
			required
			bind:value={c.clinicianName}
		/>
	</Field>

	<Field label="Clinician role" required inputId="context-clinicianRole">
		<Select id="context-clinicianRole" label="Clinician role" required bind:value={c.clinicianRole}>
			<option value="">— Select —</option>
			<option value="clinical-pharmacist">Clinical pharmacist</option>
			<option value="gp">GP</option>
			<option value="pharmacy-technician">Pharmacy technician</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Date and time of review" inputId="context-reviewedAt">
		<TextInput
			id="context-reviewedAt"
			label="Date and time of review"
			type="datetime-local"
			class="date-input"
			bind:value={c.reviewedAt}
		/>
	</Field>

	<Field label="Care setting" required inputId="context-careSetting">
		<Select id="context-careSetting" label="Care setting" required bind:value={c.careSetting}>
			<option value="">— Select —</option>
			<option value="gp-practice">GP practice</option>
			<option value="pcn">Primary Care Network</option>
			<option value="care-home">Care home</option>
			<option value="community-pharmacy">Community pharmacy</option>
			<option value="patient-home">Patient's home</option>
		</Select>
	</Field>

	<Field label="Consultation mode" inputId="context-consultationMode">
		<Select id="context-consultationMode" label="Consultation mode" bind:value={c.consultationMode}>
			<option value="">— Select —</option>
			<option value="face-to-face">Face to face</option>
			<option value="telephone">Telephone</option>
			<option value="video">Video</option>
			<option value="home-visit">Home visit</option>
		</Select>
	</Field>
</Fieldset>
