<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = resultStore.data;
</script>

<Fieldset legend="4. Findings">
	<p class="hint">The narrative findings plus structured finding flags and the lesion location.</p>

	<Field label="Findings narrative" inputId="findingsNarrative">
		<TextAreaInput
			id="findingsNarrative"
			label="Findings narrative"
			rows={5}
			placeholder="Narrative description of the procedure findings (the body of the report)…"
			bind:value={d.findingsNarrative}
		/>
	</Field>

	<Field label="Structured findings">
		<CheckboxGroup label="Structured findings">
			<label><CheckboxInput label="Endobronchial lesion" bind:checked={d.endobronchialLesion} /> Endobronchial lesion</label>
			<label><CheckboxInput label="Mucosal abnormality" bind:checked={d.mucosalAbnormality} /> Mucosal abnormality</label>
			<label><CheckboxInput label="Extrinsic compression" bind:checked={d.extrinsicCompression} /> Extrinsic compression</label>
			<label><CheckboxInput label="Bleeding" bind:checked={d.bleeding} /> Bleeding</label>
			<label><CheckboxInput label="Foreign body" bind:checked={d.foreignBody} /> Foreign body</label>
			<label><CheckboxInput label="Purulent secretions" bind:checked={d.secretionsPurulent} /> Purulent secretions</label>
			<label><CheckboxInput label="Normal examination" bind:checked={d.normalExamination} /> Normal examination</label>
		</CheckboxGroup>
	</Field>

	<Field
		label="Lesion location"
		inputId="lesionLocation"
		description="Anatomical site of the abnormality, e.g. right upper lobe bronchus."
	>
		<TextInput
			id="lesionLocation"
			label="Lesion location"
			placeholder="e.g. right upper lobe bronchus"
			bind:value={d.lesionLocation}
		/>
	</Field>

	{#if d.endobronchialLesion || d.bleeding}
		<Alert type="error" heading="Critical finding selected">
			<p>
				A suspected endobronchial tumour or massive haemoptysis auto-escalates the follow-up urgency
				to a critical alert. Ensure the result is communicated to the referrer on sign-off.
			</p>
		</Alert>
	{/if}
</Fieldset>
