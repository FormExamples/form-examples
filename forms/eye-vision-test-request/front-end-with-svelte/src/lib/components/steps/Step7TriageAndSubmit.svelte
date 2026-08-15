<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Badge from '#lib/components/ui/Badge.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import { request } from '#lib/stores/request.svelte.js';
	import { calculateGrade } from '#lib/engine/grader.js';
	import {
		appropriatenessLabel,
		appropriatenessColor,
		triageTierLabel,
		triageTierColor,
		priorityBandLabel,
		priorityBandColor,
		recommendationLabel,
		recommendationColor
	} from '#lib/engine/utils.js';

	const d = request.data.triage;

	// Live preview of the four-axis vetting grade as the request is edited.
	const preview = $derived(calculateGrade(request.data));
</script>

<Fieldset legend="7. Triage and Submit">
	<p class="hint">The requested urgency, the requested-by date, and the care setting. The live four-axis grade updates as you edit.</p>

	<Field label="Requested urgency" inputId="urgency" description="The engine may escalate this if a red flag is present, but will not lower it." required>
		<Select id="urgency" label="Requested urgency" bind:value={d.urgency} required>
			<option value="">Select…</option>
			<option value="routine">Routine</option>
			<option value="urgent">Urgent</option>
			<option value="emergency">Emergency</option>
		</Select>
	</Field>

	<Field label="Requested-by date" inputId="requestedByDate" description="Date by which the patient should be seen.">
		<DateInput id="requestedByDate" label="Requested-by date" bind:value={d.requestedByDate} />
	</Field>

	<Field label="Care setting" inputId="setting">
		<Select id="setting" label="Care setting" bind:value={d.setting}>
			<option value="">Select…</option>
			<option value="hospital-eye-service">Hospital eye service</option>
			<option value="community-optometry">Community optometry</option>
			<option value="gp-surgery">GP surgery</option>
			<option value="emergency-eye-clinic">Emergency eye clinic</option>
			<option value="triage-desk">Eye-care triage desk</option>
		</Select>
	</Field>

	{#if preview.triageTier === 'emergency'}
		<Alert type="error" heading="Emergency triage">
			<p>
				This request contains an acute red flag. Arrange same-day emergency eye assessment; do not
				wait for a routine booking.
			</p>
		</Alert>
	{/if}

	<div class="my-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
		<div class="rounded-lg border border-base-300 p-3">
			<div class="mb-1 text-xs font-semibold text-base-content/60">Axis A — Appropriateness</div>
			<Badge
				label={appropriatenessLabel(preview.appropriatenessBand)}
				color={appropriatenessColor(preview.appropriatenessBand)}
			/>
		</div>
		<div class="rounded-lg border border-base-300 p-3">
			<div class="mb-1 text-xs font-semibold text-base-content/60">Axis B — Triage</div>
			<Badge label={triageTierLabel(preview.triageTier)} color={triageTierColor(preview.triageTier)} />
			<div class="mt-1 text-xs text-base-content/60">{preview.targetTimeframe}</div>
		</div>
		<div class="rounded-lg border border-base-300 p-3">
			<div class="mb-1 text-xs font-semibold text-base-content/60">Axis C — Completeness</div>
			<span class="text-lg font-bold text-base-content">{preview.completenessPercent}%</span>
		</div>
		<div class="rounded-lg border border-base-300 p-3">
			<div class="mb-1 text-xs font-semibold text-base-content/60">Axis D — Clinical priority</div>
			<Badge label={priorityBandLabel(preview.priorityBand)} color={priorityBandColor(preview.priorityBand)} />
		</div>
	</div>

	<div class="my-4 rounded-lg border border-base-300 p-3">
		<div class="mb-1 text-xs font-semibold text-base-content/60">Overall recommendation</div>
		<Badge
			label={recommendationLabel(preview.recommendation)}
			color={recommendationColor(preview.recommendation)}
		/>
	</div>

	<Field label="Notes" inputId="notes">
		<TextAreaInput
			id="notes"
			label="Notes"
			rows={3}
			placeholder="Free-text notes accompanying the request…"
			bind:value={d.notes}
		/>
	</Field>
</Fieldset>
