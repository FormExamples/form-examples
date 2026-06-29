<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import YesNoNA from '$lib/components/ui/YesNoNA.svelte';

	const d = assessment.data.incidentReporting;
</script>

<Fieldset legend="Incident Reporting & Near Misses">
	<p class="hint">Reporting system use, RIDDOR compliance, near-miss culture, lessons learned.</p>

	<YesNoNA id="incidentReportingSystemUsed" label="Incident reporting system is in active use." bind:value={d.incidentReportingSystemUsed} />
	<YesNoNA id="riddorReportableIncidentsReported" label="RIDDOR-reportable incidents have been reported to HSE." bind:value={d.riddorReportableIncidentsReported} />
	<YesNoNA id="nearMissReportingActive" label="Near-miss reporting culture is active." bind:value={d.nearMissReportingActive} />

	<div class="field-grid">
		<Field label="Incidents (last 12 months)" inputId="incidentsLast12Months">
			<NumberInput id="incidentsLast12Months" label="Incidents (last 12 months)" min={0} step={1} bind:value={d.incidentsLast12Months} />
		</Field>
		<Field label="Near misses (last 12 months)" inputId="nearMissesLast12Months">
			<NumberInput id="nearMissesLast12Months" label="Near misses (last 12 months)" min={0} step={1} bind:value={d.nearMissesLast12Months} />
		</Field>
	</div>

	<YesNoNA id="lessonsLearnedShared" label="Lessons learned are shared across the team." bind:value={d.lessonsLearnedShared} />
	<YesNoNA id="actionsFromIncidentsTracked" label="Actions arising from incidents are tracked to completion." bind:value={d.actionsFromIncidentsTracked} />

	<Field label="Observations" inputId="incidentObservations">
		<TextAreaInput id="incidentObservations" label="Observations" rows={3} placeholder="System name, recent RIDDOR submissions, etc.…" bind:value={d.observations} />
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
