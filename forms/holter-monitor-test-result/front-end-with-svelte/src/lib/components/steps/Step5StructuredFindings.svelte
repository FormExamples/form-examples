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

<Fieldset legend="5. Structured Findings">
	<p class="hint">The structured rhythm finding flags plus the narrative findings.</p>

	<Field label="Structured findings">
		<CheckboxGroup label="Structured findings">
			<label><CheckboxInput label="Atrial fibrillation detected" bind:checked={d.atrialFibrillationDetected} /> Atrial fibrillation detected</label>
			<label><CheckboxInput label="Significant pauses (> 3 s)" bind:checked={d.significantPauses} /> Significant pauses (&gt; 3 s)</label>
			<label><CheckboxInput label="Ventricular tachycardia" bind:checked={d.ventricularTachycardia} /> Ventricular tachycardia</label>
			<label><CheckboxInput label="Supraventricular tachycardia" bind:checked={d.supraventricularTachycardia} /> Supraventricular tachycardia</label>
			<label><CheckboxInput label="High-grade AV block" bind:checked={d.highGradeAvBlock} /> High-grade AV block</label>
			<label><CheckboxInput label="Symptom-rhythm correlation" bind:checked={d.symptomRhythmCorrelation} /> Symptom-rhythm correlation</label>
			<label><CheckboxInput label="Normal study" bind:checked={d.normalStudy} /> Normal study</label>
		</CheckboxGroup>
	</Field>

	<Field label="Findings narrative" inputId="findingsNarrative">
		<TextAreaInput
			id="findingsNarrative"
			label="Findings narrative"
			rows={5}
			placeholder="Narrative description of the rhythm findings (the body of the report)…"
			bind:value={d.findingsNarrative}
		/>
	</Field>

	{#if d.ventricularTachycardia || d.highGradeAvBlock || d.significantPauses}
		<Alert type="error" heading="Critical finding selected">
			<p>
				Ventricular tachycardia, high-grade AV block, or a significant pause auto-escalates the
				follow-up urgency to a critical alert. Ensure the result is communicated to the referrer on
				sign-off.
			</p>
		</Alert>
	{/if}
</Fieldset>
