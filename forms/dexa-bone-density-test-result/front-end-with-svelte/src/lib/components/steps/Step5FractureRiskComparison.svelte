<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = resultStore.data;
</script>

<Fieldset legend="5. Fracture Risk & Comparison">
	<p class="hint">FRAX 10-year probabilities, vertebral-fracture status, and comparison with previous imaging.</p>

	<Field label="FRAX 10-year major fracture (%)" inputId="fraxMajorFracturePercent"
		description="FRAX 10-year major osteoporotic fracture probability.">
		<NumberInput id="fraxMajorFracturePercent" label="FRAX 10-year major fracture (%)" min={0}
			max={100} step={0.1} bind:value={d.fraxMajorFracturePercent} />
	</Field>

	<Field label="FRAX 10-year hip fracture (%)" inputId="fraxHipFracturePercent"
		description="FRAX 10-year hip fracture probability.">
		<NumberInput id="fraxHipFracturePercent" label="FRAX 10-year hip fracture (%)" min={0} max={100}
			step={0.1} bind:value={d.fraxHipFracturePercent} />
	</Field>

	<Field label="Vertebral fracture">
		<CheckboxGroup label="Vertebral fracture">
			<label>
				<CheckboxInput
					label="Vertebral fracture identified"
					bind:checked={d.vertebralFractureIdentified}
				/> Vertebral fracture identified
			</label>
		</CheckboxGroup>
	</Field>

	{#if d.vertebralFractureIdentified}
		<Alert type="warning" heading="Fragility fracture noted">
			<p>
				With a T-score of −2.5 or below, an identified vertebral / fragility fracture establishes
				severe osteoporosis and auto-escalates the follow-up urgency to a critical alert.
			</p>
		</Alert>
	{/if}

	<Field label="Comparison with previous imaging" inputId="comparisonWithPrevious">
		<TextAreaInput
			id="comparisonWithPrevious"
			label="Comparison with previous imaging"
			rows={3}
			placeholder="Relevant previous DEXA and changes since…"
			bind:value={d.comparisonWithPrevious}
		/>
	</Field>

	<Field label="BMD change since previous (%)" inputId="percentChangeSincePrevious"
		description="Positive = gain, negative = loss, for monitoring.">
		<NumberInput id="percentChangeSincePrevious" label="BMD change since previous (%)" min={-100}
			max={100} step={0.1} bind:value={d.percentChangeSincePrevious} />
	</Field>
</Fieldset>
