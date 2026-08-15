<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const c = assessment.data.context;
</script>

<Fieldset legend="Step 1 of 5 — Assessment context">
	<p class="hint">Who is assessing, when, and in what care setting.</p>

	<Field label="Assessing clinician name" required inputId="context-clinicianName">
		<TextInput
			id="context-clinicianName"
			label="Assessing clinician name"
			placeholder="e.g. Dr A. Khan or Midwife J. Owen"
			required
			bind:value={c.clinicianName}
		/>
	</Field>

	<Field label="Clinician role" required inputId="context-clinicianRole">
		<Select id="context-clinicianRole" label="Clinician role" required bind:value={c.clinicianRole}>
			<option value="">— Select —</option>
			<option value="midwife">Midwife</option>
			<option value="neonatal-nurse">Neonatal / paediatric nurse</option>
			<option value="paediatrician">Paediatrician</option>
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
			<option value="postnatal-ward">Postnatal ward</option>
			<option value="neonatal-unit">Neonatal unit</option>
			<option value="midwife-led-unit">Midwife-led unit</option>
			<option value="community">Community / midwifery follow-up</option>
			<option value="other">Other</option>
		</Select>
	</Field>
</Fieldset>
