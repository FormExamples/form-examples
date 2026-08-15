<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';
	import Badge from '#lib/components/ui/Badge.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';
	import { calculateGrade } from '#lib/engine/grader.js';
	import {
		outcomeClassificationLabel,
		outcomeClassificationColor,
		legalRiskBandLabel,
		legalRiskBandColor,
		followUpUrgencyLabel,
		followUpUrgencyColor
	} from '#lib/engine/utils.js';

	const d = resultStore.data;

	// Live preview of the four-axis grade as the response is edited.
	const preview = $derived(calculateGrade(d));
</script>

<Fieldset legend="7. Sign-off">
	<p class="hint">Escalation, notes, the live four-axis grade, and sign-off.</p>

	<Field label="Escalation">
		<CheckboxGroup label="Escalation">
			<label>
				<CheckboxInput
					label="The matter has been escalated (dispute, grievance, or appeal)"
					bind:checked={d.escalated}
				/> The matter has been escalated (dispute, grievance, or appeal)
			</label>
		</CheckboxGroup>
	</Field>

	{#if d.escalated}
		<Field label="Escalation detail" inputId="escalationDetail">
			<TextAreaInput
				id="escalationDetail"
				label="Escalation detail"
				rows={2}
				placeholder="Detail of the dispute, grievance, or appeal…"
				bind:value={d.escalationDetail}
			/>
		</Field>
	{/if}

	{#if preview.legalRiskBand === 'high-risk'}
		<Alert type="error" heading="Discrimination-risk alert">
			<p>
				Adjustments have been declined for a worker likely covered by the Equality Act 2010 without
				adequate justification or alternatives. Reconsider the decision, or record a reasonableness
				justification and offer alternatives before finalising.
			</p>
		</Alert>
	{/if}

	<div class="my-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
		<div class="rounded-lg border border-base-300 p-3">
			<div class="mb-1 text-xs font-semibold text-base-content/60">Axis A — Outcome</div>
			<Badge
				label={outcomeClassificationLabel(preview.outcomeClassification)}
				color={outcomeClassificationColor(preview.outcomeClassification)}
			/>
		</div>
		<div class="rounded-lg border border-base-300 p-3">
			<div class="mb-1 text-xs font-semibold text-base-content/60">Axis B — Legal / discrimination risk</div>
			<Badge
				label={legalRiskBandLabel(preview.legalRiskBand)}
				color={legalRiskBandColor(preview.legalRiskBand)}
			/>
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

	<p class="mb-4 text-sm text-base-content/70">
		Recommendation: <span class="font-semibold">{preview.recommendationLabel}</span>
	</p>

	<Field label="Notes" inputId="notes">
		<TextAreaInput id="notes" label="Notes" rows={3} bind:value={d.notes} />
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
