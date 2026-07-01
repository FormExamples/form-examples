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
		responseClassificationLabel,
		responseClassificationColor,
		severityLabel,
		severityColor,
		followUpUrgencyLabel,
		followUpUrgencyColor
	} from '$lib/engine/utils';

	const d = resultStore.data;

	// Live preview of the four-axis grade as the response is edited.
	const preview = $derived(calculateGrade(d));
</script>

<Fieldset legend="7. Sign-off">
	<p class="hint">Live four-axis interpretation grade, critical-result communication, and sign-off.</p>

	<Field label="Critical result">
		<CheckboxGroup label="Critical result">
			<label>
				<CheckboxInput
					label="A critical or unexpected significant cardiac result is present"
					bind:checked={d.criticalResult}
				/> A critical or unexpected significant cardiac result is present (auto-escalates to critical alert)
			</label>
		</CheckboxGroup>
	</Field>

	{#if preview.followUpUrgency === 'critical-alert'}
		<Alert type="error" heading="Critical-result alert">
			<p>
				This response contains a critical result. Communicate it directly to the referrer, arrange
				urgent review, and record the communication below before signing.
			</p>
		</Alert>
	{/if}

	<div class="my-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
		<div class="rounded-lg border border-base-300 p-3">
			<div class="mb-1 text-xs font-semibold text-base-content/60">Axis A — Classification</div>
			<Badge
				label={responseClassificationLabel(preview.responseClassification)}
				color={responseClassificationColor(preview.responseClassification)}
			/>
		</div>
		<div class="rounded-lg border border-base-300 p-3">
			<div class="mb-1 text-xs font-semibold text-base-content/60">Axis B — Severity</div>
			<Badge label={severityLabel(preview.severity)} color={severityColor(preview.severity)} />
			{#if preview.severityCategory}
				<span class="ml-2 text-xs text-base-content/60">{preview.severityCategory}</span>
			{/if}
		</div>
		<div class="rounded-lg border border-base-300 p-3">
			<div class="mb-1 text-xs font-semibold text-base-content/60">Axis C — Completeness</div>
			<span class="text-lg font-bold text-base-content">{preview.completenessPercent}%</span>
		</div>
		<div class="rounded-lg border border-base-300 p-3">
			<div class="mb-1 text-xs font-semibold text-base-content/60">Axis D — Follow-up urgency</div>
			<Badge
				label={followUpUrgencyLabel(preview.followUpUrgency)}
				color={followUpUrgencyColor(preview.followUpUrgency)}
			/>
			<div class="mt-1 text-xs text-base-content/60">{preview.targetTimeframe}</div>
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
				<CheckboxInput label="I sign and authorise this response" bind:checked={d.signed} /> I sign and
				authorise this response
			</label>
		</CheckboxGroup>
	</Field>
</Fieldset>
