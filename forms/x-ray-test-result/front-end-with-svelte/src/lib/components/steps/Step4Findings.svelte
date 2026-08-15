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
			<label><CheckboxInput label="Fracture" bind:checked={d.fracture} /> Fracture</label>
			<label><CheckboxInput label="Unstable fracture" bind:checked={d.unstableFracture} /> Unstable fracture</label>
			<label><CheckboxInput label="Dislocation" bind:checked={d.dislocation} /> Dislocation</label>
			<label><CheckboxInput label="Consolidation" bind:checked={d.consolidation} /> Consolidation</label>
			<label><CheckboxInput label="Pneumothorax" bind:checked={d.pneumothorax} /> Pneumothorax</label>
			<label><CheckboxInput label="Pleural effusion" bind:checked={d.pleuralEffusion} /> Pleural effusion</label>
			<label><CheckboxInput label="Foreign body" bind:checked={d.foreignBody} /> Foreign body</label>
			<label><CheckboxInput label="Free intraperitoneal air" bind:checked={d.freeAir} /> Free intraperitoneal air</label>
			<label><CheckboxInput label="Bony lesion" bind:checked={d.bonyLesion} /> Bony lesion</label>
			<label><CheckboxInput label="Incidental finding" bind:checked={d.incidentalFinding} /> Incidental finding</label>
		</CheckboxGroup>
	</Field>

	{#if d.pneumothorax || d.freeAir || d.unstableFracture}
		<Alert type="error" heading="Critical finding selected">
			<p>
				A pneumothorax, free intraperitoneal air, or an unstable fracture auto-escalates the
				follow-up urgency to a critical alert. Ensure the result is communicated to the referrer on
				sign-off.
			</p>
		</Alert>
	{/if}
</Fieldset>
