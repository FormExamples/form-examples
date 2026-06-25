<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { resultStore } from '$lib/stores/result.svelte';
	import { calculateGrade } from '$lib/engine/grader';
	import {
		resultClassificationLabel,
		resultClassificationColor,
		abnormalitySeverityLabel,
		abnormalitySeverityColor,
		followUpUrgencyLabel,
		followUpUrgencyColor
	} from '$lib/engine/utils';

	const d = resultStore.data;

	// Live preview of the four-axis grade as the report is edited.
	const preview = $derived(calculateGrade(d));
</script>

<Fieldset legend="7. Interpretation & Sign-off">
	<p class="hint">Live four-axis interpretation grade, critical-result communication, and sign-off.</p>

	{#if preview.followUpUrgency === 'critical-alert'}
		<Alert type="error" heading="Critical-result alert">
			<p>
				This report contains a critical event (anaphylaxis during the test). Communicate the result
				directly to the referrer and record it below before signing.
			</p>
		</Alert>
	{/if}

	<div class="my-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
		<div class="rounded-lg border border-gray-200 p-3">
			<div class="mb-1 text-xs font-semibold text-gray-500">Axis A — Classification</div>
			<Badge
				label={resultClassificationLabel(preview.resultClassification)}
				color={resultClassificationColor(preview.resultClassification)}
			/>
		</div>
		<div class="rounded-lg border border-gray-200 p-3">
			<div class="mb-1 text-xs font-semibold text-gray-500">Axis B — Severity</div>
			<Badge
				label={abnormalitySeverityLabel(preview.abnormalitySeverity)}
				color={abnormalitySeverityColor(preview.abnormalitySeverity)}
			/>
			{#if preview.reportingCategory}
				<span class="ml-2 text-xs text-gray-500">{preview.reportingCategory}</span>
			{/if}
		</div>
		<div class="rounded-lg border border-gray-200 p-3">
			<div class="mb-1 text-xs font-semibold text-gray-500">Axis C — Completeness</div>
			<span class="text-lg font-bold text-gray-900">{preview.reportCompletenessPercent}%</span>
		</div>
		<div class="rounded-lg border border-gray-200 p-3">
			<div class="mb-1 text-xs font-semibold text-gray-500">Axis D — Follow-up urgency</div>
			<Badge
				label={followUpUrgencyLabel(preview.followUpUrgency)}
				color={followUpUrgencyColor(preview.followUpUrgency)}
			/>
			<div class="mt-1 text-xs text-gray-500">{preview.targetTimeframe}</div>
		</div>
	</div>

	<Field label="Critical-result communication">
		<CheckboxGroup label="Critical-result communication">
			<label>
				<CheckboxInput
					label="Critical / urgent result communicated to referrer"
					bind:checked={d.criticalResultCommunicated}
				/> Critical / urgent result communicated to referrer
			</label>
		</CheckboxGroup>
	</Field>

	<Field label="Reported to" inputId="reportedTo">
		<TextInput
			id="reportedTo"
			label="Reported to"
			placeholder="Who was informed, with date and time"
			bind:value={d.reportedTo}
		/>
	</Field>

	<Field label="Interpretation / sign-off notes" inputId="clinicianNotes">
		<TextAreaInput
			id="clinicianNotes"
			label="Interpretation / sign-off notes"
			rows={3}
			bind:value={d.clinicianNotes}
		/>
	</Field>

	<Field label="Sign-off">
		<CheckboxGroup label="Sign-off">
			<label>
				<CheckboxInput label="I sign and authorise this report" bind:checked={d.signed} /> I sign and
				authorise this report
			</label>
		</CheckboxGroup>
	</Field>
</Fieldset>
