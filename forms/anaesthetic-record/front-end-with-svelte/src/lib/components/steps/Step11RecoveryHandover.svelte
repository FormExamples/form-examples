<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const h = assessment.data.handover;
</script>

<Fieldset legend="Step 11 of 12 — Recovery handover">
	<p class="hint">Destination, airway status, and post-operative plans.</p>

	<Field
		label="Recovery destination"
		description="Recorded for a complete record."
		inputId="handover-recoveryDestination"
	>
		<Select id="handover-recoveryDestination" label="Recovery destination" bind:value={h.recoveryDestination}>
			<option value="">— Select —</option>
			<option value="recovery">Recovery / PACU</option>
			<option value="hdu">HDU</option>
			<option value="icu">ICU</option>
			<option value="ward">Ward</option>
		</Select>
	</Field>

	<Field label="Airway status at handover" inputId="handover-handoverAirwayStatus">
		<TextInput id="handover-handoverAirwayStatus" label="Airway status at handover" placeholder="e.g. Extubated, self-ventilating" bind:value={h.handoverAirwayStatus} />
	</Field>

	<Field label="Analgesia plan" inputId="handover-analgesiaPlan">
		<TextAreaInput id="handover-analgesiaPlan" label="Analgesia plan" rows={2} placeholder="e.g. Paracetamol regular, oxycodone PRN" bind:value={h.analgesiaPlan} />
	</Field>

	<Field label="Antiemetic plan" inputId="handover-antiemeticPlan">
		<TextAreaInput id="handover-antiemeticPlan" label="Antiemetic plan" rows={2} placeholder="e.g. Ondansetron PRN" bind:value={h.antiemeticPlan} />
	</Field>

	<Field label="Oxygen plan" inputId="handover-oxygenPlan">
		<TextInput id="handover-oxygenPlan" label="Oxygen plan" placeholder="e.g. 2 L/min via nasal cannulae" bind:value={h.oxygenPlan} />
	</Field>

	<Field label="Outstanding tasks" inputId="handover-outstandingTasks">
		<TextAreaInput id="handover-outstandingTasks" label="Outstanding tasks" rows={2} placeholder="e.g. Chase potassium; review pain in 30 min" bind:value={h.outstandingTasks} />
	</Field>

	<Field label="Handover time" inputId="handover-handoverAt">
		<TextInput id="handover-handoverAt" label="Handover time" type="datetime-local" class="date-input" bind:value={h.handoverAt} />
	</Field>

	<Field label="Receiving practitioner" inputId="handover-receivingPractitioner">
		<TextInput id="handover-receivingPractitioner" label="Receiving practitioner" placeholder="e.g. Recovery nurse S. Patel" bind:value={h.receivingPractitioner} />
	</Field>
</Fieldset>
