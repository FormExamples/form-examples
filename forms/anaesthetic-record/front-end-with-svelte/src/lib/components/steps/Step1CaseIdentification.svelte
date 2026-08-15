<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const c = $state(assessment.data.identification);
</script>

<Fieldset legend="Step 1 of 12 — Case identification">
	<p class="hint">Who, where, when — and the overall anaesthetic technique.</p>

	<Field label="Patient identifier" required inputId="identification-patientIdentifier">
		<TextInput
			id="identification-patientIdentifier"
			label="Patient identifier"
			placeholder="e.g. NHS number or local ID"
			required
			bind:value={c.patientIdentifier}
		/>
	</Field>

	<Field label="Patient name" inputId="identification-patientName">
		<TextInput
			id="identification-patientName"
			label="Patient name"
			placeholder="e.g. Okafor, Beatrice"
			bind:value={c.patientName}
		/>
	</Field>

	<Field label="Date of birth" inputId="identification-dateOfBirth">
		<TextInput
			id="identification-dateOfBirth"
			label="Date of birth"
			type="date"
			class="date-input"
			bind:value={c.dateOfBirth}
		/>
	</Field>

	<Field label="Sex" inputId="identification-sex">
		<Select id="identification-sex" label="Sex" bind:value={c.sex}>
			<option value="">— Select —</option>
			<option value="female">Female</option>
			<option value="male">Male</option>
			<option value="intersex">Intersex</option>
			<option value="unknown">Unknown</option>
		</Select>
	</Field>

	<Field
		label="Weight (kg)"
		description="Recorded for a complete record."
		inputId="identification-weightKg"
	>
		<NumberInput id="identification-weightKg" label="Weight (kg)" min={0} step="any" bind:value={c.weightKg} />
	</Field>

	<Field label="Height (cm)" inputId="identification-heightCm">
		<NumberInput id="identification-heightCm" label="Height (cm)" min={0} step="any" bind:value={c.heightCm} />
	</Field>

	<Field label="Theatre / location" inputId="identification-theatre">
		<TextInput id="identification-theatre" label="Theatre / location" placeholder="e.g. Theatre 3" bind:value={c.theatre} />
	</Field>

	<Field label="Date of anaesthetic" inputId="identification-operationDate">
		<TextInput
			id="identification-operationDate"
			label="Date of anaesthetic"
			type="date"
			class="date-input"
			bind:value={c.operationDate}
		/>
	</Field>

	<Field label="Responsible anaesthetist" required inputId="identification-anaesthetistName">
		<TextInput
			id="identification-anaesthetistName"
			label="Responsible anaesthetist"
			placeholder="e.g. Dr A. Rahman"
			required
			bind:value={c.anaesthetistName}
		/>
	</Field>

	<Field label="ODP / anaesthetic assistant" inputId="identification-assistantName">
		<TextInput id="identification-assistantName" label="ODP / anaesthetic assistant" placeholder="e.g. J. Okonkwo" bind:value={c.assistantName} />
	</Field>

	<Field label="Operating surgeon" inputId="identification-surgeonName">
		<TextInput id="identification-surgeonName" label="Operating surgeon" placeholder="e.g. Mr T. Brand" bind:value={c.surgeonName} />
	</Field>

	<Field label="Planned procedure" inputId="identification-plannedProcedure">
		<TextInput id="identification-plannedProcedure" label="Planned procedure" placeholder="e.g. Laparoscopic cholecystectomy" bind:value={c.plannedProcedure} />
	</Field>

	<Field label="Urgency" inputId="identification-urgency">
		<Select id="identification-urgency" label="Urgency" bind:value={c.urgency}>
			<option value="">— Select —</option>
			<option value="elective">Elective</option>
			<option value="urgent">Urgent</option>
			<option value="emergency">Emergency</option>
			<option value="immediate">Immediate</option>
		</Select>
	</Field>

	<Field
		label="Anaesthetic technique"
		description="Overall technique — safety-critical for a complete record."
		required
		inputId="identification-anaestheticTechnique"
	>
		<Select id="identification-anaestheticTechnique" label="Anaesthetic technique" required bind:value={c.anaestheticTechnique}>
			<option value="">— Select —</option>
			<option value="general">General</option>
			<option value="regional">Regional</option>
			<option value="sedation">Sedation</option>
			<option value="mac">Monitored anaesthesia care</option>
			<option value="combined">Combined</option>
		</Select>
	</Field>
</Fieldset>
