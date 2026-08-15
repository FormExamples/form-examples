<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const d = $state(assessment.data.plannedSurgery);
</script>

<Fieldset legend="Planned Surgery & Proposed Anaesthesia">
	<p class="hint">The proposed procedure, its grade, and the intended anaesthetic technique.</p>

	<Field label="Procedure name" inputId="procedureName">
		<TextInput id="procedureName" label="Procedure name" placeholder="e.g. Laparoscopic cholecystectomy" bind:value={d.procedureName} />
	</Field>

	<div class="field-grid">
		<Field label="Surgeon" inputId="surgeonName">
			<TextInput id="surgeonName" label="Surgeon" bind:value={d.surgeonName} />
		</Field>
		<Field label="Planned surgery date" inputId="surgeryDate">
			<DateInput id="surgeryDate" label="Planned surgery date" bind:value={d.surgeryDate} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Surgery grade" description="Higher grades count toward the RCRI cardiac index." inputId="surgeryGrade">
			<Select id="surgeryGrade" label="Surgery grade" bind:value={d.surgeryGrade}>
				<option value="">Select…</option>
				<option value="minor">Minor</option>
				<option value="intermediate">Intermediate</option>
				<option value="major">Major</option>
				<option value="complex">Complex</option>
			</Select>
		</Field>
		<Field label="Proposed anaesthesia" inputId="proposedAnaesthesia">
			<Select id="proposedAnaesthesia" label="Proposed anaesthesia" bind:value={d.proposedAnaesthesia}>
				<option value="">Select…</option>
				<option value="general">General</option>
				<option value="regional">Regional</option>
				<option value="sedation">Sedation</option>
				<option value="local">Local</option>
				<option value="combined">Combined</option>
			</Select>
		</Field>
	</div>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.field-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
