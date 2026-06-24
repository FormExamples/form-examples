<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;
</script>

<Fieldset legend="4. Trend">
	<p class="hint">Comparison with the previous value drives the monitoring / response interpretation.</p>

	<Field
		label="Previous value"
		inputId="previousValue"
		description="Most recent previous value of the principal marker, for trend interpretation."
	>
		<NumberInput id="previousValue" label="Previous value" min={0} step={0.1} bind:value={d.previousValue} />
	</Field>

	<Field label="Trend" inputId="trend">
		<Select id="trend" label="Trend" bind:value={d.trend}>
			<option value="">Select…</option>
			<option value="rising">Rising</option>
			<option value="stable">Stable</option>
			<option value="falling">Falling</option>
			<option value="not-applicable">Not applicable</option>
		</Select>
	</Field>

	<Field label="Comparison with previous" inputId="comparisonWithPrevious">
		<TextAreaInput
			id="comparisonWithPrevious"
			label="Comparison with previous"
			rows={3}
			placeholder="Narrative comparison with previous tumour-marker results…"
			bind:value={d.comparisonWithPrevious}
		/>
	</Field>
</Fieldset>
