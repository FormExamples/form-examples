<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import { requestStore } from '#lib/stores/result.svelte.js';

	const d = requestStore.data;
</script>

<Fieldset legend="7. Impact and Urgency">
	<p class="hint">
		The current impact of the unadjusted difficulties, absence / burnout risk, and the requested
		handling urgency.
	</p>

	<Field
		label="Current impact"
		inputId="currentImpact"
		description="The impact of the unadjusted difficulties on the worker's work and wellbeing."
	>
		<Select id="currentImpact" label="Current impact" bind:value={d.currentImpact}>
			<option value="">Select…</option>
			<option value="low">Low</option>
			<option value="moderate">Moderate</option>
			<option value="high">High</option>
			<option value="severe">Severe</option>
		</Select>
	</Field>

	<Field label="Absence / burnout risk">
		<CheckboxGroup label="Absence / burnout risk">
			<label>
				<CheckboxInput label="At risk of absence or burnout" bind:checked={d.atRiskOfAbsence} />
				The worker is at risk of sickness absence or burnout without adjustments
			</label>
		</CheckboxGroup>
	</Field>

	{#if d.atRiskOfAbsence || d.currentImpact === 'severe'}
		<Alert type="warning" heading="Wellbeing risk">
			<p>
				This drives the impact axis to high-risk and auto-escalates handling priority. Respond
				promptly and without unreasonable delay.
			</p>
		</Alert>
	{/if}

	<Field
		label="Requested urgency"
		inputId="urgency"
		description="The engine may escalate this on wellbeing grounds, but will not lower it."
	>
		<Select id="urgency" label="Requested urgency" bind:value={d.urgency}>
			<option value="routine">Routine</option>
			<option value="soon">Soon</option>
			<option value="urgent">Urgent</option>
		</Select>
	</Field>
</Fieldset>
