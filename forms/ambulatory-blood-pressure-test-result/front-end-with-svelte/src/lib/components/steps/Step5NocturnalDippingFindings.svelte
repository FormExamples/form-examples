<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;
</script>

<Fieldset legend="5. Nocturnal Dipping & Findings">
	<p class="hint">The nocturnal dipping pattern plus the narrative findings and structured interpretation.</p>

	<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
		<Field
			label="Nocturnal dip (%)"
			inputId="nocturnalDipPercent"
			description="Percentage fall in average systolic BP from daytime to nighttime."
		>
			<NumberInput
				id="nocturnalDipPercent"
				label="Nocturnal dip (%)"
				min={-100}
				max={100}
				step={0.1}
				bind:value={d.nocturnalDipPercent}
			/>
		</Field>

		<Field label="Dipper status" inputId="dipperStatus">
			<Select id="dipperStatus" label="Dipper status" bind:value={d.dipperStatus}>
				<option value="">Select…</option>
				<option value="dipper">Dipper (10–20% fall)</option>
				<option value="non-dipper">Non-dipper (0–10% fall)</option>
				<option value="reverse-dipper">Reverse-dipper (nighttime rise)</option>
				<option value="extreme-dipper">Extreme-dipper (>20% fall)</option>
			</Select>
		</Field>
	</div>

	<Field label="Findings narrative" inputId="findingsNarrative">
		<TextAreaInput
			id="findingsNarrative"
			label="Findings narrative"
			rows={4}
			placeholder="Narrative description of the monitoring findings (the body of the report)…"
			bind:value={d.findingsNarrative}
		/>
	</Field>

	<Field label="Structured interpretation">
		<CheckboxGroup label="Structured interpretation">
			<label><CheckboxInput label="Hypertension confirmed" bind:checked={d.hypertensionConfirmed} /> Hypertension confirmed</label>
			<label><CheckboxInput label="White-coat effect" bind:checked={d.whiteCoatEffect} /> White-coat effect</label>
			<label><CheckboxInput label="Masked hypertension" bind:checked={d.maskedHypertension} /> Masked hypertension</label>
			<label><CheckboxInput label="Severe hypertension" bind:checked={d.severeHypertension} /> Severe hypertension</label>
			<label><CheckboxInput label="Nocturnal hypertension" bind:checked={d.nocturnalHypertension} /> Nocturnal hypertension</label>
			<label><CheckboxInput label="Normal study" bind:checked={d.normalStudy} /> Normal study</label>
		</CheckboxGroup>
	</Field>

	{#if d.severeHypertension}
		<Alert type="error" heading="Severe hypertension selected">
			<p>
				Severe hypertension auto-escalates the follow-up urgency to a critical alert. Ensure the
				result is communicated to the referrer on sign-off.
			</p>
		</Alert>
	{/if}
</Fieldset>
