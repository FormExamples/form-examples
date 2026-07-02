<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const e = assessment.data.encounter;
</script>

<Fieldset legend="Step 1 of 8 — Encounter and clinician">
	<p class="hint">Who is clerking, their registration, and when and where the encounter took place.</p>

	<Field label="Clerking clinician name" required inputId="encounter-clinicianName">
		<TextInput
			id="encounter-clinicianName"
			label="Clerking clinician name"
			placeholder="e.g. Dr A. Khan"
			required
			bind:value={e.clinicianName}
		/>
	</Field>

	<Field label="Clinician role" required inputId="encounter-clinicianRole">
		<Select id="encounter-clinicianRole" label="Clinician role" required bind:value={e.clinicianRole}>
			<option value="">— Select —</option>
			<option value="doctor">Doctor</option>
			<option value="acp">Advanced clinical practitioner</option>
			<option value="physician-associate">Physician associate</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Registration number" inputId="encounter-registrationNumber">
		<TextInput
			id="encounter-registrationNumber"
			label="Registration number"
			placeholder="GMC / NMC / HCPC number"
			bind:value={e.registrationNumber}
		/>
	</Field>

	<Field label="Date and time of clerking" inputId="encounter-clerkedAt">
		<TextInput
			id="encounter-clerkedAt"
			label="Date and time of clerking"
			type="datetime-local"
			class="date-input"
			bind:value={e.clerkedAt}
		/>
	</Field>

	<Field label="Care setting" required inputId="encounter-careSetting">
		<Select id="encounter-careSetting" label="Care setting" required bind:value={e.careSetting}>
			<option value="">— Select —</option>
			<option value="emergency-department">Emergency department</option>
			<option value="acute-medical-unit">Acute medical unit</option>
			<option value="ward">Ward</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Admission source" inputId="encounter-admissionSource">
		<Select id="encounter-admissionSource" label="Admission source" bind:value={e.admissionSource}>
			<option value="">— Select —</option>
			<option value="self">Self-presentation</option>
			<option value="gp">GP referral</option>
			<option value="ambulance">Ambulance</option>
			<option value="transfer">Inter-hospital transfer</option>
			<option value="other">Other</option>
		</Select>
	</Field>
</Fieldset>
