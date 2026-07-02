<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const c = assessment.data.context;
</script>

<Fieldset legend="Step 1 of 5 — Labour context">
	<p class="hint">
		Who is recording, where, and when the active first stage began. The active-phase start time is
		the reference point for the alert and action lines.
	</p>

	<Field label="Recording clinician" required inputId="context-clinicianName">
		<TextInput
			id="context-clinicianName"
			label="Recording clinician"
			placeholder="e.g. Midwife A. Chen"
			required
			bind:value={c.clinicianName}
		/>
	</Field>

	<Field label="Clinician role" required inputId="context-clinicianRole">
		<Select id="context-clinicianRole" label="Clinician role" required bind:value={c.clinicianRole}>
			<option value="">— Select —</option>
			<option value="midwife">Midwife</option>
			<option value="obstetrician">Obstetrician</option>
			<option value="nurse">Nurse</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Care setting" inputId="context-careSetting">
		<Select id="context-careSetting" label="Care setting" bind:value={c.careSetting}>
			<option value="">— Select —</option>
			<option value="labour-ward">Labour ward</option>
			<option value="birth-centre">Birth centre</option>
			<option value="triage">Triage</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field
		label="Active phase started at"
		description="Reference time for the alert and action lines (4 cm)."
		required
		inputId="context-activePhaseStartAt"
	>
		<TextInput
			id="context-activePhaseStartAt"
			label="Active phase started at"
			type="datetime-local"
			class="date-input"
			required
			bind:value={c.activePhaseStartAt}
		/>
	</Field>
</Fieldset>
