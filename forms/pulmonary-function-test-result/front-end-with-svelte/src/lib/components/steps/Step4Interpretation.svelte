<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;

	const critical = $derived(
		(d.airflowObstruction || d.restriction) &&
			(d.severity === 'severe' || d.severity === 'very-severe')
	);
</script>

<Fieldset legend="4. Interpretation">
	<p class="hint">The distilled ventilatory pattern, severity, reversibility, and structured findings.</p>

	<Field label="Ventilatory pattern" inputId="ventilatoryPattern">
		<Select id="ventilatoryPattern" label="Ventilatory pattern" bind:value={d.ventilatoryPattern}>
			<option value="">Select…</option>
			<option value="normal">Normal</option>
			<option value="obstructive">Obstructive</option>
			<option value="restrictive">Restrictive</option>
			<option value="mixed">Mixed</option>
		</Select>
	</Field>

	<Field
		label="Severity"
		inputId="severity"
		description="ATS/ERS z-score or GOLD percent-predicted severity band."
	>
		<Select id="severity" label="Severity" bind:value={d.severity}>
			<option value="">Select…</option>
			<option value="none">None</option>
			<option value="mild">Mild</option>
			<option value="moderate">Moderate</option>
			<option value="severe">Severe</option>
			<option value="very-severe">Very severe</option>
		</Select>
	</Field>

	<Field label="Bronchodilator reversibility" inputId="bronchodilatorReversibility">
		<Select
			id="bronchodilatorReversibility"
			label="Bronchodilator reversibility"
			bind:value={d.bronchodilatorReversibility}
		>
			<option value="">Select…</option>
			<option value="positive">Positive</option>
			<option value="negative">Negative</option>
			<option value="not-tested">Not tested</option>
		</Select>
	</Field>

	<Field label="Structured findings">
		<CheckboxGroup label="Structured findings">
			<label><CheckboxInput label="Airflow obstruction" bind:checked={d.airflowObstruction} /> Airflow obstruction</label>
			<label><CheckboxInput label="Restriction" bind:checked={d.restriction} /> Restriction</label>
			<label><CheckboxInput label="Reduced gas transfer" bind:checked={d.reducedGasTransfer} /> Reduced gas transfer</label>
			<label><CheckboxInput label="Significant reversibility" bind:checked={d.significantReversibility} /> Significant reversibility</label>
			<label><CheckboxInput label="Normal spirometry" bind:checked={d.normalSpirometry} /> Normal spirometry</label>
		</CheckboxGroup>
	</Field>

	{#if critical}
		<Alert type="error" heading="Critical finding selected">
			<p>
				Severe or very-severe airflow obstruction or restriction auto-escalates the follow-up
				urgency to a critical alert. Ensure the result is communicated to the referrer on sign-off.
			</p>
		</Alert>
	{/if}
</Fieldset>
