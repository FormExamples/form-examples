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

<Fieldset legend="4. Findings">
	<p class="hint">The narrative findings, the overall result status, and any critical value.</p>

	<Field label="Findings narrative" inputId="findingsNarrative">
		<TextAreaInput
			id="findingsNarrative"
			label="Findings narrative"
			rows={5}
			placeholder="Narrative description of the coagulation findings (the body of the report)…"
			bind:value={d.findingsNarrative}
		/>
	</Field>

	<Field label="Overall result status" inputId="overallResultStatus">
		<Select id="overallResultStatus" label="Overall result status" bind:value={d.overallResultStatus}>
			<option value="">Select…</option>
			<option value="normal">Normal</option>
			<option value="abnormal">Abnormal</option>
			<option value="critical">Critical</option>
		</Select>
	</Field>

	<Field label="Critical value">
		<CheckboxGroup label="Critical value">
			<label>
				<CheckboxInput
					label="Critical (panic) value present"
					bind:checked={d.criticalValuePresent}
				/> Critical (panic) value present
			</label>
		</CheckboxGroup>
	</Field>

	{#if d.criticalValuePresent}
		<Field label="Critical value detail" inputId="criticalValueDetail">
			<TextAreaInput
				id="criticalValueDetail"
				label="Critical value detail"
				rows={2}
				placeholder="Which threshold was breached and the value (e.g. INR 9.5 > 8 critical threshold)…"
				bind:value={d.criticalValueDetail}
			/>
		</Field>
	{/if}

	{#if d.criticalValuePresent || d.overallResultStatus === 'critical' || (d.inr !== null && d.inr > 8) || (d.fibrinogenGL !== null && d.fibrinogenGL < 1.0)}
		<Alert type="error" heading="Critical value selected">
			<p>
				A critical value (e.g. INR &gt; 8 or fibrinogen &lt; 1.0 g/L) auto-escalates the follow-up
				urgency to a critical alert. Ensure the result is communicated to the referrer on sign-off.
			</p>
		</Alert>
	{/if}
</Fieldset>
