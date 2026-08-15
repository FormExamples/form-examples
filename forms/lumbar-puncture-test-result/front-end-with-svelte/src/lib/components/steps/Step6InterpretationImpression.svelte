<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = resultStore.data;
</script>

<Fieldset legend="6. Interpretation & Impression">
	<p class="hint">Structured interpretive findings, the narrative, and the impression.</p>

	<Field label="Structured interpretive findings">
		<CheckboxGroup label="Structured interpretive findings">
			<label><CheckboxInput label="Raised protein" bind:checked={d.raisedProtein} /> Raised protein</label>
			<label><CheckboxInput label="Pleocytosis" bind:checked={d.pleocytosis} /> Pleocytosis</label>
			<label><CheckboxInput label="Low glucose" bind:checked={d.lowGlucose} /> Low glucose</label>
			<label><CheckboxInput label="Bacterial meningitis pattern" bind:checked={d.bacterialMeningitisPattern} /> Bacterial meningitis pattern</label>
			<label><CheckboxInput label="Viral / aseptic pattern" bind:checked={d.viralPattern} /> Viral / aseptic pattern</label>
			<label><CheckboxInput label="Subarachnoid haemorrhage suggested" bind:checked={d.subarachnoidHaemorrhageSuggested} /> Subarachnoid haemorrhage suggested</label>
			<label><CheckboxInput label="Normal CSF" bind:checked={d.normalCsf} /> Normal CSF</label>
		</CheckboxGroup>
	</Field>

	{#if d.bacterialMeningitisPattern || d.subarachnoidHaemorrhageSuggested}
		<Alert type="error" heading="Critical CSF pattern selected">
			<p>
				A bacterial meningitis pattern or suggested subarachnoid haemorrhage auto-escalates the
				follow-up urgency to a critical alert. Ensure the result is communicated to the requesting
				clinician on sign-off.
			</p>
		</Alert>
	{/if}

	<Field label="Findings narrative" inputId="findingsNarrative">
		<TextAreaInput
			id="findingsNarrative"
			label="Findings narrative"
			rows={5}
			placeholder="Narrative description of the CSF findings (the body of the report)…"
			bind:value={d.findingsNarrative}
		/>
	</Field>

	<Field
		label="Reporting category"
		inputId="reportingCategory"
		description="Structured pattern label, e.g. bacterial-pattern, viral-pattern, SAH-pattern, inflammatory-demyelinating, normal."
	>
		<TextInput
			id="reportingCategory"
			label="Reporting category"
			placeholder="e.g. bacterial-pattern"
			bind:value={d.reportingCategory}
		/>
	</Field>

	<Field label="Impression" inputId="impression" required>
		<TextAreaInput
			id="impression"
			label="Impression"
			rows={4}
			placeholder="Summary impression / conclusion answering the clinical question…"
			bind:value={d.impression}
		/>
	</Field>

	<Field label="Recommended follow-up" inputId="recommendedFollowUp">
		<TextAreaInput
			id="recommendedFollowUp"
			label="Recommended follow-up"
			rows={3}
			placeholder="Recommended follow-up investigation, referral, or management…"
			bind:value={d.recommendedFollowUp}
		/>
	</Field>
</Fieldset>
