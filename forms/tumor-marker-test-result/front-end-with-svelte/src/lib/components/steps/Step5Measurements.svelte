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

<Fieldset legend="5. Findings">
	<p class="hint">The narrative findings, markedly-elevated flag, and overall result status.</p>

	<Field label="Findings narrative" inputId="findingsNarrative">
		<TextAreaInput
			id="findingsNarrative"
			label="Findings narrative"
			rows={5}
			placeholder="Narrative description of the measured values and their interpretation (the body of the report)…"
			bind:value={d.findingsNarrative}
		/>
	</Field>

	<Field label="Markedly elevated">
		<CheckboxGroup label="Markedly elevated">
			<label>
				<CheckboxInput
					label="One or more markers are markedly elevated"
					bind:checked={d.markedlyElevated}
				/> One or more markers are markedly elevated
			</label>
		</CheckboxGroup>
	</Field>

	<Field label="Overall result status" inputId="overallResultStatus">
		<Select id="overallResultStatus" label="Overall result status" bind:value={d.overallResultStatus}>
			<option value="">Select…</option>
			<option value="normal">Normal</option>
			<option value="abnormal">Abnormal</option>
			<option value="critical">Critical</option>
		</Select>
	</Field>

	{#if d.markedlyElevated || d.trend === 'rising'}
		<Alert type="warning" heading="Action signal present">
			<p>
				A markedly elevated value or a rising trend on treatment classifies the result as abnormal
				and escalates the follow-up to an urgent oncology review.
			</p>
		</Alert>
	{/if}
</Fieldset>
