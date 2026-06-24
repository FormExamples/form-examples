<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;
</script>

<Fieldset legend="4. Findings">
	<p class="hint">The narrative findings plus structured finding flags.</p>

	<Field label="Findings narrative" inputId="findingsNarrative">
		<TextAreaInput
			id="findingsNarrative"
			label="Findings narrative"
			rows={5}
			placeholder="Narrative description of the imaging findings (the body of the report)…"
			bind:value={d.findingsNarrative}
		/>
	</Field>

	<Field label="Structured findings">
		<CheckboxGroup label="Structured findings">
			<label><CheckboxInput label="Mass or lesion" bind:checked={d.massOrLesion} /> Mass or lesion</label>
			<label><CheckboxInput label="Haemorrhage" bind:checked={d.haemorrhage} /> Haemorrhage</label>
			<label><CheckboxInput label="Infarct" bind:checked={d.infarct} /> Infarct</label>
			<label><CheckboxInput label="Demyelination" bind:checked={d.demyelination} /> Demyelination</label>
			<label><CheckboxInput label="Disc herniation" bind:checked={d.discHerniation} /> Disc herniation</label>
			<label><CheckboxInput label="Cord / cauda-equina compression" bind:checked={d.cordCompression} /> Cord / cauda-equina compression</label>
			<label><CheckboxInput label="Infection / inflammation" bind:checked={d.infectionInflammation} /> Infection / inflammation</label>
			<label><CheckboxInput label="Incidental finding" bind:checked={d.incidentalFinding} /> Incidental finding</label>
		</CheckboxGroup>
	</Field>

	{#if d.cordCompression || d.haemorrhage || d.infarct}
		<Alert type="error" heading="Critical finding selected">
			<p>
				Cord / cauda-equina compression, haemorrhage, or infarct auto-escalates the follow-up
				urgency to a critical alert. Ensure the result is communicated to the referrer on sign-off.
			</p>
		</Alert>
	{/if}
</Fieldset>
