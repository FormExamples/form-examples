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
			<label><CheckboxInput label="Stricture" bind:checked={d.stricture} /> Stricture</label>
			<label><CheckboxInput label="Reflux" bind:checked={d.reflux} /> Reflux</label>
			<label><CheckboxInput label="Obstruction" bind:checked={d.obstruction} /> Obstruction</label>
			<label><CheckboxInput label="Perforation or leak" bind:checked={d.perforationOrLeak} /> Perforation or leak</label>
			<label><CheckboxInput label="Fistula" bind:checked={d.fistula} /> Fistula</label>
			<label><CheckboxInput label="Filling defect" bind:checked={d.fillingDefect} /> Filling defect</label>
			<label><CheckboxInput label="Dysmotility" bind:checked={d.dysmotility} /> Dysmotility</label>
			<label><CheckboxInput label="Normal study" bind:checked={d.normalStudy} /> Normal study</label>
			<label><CheckboxInput label="Incidental finding" bind:checked={d.incidentalFinding} /> Incidental finding</label>
		</CheckboxGroup>
	</Field>

	{#if d.perforationOrLeak || d.obstruction}
		<Alert type="error" heading="Critical finding selected">
			<p>
				A perforation / contrast leak or high-grade obstruction auto-escalates the follow-up
				urgency to a critical alert. Ensure the result is communicated to the referrer on sign-off.
			</p>
		</Alert>
	{/if}
</Fieldset>
