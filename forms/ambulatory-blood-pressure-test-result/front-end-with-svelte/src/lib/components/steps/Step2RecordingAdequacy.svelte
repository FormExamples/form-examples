<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = $state(resultStore.data);
</script>

<Fieldset legend="2. Recording Adequacy">
	<p class="hint">Whether enough valid readings were captured for a diagnostic interpretation.</p>

	<Field
		label="Valid readings (%)"
		inputId="validReadingsPercent"
		description="Percentage of successful readings over the monitoring period; ABPM is generally adequate at >= 70%."
	>
		<NumberInput
			id="validReadingsPercent"
			label="Valid readings (%)"
			min={0}
			max={100}
			step={0.1}
			bind:value={d.validReadingsPercent}
		/>
	</Field>

	<Field label="Recording adequate">
		<CheckboxGroup label="Recording adequate">
			<label>
				<CheckboxInput
					label="Recording met the adequacy threshold for a diagnostic interpretation"
					bind:checked={d.recordingAdequate}
				/> Recording met the adequacy threshold for a diagnostic interpretation
			</label>
		</CheckboxGroup>
	</Field>

	{#if !d.recordingAdequate && d.validReadingsPercent !== null && d.validReadingsPercent < 70}
		<Alert type="warning" heading="Inadequate recording">
			<p>
				Fewer than 70% of readings were valid. Diagnostic confidence may be reduced; consider
				repeating the monitoring period.
			</p>
		</Alert>
	{/if}
</Fieldset>
