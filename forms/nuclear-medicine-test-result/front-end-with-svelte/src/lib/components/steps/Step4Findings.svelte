<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;

	// A high-probability PE (perfusion defect on a V/Q lung scan) or a widespread
	// metastatic pattern is a critical finding.
	const criticalSelected = $derived(
		(d.scanType === 'vq-lung-scan' && d.perfusionDefect) || d.metastaticPattern
	);
</script>

<Fieldset legend="4. Findings">
	<p class="hint">The narrative findings plus structured finding flags.</p>

	<Field label="Findings narrative" inputId="findingsNarrative">
		<TextAreaInput
			id="findingsNarrative"
			label="Findings narrative"
			rows={5}
			placeholder="Narrative description of the scintigraphic findings (the body of the report)…"
			bind:value={d.findingsNarrative}
		/>
	</Field>

	<Field label="Structured findings">
		<CheckboxGroup label="Structured findings">
			<label><CheckboxInput label="Abnormal uptake" bind:checked={d.abnormalUptake} /> Abnormal uptake</label>
			<label><CheckboxInput label="Metastatic pattern" bind:checked={d.metastaticPattern} /> Metastatic pattern</label>
			<label><CheckboxInput label="Perfusion defect" bind:checked={d.perfusionDefect} /> Perfusion defect</label>
			<label><CheckboxInput label="Photopenic area" bind:checked={d.photopenicArea} /> Photopenic area</label>
			<label><CheckboxInput label="No significant abnormality" bind:checked={d.noSignificantAbnormality} /> No significant abnormality</label>
			<label><CheckboxInput label="Incidental finding" bind:checked={d.incidentalFinding} /> Incidental finding</label>
		</CheckboxGroup>
	</Field>

	{#if criticalSelected}
		<Alert type="error" heading="Critical finding selected">
			<p>
				A high-probability PE on a V/Q lung scan, or a widespread metastatic pattern, auto-escalates
				the follow-up urgency to a critical alert. Ensure the result is communicated to the referrer
				on sign-off.
			</p>
		</Alert>
	{/if}
</Fieldset>
