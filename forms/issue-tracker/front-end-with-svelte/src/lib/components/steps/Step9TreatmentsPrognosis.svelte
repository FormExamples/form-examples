<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const t = assessment.data.txpx;
</script>

<Fieldset legend="Treatments & Prognosis">
	<p class="hint">How the issue will be fixed, and the outlook once it is.</p>

	<Field label="Mitigation steps" inputId="txMitigationSteps">
		<TextAreaInput id="txMitigationSteps" label="Mitigation steps" rows={3} bind:value={t.txMitigationSteps} />
	</Field>

	<Field label="Fix plan" inputId="txFixPlan">
		<TextAreaInput id="txFixPlan" label="Fix plan" rows={3} bind:value={t.txFixPlan} />
	</Field>

	<Field label="Workaround" inputId="txWorkaround">
		<TextAreaInput id="txWorkaround" label="Workaround" rows={2} bind:value={t.txWorkaround} />
	</Field>

	<Field label="Rollback plan" inputId="txRollbackPlan">
		<TextAreaInput id="txRollbackPlan" label="Rollback plan" rows={2} bind:value={t.txRollbackPlan} />
	</Field>

	<Field label="Communication plan" inputId="txCommunicationPlan">
		<TextAreaInput id="txCommunicationPlan" label="Communication plan" rows={2} bind:value={t.txCommunicationPlan} />
	</Field>

	<div class="field-grid">
		<Field label="Expected resolution at" inputId="pxExpectedResolutionAt">
			<DateInput id="pxExpectedResolutionAt" label="Expected resolution at" bind:value={t.pxExpectedResolutionAt} />
		</Field>
		<Field label="Recurrence likelihood" inputId="pxRecurrenceLikelihood">
			<Select id="pxRecurrenceLikelihood" label="Recurrence likelihood" bind:value={t.pxRecurrenceLikelihood}>
				<option value="">-- Select --</option>
				<option value="very-low">Very low</option>
				<option value="low">Low</option>
				<option value="moderate">Moderate</option>
				<option value="high">High</option>
				<option value="very-high">Very high</option>
			</Select>
		</Field>
	</div>

	<Field label="Residual risk" inputId="pxResidualRisk">
		<TextAreaInput id="pxResidualRisk" label="Residual risk" rows={2} bind:value={t.pxResidualRisk} />
	</Field>

	<Field label="Monitoring plan" inputId="pxMonitoringPlan">
		<TextAreaInput id="pxMonitoringPlan" label="Monitoring plan" rows={2} bind:value={t.pxMonitoringPlan} />
	</Field>

	<Field label="Lessons learned" inputId="pxLessonsLearned">
		<TextAreaInput id="pxLessonsLearned" label="Lessons learned" rows={3} bind:value={t.pxLessonsLearned} />
	</Field>
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
