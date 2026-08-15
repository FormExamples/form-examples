<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = resultStore.data;
</script>

<Fieldset legend="4. Interpretation">
	<p class="hint">The paracetamol nomogram, overall status, toxic-level flag, and findings narrative.</p>

	<Field
		label="Paracetamol nomogram"
		inputId="paracetamolNomogram"
		description="Interpretable only at ≥ 4 h post-ingestion (single 100 mg/L treatment line)."
	>
		<Select id="paracetamolNomogram" label="Paracetamol nomogram" bind:value={d.paracetamolNomogram}>
			<option value="">Select…</option>
			<option value="above-treatment-line">Above treatment line</option>
			<option value="below-treatment-line">Below treatment line</option>
			<option value="not-applicable">Not applicable</option>
		</Select>
	</Field>

	<Field label="Overall result status" inputId="overallResultStatus">
		<Select id="overallResultStatus" label="Overall result status" bind:value={d.overallResultStatus}>
			<option value="">Select…</option>
			<option value="normal">Normal</option>
			<option value="abnormal">Abnormal</option>
			<option value="critical">Critical</option>
		</Select>
	</Field>

	<Field label="Toxic level present">
		<CheckboxGroup label="Toxic level present">
			<label>
				<CheckboxInput
					label="A reported level is in a toxic range requiring action"
					bind:checked={d.toxicLevelPresent}
				/> A reported level is in a toxic range requiring action
			</label>
		</CheckboxGroup>
	</Field>

	<Field label="Findings narrative" inputId="findingsNarrative">
		<TextAreaInput
			id="findingsNarrative"
			label="Findings narrative"
			rows={5}
			placeholder="Narrative description of the result values and their significance (the body of the report)…"
			bind:value={d.findingsNarrative}
		/>
	</Field>

	{#if d.toxicLevelPresent || d.paracetamolNomogram === 'above-treatment-line'}
		<Alert type="error" heading="Toxic level selected">
			<p>
				A toxic level (paracetamol above the treatment line, or a toxic-level flag) auto-escalates
				the follow-up urgency to a critical alert with an urgent antidote action (start
				N-acetylcysteine / NAC for paracetamol). Ensure the result is communicated to the requester
				on sign-off.
			</p>
		</Alert>
	{/if}
</Fieldset>
