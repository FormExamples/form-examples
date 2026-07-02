<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const c = assessment.data.context;
</script>

<Fieldset legend="Step 1 of 5 — Assessment context">
	<p class="hint">Who administered the ZBI, when, where, and which instrument form is scored.</p>

	<Field label="Administering practitioner name" required inputId="context-practitionerName">
		<TextInput
			id="context-practitionerName"
			label="Administering practitioner name"
			placeholder="e.g. Nurse J. Ahmed"
			required
			bind:value={c.practitionerName}
		/>
	</Field>

	<Field label="Practitioner role" required inputId="context-practitionerRole">
		<Select
			id="context-practitionerRole"
			label="Practitioner role"
			required
			bind:value={c.practitionerRole}
		>
			<option value="">— Select —</option>
			<option value="clinician">Clinician</option>
			<option value="nurse">Nurse</option>
			<option value="social-care">Social-care practitioner</option>
			<option value="carer-support">Carer-support worker</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Care setting" required inputId="context-careSetting">
		<Select id="context-careSetting" label="Care setting" required bind:value={c.careSetting}>
			<option value="">— Select —</option>
			<option value="memory-service">Old-age / memory service</option>
			<option value="community">Community / district nursing</option>
			<option value="general-practice">General practice</option>
			<option value="social-care">Social care / carer support</option>
			<option value="other">Other</option>
		</Select>
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

	<Field
		label="Instrument form"
		description="ZBI-22 scores all 22 items (0-88). ZBI-12 scores the 12-item short-form subset (0-48; high-burden cut-off &ge; 17)."
		required
		inputId="context-instrumentForm"
	>
		<Select id="context-instrumentForm" label="Instrument form" required bind:value={c.instrumentForm}>
			<option value="zbi22">ZBI-22 (full, 22 items, 0-88)</option>
			<option value="zbi12">ZBI-12 (short form, 12 items, 0-48)</option>
		</Select>
	</Field>
</Fieldset>
