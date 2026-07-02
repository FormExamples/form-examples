<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const c = assessment.data.context;
</script>

<Fieldset legend="Step 1 of 5 — Chart context">
	<p class="hint">
		Who is charting, for which patient and ward, when the period starts, and how many hours it
		covers.
	</p>

	<Field label="Charting clinician name" required inputId="context-clinicianName">
		<TextInput
			id="context-clinicianName"
			label="Charting clinician name"
			placeholder="e.g. Sam Okonkwo, staff nurse"
			required
			bind:value={c.clinicianName}
		/>
	</Field>

	<Field label="Clinician role" required inputId="context-clinicianRole">
		<Select id="context-clinicianRole" label="Clinician role" required bind:value={c.clinicianRole}>
			<option value="">— Select —</option>
			<option value="nurse">Nurse</option>
			<option value="doctor">Doctor</option>
			<option value="healthcare-assistant">Healthcare assistant</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Patient identifier" required inputId="context-patientIdentifier">
		<TextInput
			id="context-patientIdentifier"
			label="Patient identifier"
			placeholder="e.g. WARD-4B-12 or NHS number"
			required
			bind:value={c.patientIdentifier}
		/>
	</Field>

	<Field label="Ward or unit" inputId="context-wardOrUnit">
		<TextInput
			id="context-wardOrUnit"
			label="Ward or unit"
			placeholder="e.g. Acute Medical Unit, Bay 3"
			bind:value={c.wardOrUnit}
		/>
	</Field>

	<Field label="Chart start date and time" inputId="context-chartStartAt">
		<TextInput
			id="context-chartStartAt"
			label="Chart start date and time"
			type="datetime-local"
			class="date-input"
			bind:value={c.chartStartAt}
		/>
	</Field>

	<Field
		label="Charting period (hours)"
		description="Defaults to 24 h; scales the significant-balance thresholds and the mL/kg/h rate."
		inputId="context-chartPeriodHours"
	>
		<NumberInput
			id="context-chartPeriodHours"
			label="Charting period (hours)"
			min={1}
			max={168}
			step={1}
			bind:value={c.chartPeriodHours}
		/>
	</Field>
</Fieldset>
