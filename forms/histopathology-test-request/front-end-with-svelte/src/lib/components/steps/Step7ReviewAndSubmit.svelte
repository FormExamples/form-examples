<script lang="ts">
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { request } from '$lib/stores/result.svelte';
	import { calculateGrade } from '$lib/engine/grader';
	import {
		appropriatenessLabel,
		appropriatenessColor,
		specimenQualityLabel,
		specimenQualityColor,
		triageTierLabel,
		triageTierColor,
		recommendationLabel,
		recommendationColor
	} from '$lib/engine/utils';

	const d = request.data;

	// Live preview of the four-axis vetting grade as the request is edited.
	const preview = $derived(calculateGrade(d));
</script>

<Fieldset legend="7. Review and Submit">
	<p class="hint">Live four-axis vetting grade, safety flags, and the overall recommendation.</p>

	{#if preview.immediate}
		<Alert type="error" heading="Immediate (intra-operative) frozen section">
			<p>
				This request is for an urgent intra-operative frozen section. Alert the on-call pathologist
				now; the patient is in theatre awaiting an immediate diagnosis.
			</p>
		</Alert>
	{:else if preview.specimenQualityBand === 'reject-risk'}
		<Alert type="error" heading="Specimen reject risk">
			<p>
				The specimen may be unfit for diagnosis (fresh / unfixed outside a frozen-section pathway,
				or no fixative recorded). Contact the requester urgently.
			</p>
		</Alert>
	{:else if preview.triageTier === 'two-week-wait'}
		<Alert type="warning" heading="Two-week-wait (suspected cancer) pathway">
			<p>This request has been escalated to the suspected-cancer (NICE NG12) pathway.</p>
		</Alert>
	{/if}

	<div class="my-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
		<div class="rounded-lg border border-base-300 p-3">
			<div class="mb-1 text-xs font-semibold text-base-content/60">Axis A — Appropriateness</div>
			<Badge
				label={appropriatenessLabel(preview.appropriatenessBand)}
				color={appropriatenessColor(preview.appropriatenessBand)}
			/>
			<div class="mt-1 text-xs text-base-content/60">Score {preview.appropriatenessScore} / 9</div>
		</div>
		<div class="rounded-lg border border-base-300 p-3">
			<div class="mb-1 text-xs font-semibold text-base-content/60">Axis B — Specimen quality</div>
			<Badge
				label={specimenQualityLabel(preview.specimenQualityBand)}
				color={specimenQualityColor(preview.specimenQualityBand)}
			/>
		</div>
		<div class="rounded-lg border border-base-300 p-3">
			<div class="mb-1 text-xs font-semibold text-base-content/60">Axis C — Completeness</div>
			<span class="text-lg font-bold text-base-content">{preview.completenessPercent}%</span>
		</div>
		<div class="rounded-lg border border-base-300 p-3">
			<div class="mb-1 text-xs font-semibold text-base-content/60">Axis D — Urgency triage</div>
			<Badge label={triageTierLabel(preview.triageTier)} color={triageTierColor(preview.triageTier)} />
			<div class="mt-1 text-xs text-base-content/60">{preview.targetTimeframe}</div>
		</div>
	</div>

	<div class="my-4 rounded-lg border border-base-300 p-3">
		<div class="mb-1 text-xs font-semibold text-base-content/60">Overall recommendation</div>
		<Badge
			label={recommendationLabel(preview.recommendation)}
			color={recommendationColor(preview.recommendation)}
		/>
	</div>
</Fieldset>
