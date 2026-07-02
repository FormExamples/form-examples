<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const c = assessment.data.context;
</script>

<Fieldset legend="Step 1 of 8 — Assessment context">
	<p class="hint">
		Who is interpreting the result, when, where, and which MELD instrument to use. The chosen
		instrument drives which laboratory inputs are required.
	</p>

	<Field label="Assessing clinician name" required inputId="context-clinicianName">
		<TextInput
			id="context-clinicianName"
			label="Assessing clinician name"
			placeholder="e.g. Dr G. Osei"
			required
			bind:value={c.clinicianName}
		/>
	</Field>

	<Field label="Clinician role" required inputId="context-clinicianRole">
		<Select id="context-clinicianRole" label="Clinician role" required bind:value={c.clinicianRole}>
			<option value="">— Select —</option>
			<option value="hepatologist">Hepatologist</option>
			<option value="gastroenterologist">Gastroenterologist</option>
			<option value="transplant-coordinator">Transplant coordinator</option>
			<option value="intensivist">Intensivist</option>
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

	<Field label="Care setting" required inputId="context-careSetting">
		<Select id="context-careSetting" label="Care setting" required bind:value={c.careSetting}>
			<option value="">— Select —</option>
			<option value="hepatology-clinic">Hepatology clinic</option>
			<option value="transplant-unit">Transplant unit</option>
			<option value="intensive-care">Intensive care</option>
			<option value="ward">Ward</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field
		label="MELD instrument"
		description="MELD uses bilirubin, INR, and creatinine. MELD-Na adds sodium. MELD 3.0 adds sodium, albumin, and sex."
		required
		inputId="context-meldVariant"
	>
		<Select id="context-meldVariant" label="MELD instrument" required bind:value={c.meldVariant}>
			<option value="">— Select —</option>
			<option value="meld">MELD (original)</option>
			<option value="meld-na">MELD-Na (sodium-corrected)</option>
			<option value="meld-3">MELD 3.0</option>
		</Select>
	</Field>
</Fieldset>
