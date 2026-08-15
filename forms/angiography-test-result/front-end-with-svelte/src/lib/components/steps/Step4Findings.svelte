<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = $state(resultStore.data);
</script>

<Fieldset legend="4. Findings">
	<p class="hint">The narrative findings plus structured vascular finding flags.</p>

	<Field label="Findings narrative" inputId="findingsNarrative">
		<TextAreaInput
			id="findingsNarrative"
			label="Findings narrative"
			rows={5}
			placeholder="Narrative description of the angiographic findings (the body of the report)…"
			bind:value={d.findingsNarrative}
		/>
	</Field>

	<Field label="Structured findings">
		<CheckboxGroup label="Structured findings">
			<label><CheckboxInput label="Significant stenosis" bind:checked={d.significantStenosis} /> Significant stenosis</label>
			<label><CheckboxInput label="Occlusion" bind:checked={d.occlusion} /> Occlusion</label>
			<label><CheckboxInput label="Aneurysm" bind:checked={d.aneurysm} /> Aneurysm</label>
			<label><CheckboxInput label="Dissection" bind:checked={d.dissection} /> Dissection</label>
			<label><CheckboxInput label="Active extravasation" bind:checked={d.activeExtravasation} /> Active extravasation</label>
			<label><CheckboxInput label="Thrombus" bind:checked={d.thrombus} /> Thrombus</label>
			<label><CheckboxInput label="Normal vessels" bind:checked={d.normalVessels} /> Normal vessels</label>
			<label><CheckboxInput label="Incidental finding" bind:checked={d.incidentalFinding} /> Incidental finding</label>
		</CheckboxGroup>
	</Field>

	{#if d.activeExtravasation || d.dissection || d.occlusion}
		<Alert type="error" heading="Critical finding selected">
			<p>
				Active extravasation, dissection, or occlusion auto-escalates the follow-up urgency to a
				critical alert. Ensure the result is communicated to the referrer on sign-off.
			</p>
		</Alert>
	{/if}
</Fieldset>
