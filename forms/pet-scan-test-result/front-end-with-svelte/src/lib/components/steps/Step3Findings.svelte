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

<Fieldset legend="3. Findings">
	<p class="hint">The narrative metabolic findings plus structured finding flags.</p>

	<Field label="Findings narrative" inputId="findingsNarrative">
		<TextAreaInput
			id="findingsNarrative"
			label="Findings narrative"
			rows={5}
			placeholder="Narrative description of the metabolic and CT findings (the body of the report)…"
			bind:value={d.findingsNarrative}
		/>
	</Field>

	<Field label="Structured findings">
		<CheckboxGroup label="Structured findings">
			<label><CheckboxInput label="Hypermetabolic lesion" bind:checked={d.hypermetabolicLesion} /> Hypermetabolic lesion</label>
			<label><CheckboxInput label="Nodal uptake" bind:checked={d.nodalUptake} /> Nodal uptake</label>
			<label><CheckboxInput label="Distant metastasis" bind:checked={d.distantMetastasis} /> Distant metastasis</label>
			<label><CheckboxInput label="No abnormal uptake" bind:checked={d.noAbnormalUptake} /> No abnormal uptake</label>
			<label><CheckboxInput label="Physiological uptake only" bind:checked={d.physiologicalUptakeOnly} /> Physiological uptake only</label>
			<label><CheckboxInput label="Incidental finding" bind:checked={d.incidentalFinding} /> Incidental finding</label>
		</CheckboxGroup>
	</Field>

	{#if d.distantMetastasis}
		<Alert type="error" heading="Critical finding selected">
			<p>
				Distant metastasis auto-escalates the follow-up urgency to a critical alert. Ensure the
				result is communicated to the referrer on sign-off.
			</p>
		</Alert>
	{/if}
</Fieldset>
