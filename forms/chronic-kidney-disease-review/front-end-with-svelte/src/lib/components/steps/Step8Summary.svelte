<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { review } from '$lib/engine/ckd-review-grader';
	import {
		gfrCategoryLabel,
		gfrCategoryColor,
		albuminuriaCategoryLabel,
		albuminuriaCategoryColor,
		kdigoRiskZoneLabel,
		kdigoRiskZoneColor,
		reviewStatusLabel,
		reviewStatusColor
	} from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';

	const s = assessment.data.summary;

	// Live KDIGO classification and completeness readout, recomputed as the
	// clinician types. Uses the same pure engine that grades the report.
	const live = $derived(review(assessment.data));
	const bpt = $derived(live.bloodPressureTarget);
	const bpNote = $derived(
		live.bloodPressureAtTarget === null
			? 'no blood pressure recorded'
			: live.bloodPressureAtTarget
				? 'at target'
				: 'above target'
	);
</script>

<Fieldset legend="Step 8 of 8 — Referral and summary">
	<p class="hint">
		Live KDIGO classification and review completeness, plus the referral decision and a clinician
		note.
	</p>

	<div class="rounded-xl border border-base-300 bg-base-100 p-4">
		<div class="mb-3 flex flex-wrap items-center gap-2 text-sm">
			<span class="text-base-content/70">G-stage</span>
			<Badge label={gfrCategoryLabel(live.gfrCategory)} colorClass={gfrCategoryColor(live.gfrCategory)} />
			<span class="text-base-content/70">A-stage</span>
			<Badge
				label={albuminuriaCategoryLabel(live.albuminuriaCategory)}
				colorClass={albuminuriaCategoryColor(live.albuminuriaCategory)}
			/>
		</div>
		<div class="mb-3 flex flex-wrap items-center gap-2 text-sm">
			<span class="text-base-content/70">KDIGO zone</span>
			<Badge label={kdigoRiskZoneLabel(live.kdigoRiskZone)} colorClass={kdigoRiskZoneColor(live.kdigoRiskZone)} />
			{#if bpt}
				<span class="text-base-content/60">(target {bpt.systolic}/{bpt.diastolic}; {bpNote})</span>
			{/if}
		</div>
		<div class="flex flex-wrap items-center gap-2 text-sm">
			<span class="text-base-content/70">Review</span>
			<Badge label={reviewStatusLabel(live.reviewStatus)} colorClass={reviewStatusColor(live.reviewStatus)} />
			<span class="text-base-content/60">
				({live.completenessScore} of {live.componentStatuses.length} bundle items;
				{live.flaggedIssues.length} flag{live.flaggedIssues.length === 1 ? '' : 's'})
			</span>
		</div>
	</div>

	<Field label="Referral decision" inputId="summary-referralDecision">
		<Select id="summary-referralDecision" label="Referral decision" bind:value={s.referralDecision}>
			<option value="">— Select —</option>
			<option value="none">No referral</option>
			<option value="monitor">Continue monitoring</option>
			<option value="refer-nephrology">Refer to nephrology</option>
			<option value="already-under-nephrology">Already under nephrology</option>
		</Select>
	</Field>

	<Field label="Clinician note (plan and recall interval)" inputId="summary-clinicalNote">
		<TextAreaInput
			id="summary-clinicalNote"
			label="Clinician note (plan and recall interval)"
			rows={5}
			placeholder="Free-text summary drawing the review together, with the plan and recall interval."
			bind:value={s.clinicalNote}
		/>
	</Field>
</Fieldset>
