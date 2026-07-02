<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';

	const m = assessment.data.monitoring;
</script>

<Fieldset legend="Step 5 of 8 — Monitoring">
	<p class="hint">Blood tests and other monitoring due or overdue for the patient's medicines.</p>

	<Field
		label="Monitoring due / outstanding"
		required
		description="Required for a complete review."
		inputId="monitoring-monitoringDue"
	>
		<TextAreaInput
			id="monitoring-monitoringDue"
			label="Monitoring due / outstanding"
			rows={3}
			placeholder="e.g. U&amp;Es for ACE inhibitor, INR for warfarin, annual lithium level"
			bind:value={m.monitoringDue}
		/>
	</Field>

	<Field
		label="Number of overdue monitoring items"
		description="One or more overdue items raises a monitoring flag."
		inputId="monitoring-overdueMonitoringCount"
	>
		<NumberInput
			id="monitoring-overdueMonitoringCount"
			label="Number of overdue monitoring items"
			min={0}
			max={50}
			step={1}
			bind:value={m.overdueMonitoringCount}
		/>
	</Field>
</Fieldset>
