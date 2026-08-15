<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const c = $state(assessment.data.context);
</script>

<Fieldset legend="Step 1 of 6 — Scan context">
	<p class="hint">Who performed the scan, when, where, and on which ultrasound device.</p>

	<Field label="Screening technician name" required inputId="context-technicianName">
		<TextInput
			id="context-technicianName"
			label="Screening technician name"
			placeholder="e.g. S. Okafor"
			required
			bind:value={c.technicianName}
		/>
	</Field>

	<Field label="Technician role" required inputId="context-technicianRole">
		<Select id="context-technicianRole" label="Technician role" required bind:value={c.technicianRole}>
			<option value="">— Select —</option>
			<option value="screening-technician">Screening technician</option>
			<option value="clinical-skills-trainer">Clinical skills trainer</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Clinic or site" inputId="context-clinicSite">
		<TextInput
			id="context-clinicSite"
			label="Clinic or site"
			placeholder="e.g. Riverside Community Clinic"
			bind:value={c.clinicSite}
		/>
	</Field>

	<Field label="Date and time of scan" inputId="context-scannedAt">
		<TextInput
			id="context-scannedAt"
			label="Date and time of scan"
			type="datetime-local"
			class="date-input"
			bind:value={c.scannedAt}
		/>
	</Field>

	<Field label="Ultrasound device identifier" inputId="context-deviceIdentifier">
		<TextInput
			id="context-deviceIdentifier"
			label="Ultrasound device identifier"
			placeholder="e.g. US-RC-01"
			bind:value={c.deviceIdentifier}
		/>
	</Field>
</Fieldset>
