<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const e = assessment.data.examination;
</script>

<Fieldset legend="Step 5 of 11 — Examination and observations">
	<p class="hint">
		Examination summary and the latest NEWS2. Required component: an examination summary and a
		NEWS2 total.
	</p>

	<Field label="Examination summary" inputId="examination-examinationSummary">
		<TextAreaInput
			id="examination-examinationSummary"
			label="Examination summary"
			rows={3}
			placeholder="Relevant examination findings today."
			bind:value={e.examinationSummary}
		/>
	</Field>

	<Field
		label="Latest NEWS2 total"
		description="A total of 5 or more, or any single parameter scoring 3, prompts escalation."
		inputId="examination-news2Total"
	>
		<NumberInput
			id="examination-news2Total"
			label="Latest NEWS2 total"
			min={0}
			max={25}
			step={1}
			placeholder="e.g. 3"
			bind:value={e.news2Total}
		/>
	</Field>

	<Field
		label="Any single NEWS2 parameter scoring 3?"
		description="Yes contributes to the deteriorating-NEWS2 escalation flag."
		inputId="examination-news2SingleParamThree"
	>
		<Select
			id="examination-news2SingleParamThree"
			label="Any single NEWS2 parameter scoring 3?"
			bind:value={e.news2SingleParamThree}
		>
			<option value="">— Select —</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
		</Select>
	</Field>

	<Field
		label="Observation trend"
		description="A deteriorating trend prompts escalation and a senior review."
		inputId="examination-observationTrend"
	>
		<Select id="examination-observationTrend" label="Observation trend" bind:value={e.observationTrend}>
			<option value="">— Select —</option>
			<option value="improving">Improving</option>
			<option value="stable">Stable</option>
			<option value="deteriorating">Deteriorating</option>
		</Select>
	</Field>
</Fieldset>
