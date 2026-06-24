<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;
</script>

<Fieldset legend="2. Clinical History & Acquisition">
	<p class="hint">The clinical question, acquisition data, and examination adequacy.</p>

	<Field label="Clinical history" inputId="clinicalHistory">
		<TextAreaInput
			id="clinicalHistory"
			label="Clinical history"
			rows={3}
			placeholder="Clinical history and the question the examination was performed to answer…"
			bind:value={d.clinicalHistory}
		/>
	</Field>

	<Field
		label="Pre-injection blood glucose (mmol/L)"
		inputId="bloodGlucoseMmolL"
		description="FDG uptake quality depends on glucose control, typically below 11 mmol/L."
	>
		<NumberInput
			id="bloodGlucoseMmolL"
			label="Pre-injection blood glucose (mmol/L)"
			min={0}
			max={60}
			step={0.1}
			bind:value={d.bloodGlucoseMmolL}
		/>
	</Field>

	<Field
		label="Injected activity (MBq)"
		inputId="injectedActivityMbq"
		description="Administered radiopharmaceutical activity for IR(ME)R dose audit."
	>
		<NumberInput
			id="injectedActivityMbq"
			label="Injected activity (MBq)"
			min={0}
			max={100000}
			step={0.1}
			bind:value={d.injectedActivityMbq}
		/>
	</Field>

	<Field label="Examination adequacy" inputId="examinationAdequacy">
		<Select id="examinationAdequacy" label="Examination adequacy" bind:value={d.examinationAdequacy}>
			<option value="">Select…</option>
			<option value="adequate">Adequate</option>
			<option value="limited">Limited</option>
			<option value="non-diagnostic">Non-diagnostic</option>
		</Select>
	</Field>

	{#if d.bloodGlucoseMmolL !== null && d.bloodGlucoseMmolL >= 11}
		<Alert type="warning" heading="Elevated blood glucose">
			<p>
				Pre-injection blood glucose is 11 mmol/L or higher; FDG uptake quality may be reduced.
				Document the level and consider its effect on interpretation.
			</p>
		</Alert>
	{/if}
</Fieldset>
