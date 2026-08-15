<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';
	import { QTC_PROLONGED_MS } from '#lib/engine/utils.js';

	const d = resultStore.data;
</script>

<Fieldset legend="3. Rate, Rhythm & Intervals">
	<p class="hint">Ventricular rate, dominant rhythm, the PR / QRS / QT / QTc intervals, and cardiac axis.</p>

	<Field
		label="Ventricular rate (bpm)"
		inputId="ventricularRateBpm"
		description="Ventricular rate in beats per minute."
	>
		<NumberInput
			id="ventricularRateBpm"
			label="Ventricular rate (bpm)"
			min={0}
			max={400}
			step={1}
			bind:value={d.ventricularRateBpm}
		/>
	</Field>

	<Field label="Rhythm" inputId="rhythm">
		<Select id="rhythm" label="Rhythm" bind:value={d.rhythm}>
			<option value="">Select…</option>
			<option value="sinus">Sinus</option>
			<option value="atrial-fibrillation">Atrial fibrillation</option>
			<option value="atrial-flutter">Atrial flutter</option>
			<option value="svt">SVT</option>
			<option value="ventricular-tachycardia">Ventricular tachycardia</option>
			<option value="heart-block">Heart block</option>
			<option value="paced">Paced</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field
		label="PR interval (ms)"
		inputId="prIntervalMs"
		description="Normal ~120–200 ms; prolongation suggests AV conduction delay / heart block."
	>
		<NumberInput
			id="prIntervalMs"
			label="PR interval (ms)"
			min={0}
			max={1000}
			step={1}
			bind:value={d.prIntervalMs}
		/>
	</Field>

	<Field
		label="QRS duration (ms)"
		inputId="qrsDurationMs"
		description="Normal < 120 ms; widening suggests bundle branch block or ventricular origin."
	>
		<NumberInput
			id="qrsDurationMs"
			label="QRS duration (ms)"
			min={0}
			max={1000}
			step={1}
			bind:value={d.qrsDurationMs}
		/>
	</Field>

	<Field label="QT interval (ms)" inputId="qtIntervalMs">
		<NumberInput
			id="qtIntervalMs"
			label="QT interval (ms)"
			min={0}
			max={1000}
			step={1}
			bind:value={d.qtIntervalMs}
		/>
	</Field>

	<Field
		label="QTc (ms)"
		inputId="qtcMs"
		description={`Rate-corrected QT; ≥ ${QTC_PROLONGED_MS} ms is markedly prolonged with torsades-de-pointes risk.`}
	>
		<NumberInput
			id="qtcMs"
			label="QTc (ms)"
			min={0}
			max={1000}
			step={1}
			bind:value={d.qtcMs}
		/>
	</Field>

	<Field label="Cardiac axis" inputId="cardiacAxis">
		<Select id="cardiacAxis" label="Cardiac axis" bind:value={d.cardiacAxis}>
			<option value="">Select…</option>
			<option value="normal">Normal</option>
			<option value="left-deviation">Left deviation</option>
			<option value="right-deviation">Right deviation</option>
		</Select>
	</Field>

	{#if (d.qtcMs !== null && d.qtcMs >= QTC_PROLONGED_MS) || d.rhythm === 'ventricular-tachycardia' || d.rhythm === 'heart-block'}
		<Alert type="error" heading="Critical finding selected">
			<p>
				A markedly prolonged QTc (≥ {QTC_PROLONGED_MS} ms), ventricular tachycardia, or complete
				heart block auto-escalates the follow-up urgency to a critical alert. Ensure the result is
				communicated to the responsible team on sign-off.
			</p>
		</Alert>
	{/if}
</Fieldset>
