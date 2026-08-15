<script lang="ts">
	import Alert from '$lib/components/ui/Alert.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { OPTIONS } from '$lib/config/options';
	import {
		AUDIT_C_BAND_LABELS,
		PARQ_CLEARANCE_LABELS,
		RECOMMENDATION_LABELS,
		RISK_BAND_LABELS
	} from '$lib/engine/grader';
	import { questionnaireStore } from '$lib/stores/questionnaire.svelte';

	const d = questionnaireStore.data;
	const result = $derived(questionnaireStore.result);
</script>

<Fieldset legend="14. Summary and Recommendation">
	<p class="hint">Computed results, the assessor's final call, and sign-off.</p>

	<dl class="space-y-2 text-sm">
		<div class="flex justify-between gap-4">
			<dt class="text-base-content/70">PAR-Q+ clearance</dt>
			<dd class="font-semibold">
				{result.parqPlusClearance ? PARQ_CLEARANCE_LABELS[result.parqPlusClearance] : '—'}
			</dd>
		</div>
		<div class="flex justify-between gap-4">
			<dt class="text-base-content/70">AUDIT-C</dt>
			<dd class="font-semibold">
				{result.auditCScore === null ? '—' : `${result.auditCScore} / 12`}
				{result.auditCBand ? `— ${AUDIT_C_BAND_LABELS[result.auditCBand]}` : ''}
			</dd>
		</div>
		<div class="flex justify-between gap-4">
			<dt class="text-base-content/70">Computed risk band</dt>
			<dd class="font-semibold">
				{result.isPaediatric ? 'Not scored — paediatric' : RISK_BAND_LABELS[result.computedRiskBand || 'low']}
			</dd>
		</div>
		<div class="flex justify-between gap-4">
			<dt class="text-base-content/70">Computed recommendation</dt>
			<dd class="font-semibold">{RECOMMENDATION_LABELS[result.computedRecommendation || 'clear-to-proceed']}</dd>
		</div>
	</dl>

	{#if result.flags.length > 0}
		<Alert type="warning" class="mt-4">
			{result.flags.length} safety flag{result.flags.length === 1 ? '' : 's'} raised. Flags are never
			suppressed by an override below.
		</Alert>
	{/if}

	<Field label="Override risk band" inputId="summary-overrideRiskBand"
		description="Leave unset to accept the computed risk band. Setting a different value requires a reason.">
		<Select id="summary-overrideRiskBand" label="Override risk band" bind:value={d.summary.overrideRiskBand}>
			<option value="">— Use computed value —</option>
			{#each OPTIONS.riskBand as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	{#if d.summary.overrideRiskBand && d.summary.overrideRiskBand !== result.computedRiskBand}
		<Field label="Override reason" inputId="summary-overrideReason" required>
			<TextAreaInput id="summary-overrideReason" label="Override reason" rows={2} bind:value={d.summary.overrideReason} required />
		</Field>
	{/if}
	<Field label="Notes" inputId="summary-notes">
		<TextAreaInput id="summary-notes" label="Notes" rows={3} bind:value={d.summary.notes} />
	</Field>
	<Field label="Signed by" inputId="summary-signedByName" required
		description="Electronic signature — required before the report is final.">
		<TextInput id="summary-signedByName" label="Signed by" bind:value={d.summary.signedByName} required />
	</Field>
</Fieldset>
