<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const c = assessment.data.context;
</script>

<Fieldset legend="Step 1 of 8 — Assessor and encounter">
	<p class="hint">Who is assessing, when, where, and which CAM variant is being used.</p>

	<Field label="Assessor name" required inputId="context-assessorName">
		<TextInput
			id="context-assessorName"
			label="Assessor name"
			placeholder="e.g. Staff Nurse J. Okoro"
			required
			bind:value={c.assessorName}
		/>
	</Field>

	<Field label="Assessor role" required inputId="context-assessorRole">
		<Select id="context-assessorRole" label="Assessor role" required bind:value={c.assessorRole}>
			<option value="">— Select —</option>
			<option value="nurse">Nurse</option>
			<option value="doctor">Doctor</option>
			<option value="geriatrician">Geriatrician</option>
			<option value="liaison-psychiatrist">Liaison psychiatrist</option>
			<option value="physiotherapist">Physiotherapist</option>
			<option value="occupational-therapist">Occupational therapist</option>
			<option value="researcher">Researcher</option>
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

	<Field label="Ward or unit" inputId="context-wardUnit">
		<TextInput
			id="context-wardUnit"
			label="Ward or unit"
			placeholder="e.g. Care of the Elderly, Ward 12"
			bind:value={c.wardUnit}
		/>
	</Field>

	<Field
		label="Assessment variant"
		description="CAM-ICU substitutes non-verbal tasks and a RASS arousal screen for ventilated / non-verbal patients."
		required
		inputId="context-camVariant"
	>
		<Select id="context-camVariant" label="Assessment variant" required bind:value={c.camVariant}>
			<option value="">— Select —</option>
			<option value="cam">CAM (standard bedside)</option>
			<option value="cam-icu">CAM-ICU (ventilated / non-verbal)</option>
		</Select>
	</Field>
</Fieldset>
