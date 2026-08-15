<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = resultStore.data;
</script>

<Fieldset legend="4. Findings">
	<p class="hint">The structured ECG / symptom / arrhythmia findings and the overall conclusion.</p>

	<Field label="Structured findings">
		<CheckboxGroup label="Structured findings">
			<label><CheckboxInput label="Ischaemic ST changes induced" bind:checked={d.ischaemicStChanges} /> Ischaemic ST changes induced</label>
			<label><CheckboxInput label="Chest pain induced" bind:checked={d.chestPainInduced} /> Chest pain induced</label>
			<label><CheckboxInput label="Arrhythmia induced" bind:checked={d.arrhythmiaInduced} /> Arrhythmia induced</label>
			<label><CheckboxInput label="Terminated early" bind:checked={d.terminatedEarly} /> Terminated early</label>
		</CheckboxGroup>
	</Field>

	<Field label="Overall conclusion">
		<CheckboxGroup label="Overall conclusion">
			<label><CheckboxInput label="Positive" bind:checked={d.testPositive} /> Positive (inducible ischaemia)</label>
			<label><CheckboxInput label="Negative" bind:checked={d.testNegative} /> Negative (no inducible ischaemia)</label>
			<label><CheckboxInput label="Inconclusive" bind:checked={d.testInconclusive} /> Inconclusive / non-diagnostic</label>
		</CheckboxGroup>
	</Field>

	<Field label="Reason for termination" inputId="reasonForTermination">
		<TextAreaInput
			id="reasonForTermination"
			label="Reason for termination"
			rows={3}
			placeholder="Target heart rate reached, fatigue, chest pain, ST changes, arrhythmia, exertional hypotension…"
			bind:value={d.reasonForTermination}
		/>
	</Field>

	{#if d.testPositive && d.ischaemicStChanges}
		<Alert type="error" heading="Strongly positive test selected">
			<p>
				A positive conclusion with induced ischaemic ST changes is a critical result. It
				auto-escalates the follow-up urgency to a critical alert; ensure the result is communicated
				to the referrer on sign-off.
			</p>
		</Alert>
	{/if}
</Fieldset>
