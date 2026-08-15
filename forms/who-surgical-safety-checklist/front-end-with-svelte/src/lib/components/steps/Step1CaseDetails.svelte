<script lang="ts">
	import { store } from '#lib/stores/checklist.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const c = store.data;
</script>

<Fieldset legend="Step 1 — Case details">
	<p class="hint">
		Capture patient, theatre, procedure, and team identification before starting Sign In.
	</p>

	<Field label="Site / hospital" inputId="siteName">
		<TextInput id="siteName" label="Site / hospital" bind:value={c.siteName} />
	</Field>

	<Field label="Operating room" inputId="operatingRoom">
		<TextInput id="operatingRoom" label="Operating room" bind:value={c.operatingRoom} />
	</Field>

	<Field label="Case date" required inputId="caseDate">
		<DateInput id="caseDate" label="Case date" required bind:value={c.caseDate} />
	</Field>

	<Field label="Case start (wheels-in)" inputId="caseStartAt">
		<TextInput
			id="caseStartAt"
			type="datetime-local"
			label="Case start (wheels-in)"
			bind:value={c.caseStartAt}
		/>
	</Field>

	<Field label="Planned procedure" required inputId="plannedProcedure">
		<TextInput
			id="plannedProcedure"
			label="Planned procedure"
			required
			bind:value={c.plannedProcedure}
		/>
	</Field>

	<Field label="Surgical specialty" inputId="surgicalSpecialty">
		<TextInput id="surgicalSpecialty" label="Surgical specialty" bind:value={c.surgicalSpecialty} />
	</Field>

	<Field label="Urgency" inputId="urgency">
		<Select id="urgency" label="Urgency" bind:value={c.urgency}>
			<option value="">-- Select --</option>
			<option value="elective">Elective</option>
			<option value="urgent">Urgent</option>
			<option value="emergency">Emergency</option>
			<option value="immediate">Immediate</option>
		</Select>
	</Field>

	<Field label="Laterality" inputId="laterality">
		<Select id="laterality" label="Laterality" bind:value={c.laterality}>
			<option value="">-- Select --</option>
			<option value="left">Left</option>
			<option value="right">Right</option>
			<option value="bilateral">Bilateral</option>
			<option value="midline">Midline</option>
			<option value="na">N/A</option>
		</Select>
	</Field>

	<Field label="Paediatric patient?" description="Drives the 7 ml/kg blood-loss threshold." inputId="isPaediatric">
		<Select id="isPaediatric" label="Paediatric patient?" bind:value={c.isPaediatric}>
			<option value="">-- Select --</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field label="Lead surgeon ID" inputId="surgeonId">
		<TextInput id="surgeonId" label="Lead surgeon ID" bind:value={c.surgeonId} />
	</Field>

	<Field label="Anaesthetist ID" inputId="anaesthetistId">
		<TextInput id="anaesthetistId" label="Anaesthetist ID" bind:value={c.anaesthetistId} />
	</Field>

	<Field label="Lead nurse ID" inputId="leadNurseId">
		<TextInput id="leadNurseId" label="Lead nurse ID" bind:value={c.leadNurseId} />
	</Field>

	<Field
		label="Abandoned reason (leave blank if not abandoned)"
		description="Setting any non-empty reason marks the case as abandoned."
		inputId="abandonedReason"
	>
		<TextAreaInput
			id="abandonedReason"
			label="Abandoned reason"
			rows={2}
			bind:value={c.abandonedReason}
		/>
	</Field>
</Fieldset>
