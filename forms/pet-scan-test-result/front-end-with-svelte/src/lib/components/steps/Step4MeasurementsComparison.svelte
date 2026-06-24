<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;
</script>

<Fieldset legend="4. Measurements & Comparison">
	<p class="hint">Key metabolic measurements, comparison, and treatment response.</p>

	<Field
		label="SUVmax"
		inputId="suvMax"
		description="Maximum standardised uptake value of the most-avid reference lesion."
	>
		<NumberInput
			id="suvMax"
			label="SUVmax"
			min={0}
			max={1000}
			step={0.1}
			bind:value={d.suvMax}
		/>
	</Field>

	<Field
		label="Largest lesion size (mm)"
		inputId="largestLesionSizeMm"
		description="Largest lesion long-axis size, for surveillance and categorisation."
	>
		<NumberInput
			id="largestLesionSizeMm"
			label="Largest lesion size (mm)"
			min={0}
			max={2000}
			step={0.1}
			bind:value={d.largestLesionSizeMm}
		/>
	</Field>

	<Field label="Comparison with previous imaging" inputId="comparisonWithPrevious">
		<TextAreaInput
			id="comparisonWithPrevious"
			label="Comparison with previous imaging"
			rows={3}
			placeholder="Relevant previous PET-CT or other studies and metabolic changes since…"
			bind:value={d.comparisonWithPrevious}
		/>
	</Field>

	<Field
		label="Treatment response"
		inputId="treatmentResponse"
		description="Metabolic response category (maps onto PERCIST)."
	>
		<Select id="treatmentResponse" label="Treatment response" bind:value={d.treatmentResponse}>
			<option value="">Select…</option>
			<option value="complete">Complete metabolic response</option>
			<option value="partial">Partial metabolic response</option>
			<option value="stable">Stable metabolic disease</option>
			<option value="progressive">Progressive metabolic disease</option>
			<option value="not-applicable">Not applicable</option>
		</Select>
	</Field>

	{#if d.treatmentResponse === 'progressive'}
		<Alert type="error" heading="Progressive metabolic disease">
			<p>
				A progressive treatment response auto-escalates the follow-up urgency to a critical alert.
				Ensure the result is communicated to the referrer on sign-off.
			</p>
		</Alert>
	{/if}
</Fieldset>
