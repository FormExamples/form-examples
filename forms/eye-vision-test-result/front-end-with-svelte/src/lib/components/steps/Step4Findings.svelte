<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;

	const critical = $derived(
		d.retinopathyGrade === 'proliferative' || (d.reducedVisualAcuity && d.opticDiscAbnormality)
	);
</script>

<Fieldset legend="4. Findings">
	<p class="hint">The narrative findings, the structured finding flags, and the retinopathy grade.</p>

	<Field label="Findings narrative" inputId="findingsNarrative">
		<TextAreaInput
			id="findingsNarrative"
			label="Findings narrative"
			rows={5}
			placeholder="Narrative description of the examination findings (the body of the report)…"
			bind:value={d.findingsNarrative}
		/>
	</Field>

	<Field label="Structured findings">
		<CheckboxGroup label="Structured findings">
			<label><CheckboxInput label="Reduced visual acuity" bind:checked={d.reducedVisualAcuity} /> Reduced visual acuity</label>
			<label><CheckboxInput label="Visual-field defect" bind:checked={d.visualFieldDefect} /> Visual-field defect</label>
			<label><CheckboxInput label="Raised intraocular pressure" bind:checked={d.raisedIntraocularPressure} /> Raised intraocular pressure</label>
			<label><CheckboxInput label="Diabetic retinopathy" bind:checked={d.diabeticRetinopathy} /> Diabetic retinopathy</label>
			<label><CheckboxInput label="Optic-disc abnormality" bind:checked={d.opticDiscAbnormality} /> Optic-disc abnormality</label>
			<label><CheckboxInput label="Macular abnormality" bind:checked={d.macularAbnormality} /> Macular abnormality</label>
			<label><CheckboxInput label="Normal examination" bind:checked={d.normalExamination} /> Normal examination</label>
		</CheckboxGroup>
	</Field>

	<Field
		label="Diabetic-retinopathy grade"
		inputId="retinopathyGrade"
		description="NHS Diabetic Eye Screening Programme grade."
	>
		<Select id="retinopathyGrade" label="Diabetic-retinopathy grade" bind:value={d.retinopathyGrade}>
			<option value="">Select…</option>
			<option value="none">None (R0)</option>
			<option value="background">Background (R1)</option>
			<option value="pre-proliferative">Pre-proliferative (R2)</option>
			<option value="proliferative">Proliferative (R3)</option>
			<option value="maculopathy">Maculopathy (M1)</option>
			<option value="not-applicable">Not applicable</option>
		</Select>
	</Field>

	{#if critical}
		<Alert type="error" heading="Critical finding selected">
			<p>
				Proliferative diabetic retinopathy, or reduced acuity together with an optic-disc
				abnormality, auto-escalates the follow-up urgency to a critical alert. Ensure the result is
				communicated to the referrer on sign-off.
			</p>
		</Alert>
	{/if}
</Fieldset>
