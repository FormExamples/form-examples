<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const r = assessment.data.risk;
</script>

<Fieldset legend="Step 5 of 9 — Risk (criterion 2)">
	<p class="hint">
		Criterion 2 — necessity in the interests of the person’s own health or safety, or for the
		protection of others.
	</p>

	<Field label="Risk to own health" inputId="risk-riskToOwnHealth">
		<Select id="risk-riskToOwnHealth" label="Risk to own health" bind:value={r.riskToOwnHealth}>
			<option value="">— Select —</option>
			<option value="met">Met</option>
			<option value="not-met">Not met</option>
			<option value="not-applicable">Not applicable</option>
		</Select>
	</Field>

	<Field label="Risk to own safety" inputId="risk-riskToOwnSafety">
		<Select id="risk-riskToOwnSafety" label="Risk to own safety" bind:value={r.riskToOwnSafety}>
			<option value="">— Select —</option>
			<option value="met">Met</option>
			<option value="not-met">Not met</option>
			<option value="not-applicable">Not applicable</option>
		</Select>
	</Field>

	<Field label="Risk to others" inputId="risk-riskToOthers">
		<Select id="risk-riskToOthers" label="Risk to others" bind:value={r.riskToOthers}>
			<option value="">— Select —</option>
			<option value="met">Met</option>
			<option value="not-met">Not met</option>
			<option value="not-applicable">Not applicable</option>
		</Select>
	</Field>

	<Field label="Supporting evidence" inputId="risk-riskEvidence">
		<TextAreaInput
			id="risk-riskEvidence"
			label="Supporting evidence"
			rows={3}
			placeholder="Evidence for the risk criteria."
			bind:value={r.riskEvidence}
		/>
	</Field>

	<Field
		label="Imminence of risk"
		description="Imminent risk classifies the assessment as an emergency."
		inputId="risk-riskImminence"
	>
		<Select id="risk-riskImminence" label="Imminence of risk" bind:value={r.riskImminence}>
			<option value="">— Select —</option>
			<option value="none">None</option>
			<option value="low">Low</option>
			<option value="moderate">Moderate</option>
			<option value="imminent">Imminent</option>
		</Select>
	</Field>
</Fieldset>
