<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import { calculateHealthCheckGrade } from '#lib/engine/ld-health-check-grader.js';
	import { statusLabel, statusColor, healthActionPlanColor } from '#lib/engine/utils.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import Badge from '#lib/components/ui/Badge.svelte';

	const p = assessment.data.plan;

	// Live completeness readout — recomputed as the required components change.
	const grade = $derived(calculateHealthCheckGrade(assessment.data));
	const completedCount = $derived(grade.componentStatuses.filter((c) => c.completed).length);
</script>

<Fieldset legend="Step 10 of 10 — Health Action Plan">
	<p class="hint">
		Produce and share the Health Action Plan the person can keep. A complete check needs every
		component plus this plan.
	</p>

	<div class="mb-4 rounded-lg border border-base-300 bg-base-200 p-4">
		<div class="flex flex-wrap items-center gap-3">
			<span class="text-sm font-semibold text-base-content/70">Live completeness</span>
			<span class="text-lg font-bold text-base-content">{grade.completenessPercent}%</span>
			<span class="text-sm text-base-content/60"
				>({completedCount} of {grade.componentStatuses.length} components)</span
			>
			<Badge label={statusLabel(grade.status)} colorClass={statusColor(grade.status)} />
		</div>
		<div class="mt-2 flex items-center gap-2 text-sm">
			<span class="text-base-content/70">Health Action Plan:</span>
			<Badge
				label={grade.healthActionPlanComplete ? 'Produced & shared' : 'Not yet produced & shared'}
				colorClass={healthActionPlanColor(grade.healthActionPlanComplete)}
			/>
		</div>
	</div>

	<Field label="Health Action Plan produced?" inputId="plan-healthActionPlanProduced">
		<Select
			id="plan-healthActionPlanProduced"
			label="Health Action Plan produced?"
			bind:value={p.healthActionPlanProduced}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field
		label="Health Action Plan shared with the person?"
		inputId="plan-healthActionPlanShared"
	>
		<Select
			id="plan-healthActionPlanShared"
			label="Health Action Plan shared with the person?"
			bind:value={p.healthActionPlanShared}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field label="Health Action Plan actions" inputId="plan-healthActionPlanActions">
		<TextAreaInput
			id="plan-healthActionPlanActions"
			label="Health Action Plan actions"
			rows={3}
			placeholder="The collated actions from this check, written in a way the person can use."
			bind:value={p.healthActionPlanActions}
		/>
	</Field>

	<Field label="Clinician note" inputId="plan-clinicianNote">
		<TextAreaInput
			id="plan-clinicianNote"
			label="Clinician note"
			rows={3}
			placeholder="Free-text summary of the check."
			bind:value={p.clinicianNote}
		/>
	</Field>
</Fieldset>
