<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = resultStore.data;

	// A severe, demyelinating peripheral neuropathy is treated as a severe acute
	// neuropathy (e.g. a GBS pattern) and auto-escalates to a critical alert.
	const isSevereAcuteNeuropathy = $derived(
		d.peripheralNeuropathy && d.severity === 'severe' && d.pattern === 'demyelinating'
	);
</script>

<Fieldset legend="5. Characterisation">
	<p class="hint">The overall severity and predominant pathophysiological pattern.</p>

	<Field
		label="Severity"
		inputId="severity"
		description="AANEM severity descriptor for the predominant abnormality."
	>
		<Select id="severity" label="Severity" bind:value={d.severity}>
			<option value="">Select…</option>
			<option value="mild">Mild</option>
			<option value="moderate">Moderate</option>
			<option value="severe">Severe</option>
			<option value="not-applicable">Not applicable</option>
		</Select>
	</Field>

	<Field
		label="Pattern"
		inputId="pattern"
		description="Predominant pathophysiological pattern (axonal vs demyelinating)."
	>
		<Select id="pattern" label="Pattern" bind:value={d.pattern}>
			<option value="">Select…</option>
			<option value="demyelinating">Demyelinating</option>
			<option value="axonal">Axonal</option>
			<option value="mixed">Mixed</option>
			<option value="not-applicable">Not applicable</option>
		</Select>
	</Field>

	{#if isSevereAcuteNeuropathy}
		<Alert type="error" heading="Severe acute neuropathy pattern">
			<p>
				A severe, demyelinating peripheral neuropathy (e.g. a Guillain-Barré syndrome pattern)
				auto-escalates the follow-up urgency to a critical alert and warrants urgent neurology
				review.
			</p>
		</Alert>
	{/if}
</Fieldset>
