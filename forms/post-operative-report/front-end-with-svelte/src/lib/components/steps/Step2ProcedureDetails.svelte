<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateDurationMinutes, formatDuration } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const d = assessment.data.procedureDetails;

	// Auto-calculate procedure duration from start and end times.
	$effect(() => {
		assessment.data.procedureDetails.durationMinutes = calculateDurationMinutes(
			d.startTime,
			d.endTime
		);
	});

	const priorityOptions = [
		{ value: 'elective', label: 'Elective' },
		{ value: 'urgent', label: 'Urgent' },
		{ value: 'emergency', label: 'Emergency' }
	];
</script>

<Fieldset legend="Procedure Details">
	<p class="hint">Procedure performed, indication, timing, and location.</p>

	<Field label="Procedure name" required inputId="procedureName">
		<TextInput
			id="procedureName"
			label="Procedure name"
			required
			placeholder="e.g. Laparoscopic appendicectomy"
			bind:value={d.procedureName}
		/>
	</Field>

	<div class="field-grid">
		<Field label="Procedure code (OPCS-4 / ICD-10-PCS)" inputId="procedureCode">
			<TextInput id="procedureCode" label="Procedure code" bind:value={d.procedureCode} />
		</Field>
		<Field label="Priority" inputId="priority">
			<Select label="Priority" bind:value={d.priority}>
				<option value="">— Select —</option>
				{#each priorityOptions as opt (opt.value)}
					<option value={opt.value}>{opt.label}</option>
				{/each}
			</Select>
		</Field>
	</div>

	<Field label="Indication" inputId="indication">
		<TextAreaInput id="indication" label="Indication" rows={2} placeholder="Clinical indication for the procedure" bind:value={d.indication} />
	</Field>

	<div class="field-grid">
		<Field label="Surgical approach" inputId="surgicalApproach">
			<TextInput id="surgicalApproach" label="Surgical approach" placeholder="e.g. Open, laparoscopic, robotic" bind:value={d.surgicalApproach} />
		</Field>
		<Field label="Laterality" inputId="laterality">
			<TextInput id="laterality" label="Laterality" placeholder="e.g. Left, right, bilateral, N/A" bind:value={d.laterality} />
		</Field>
	</div>

	<Field label="Date of surgery" required inputId="dateOfSurgery">
		<DateInput id="dateOfSurgery" label="Date of surgery" required bind:value={d.dateOfSurgery} />
	</Field>

	<div class="field-grid field-grid-3">
		<Field label="Start time" inputId="startTime">
			<input id="startTime" type="time" class="time-input" aria-label="Start time" bind:value={d.startTime} />
		</Field>
		<Field label="End time" inputId="endTime">
			<input id="endTime" type="time" class="time-input" aria-label="End time" bind:value={d.endTime} />
		</Field>
		<Field label="Duration" description="Auto-calculated">
			<p class="readout">{formatDuration(d.durationMinutes)}</p>
		</Field>
	</div>

	<Field label="Operating theatre / room" inputId="operatingRoom">
		<TextInput id="operatingRoom" label="Operating theatre / room" placeholder="e.g. Theatre 4" bind:value={d.operatingRoom} />
	</Field>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	.field-grid.field-grid-3 {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
	@media (max-width: 640px) {
		.field-grid,
		.field-grid.field-grid-3 {
			grid-template-columns: 1fr;
		}
	}
	.readout {
		margin: 0;
		font-weight: 500;
	}
</style>
