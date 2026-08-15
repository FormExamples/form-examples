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

<Fieldset legend="5. Interpretation Summary">
	<p class="hint">
		The overall result status with abnormal- and critical-value flags, and the findings narrative.
	</p>

	<Field label="Overall result status" inputId="overallResultStatus">
		<Select id="overallResultStatus" label="Overall result status" bind:value={d.overallResultStatus}>
			<option value="">Select…</option>
			<option value="normal">Normal</option>
			<option value="abnormal">Abnormal</option>
			<option value="critical">Critical</option>
		</Select>
	</Field>

	<Field label="Result flags">
		<CheckboxGroup label="Result flags">
			<label>
				<CheckboxInput label="Abnormal results present" bind:checked={d.abnormalResultsPresent} /> Abnormal
				results present
			</label>
			<label>
				<CheckboxInput label="Critical (panic) value present" bind:checked={d.criticalValuePresent} /> Critical
				(panic) value present
			</label>
		</CheckboxGroup>
	</Field>

	{#if d.criticalValuePresent || d.overallResultStatus === 'critical'}
		<Alert type="error" heading="Critical (panic) value selected">
			<p>
				A critical (panic) value auto-escalates the result classification to critical and the
				follow-up urgency to a critical alert. Record the detail below and ensure the result is
				communicated to the requester on sign-off.
			</p>
		</Alert>
	{/if}

	<Field label="Critical-value detail" inputId="criticalValueDetail">
		<TextAreaInput
			id="criticalValueDetail"
			label="Critical-value detail"
			rows={2}
			placeholder="Which critical (panic) value(s) were breached, e.g. potassium 7.1 mmol/L…"
			bind:value={d.criticalValueDetail}
		/>
	</Field>

	<Field label="Findings narrative" inputId="findingsNarrative">
		<TextAreaInput
			id="findingsNarrative"
			label="Findings narrative"
			rows={4}
			placeholder="Narrative description of the result findings (the body of the report)…"
			bind:value={d.findingsNarrative}
		/>
	</Field>
</Fieldset>
