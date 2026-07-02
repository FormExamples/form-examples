<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const c = assessment.data.context;
</script>

<Fieldset legend="Step 1 of 9 — Clinician and context">
	<p class="hint">Who is assessing, when, where, and how long since ICU/HDU admission.</p>

	<Field label="Assessing clinician name" required inputId="context-assessorName">
		<TextInput
			id="context-assessorName"
			label="Assessing clinician name"
			placeholder="e.g. Dr A. Khan"
			required
			bind:value={c.assessorName}
		/>
	</Field>

	<Field label="Clinician role" required inputId="context-assessorRole">
		<Select id="context-assessorRole" label="Clinician role" required bind:value={c.assessorRole}>
			<option value="">— Select —</option>
			<option value="intensivist">Intensivist</option>
			<option value="critical-care-physician">Critical-care physician</option>
			<option value="acute-physician">Acute-medicine physician</option>
			<option value="resident">Resident</option>
			<option value="nurse">Critical-care nurse</option>
			<option value="outreach-practitioner">Outreach practitioner</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Professional registration number" inputId="context-assessorRegistrationNumber">
		<TextInput
			id="context-assessorRegistrationNumber"
			label="Professional registration number"
			placeholder="e.g. GMC / NMC number"
			bind:value={c.assessorRegistrationNumber}
		/>
	</Field>

	<Field label="Date and time of assessment" inputId="context-assessedAt">
		<TextInput
			id="context-assessedAt"
			label="Date and time of assessment"
			type="datetime-local"
			class="date-input"
			bind:value={c.assessedAt}
		/>
	</Field>

	<Field label="Care location" required inputId="context-careLocation">
		<Select id="context-careLocation" label="Care location" required bind:value={c.careLocation}>
			<option value="">— Select —</option>
			<option value="icu">Intensive care unit</option>
			<option value="hdu">High-dependency unit</option>
			<option value="critical-care-outreach">Critical-care outreach</option>
			<option value="acute-medical-unit">Acute medical unit</option>
			<option value="emergency-department">Emergency department</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Hours since admission" inputId="context-hoursSinceAdmission">
		<NumberInput
			id="context-hoursSinceAdmission"
			label="Hours since admission"
			min={0}
			max={2000}
			step={1}
			bind:value={c.hoursSinceAdmission}
		/>
	</Field>
</Fieldset>
