<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;
</script>

<Fieldset legend="2. Examination Details">
	<p class="hint">The performed examination, laterality, adequacy, and ACR breast density.</p>

	<Field label="Exam type" inputId="examType" required>
		<Select id="examType" label="Exam type" bind:value={d.examType} required>
			<option value="">Select…</option>
			<option value="screening">Screening</option>
			<option value="diagnostic">Diagnostic</option>
			<option value="symptomatic">Symptomatic</option>
			<option value="surveillance">Surveillance</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Laterality" inputId="laterality">
		<Select id="laterality" label="Laterality" bind:value={d.laterality}>
			<option value="">Select…</option>
			<option value="left">Left</option>
			<option value="right">Right</option>
			<option value="bilateral">Bilateral</option>
		</Select>
	</Field>

	<Field label="Examination adequacy" inputId="examinationAdequacy">
		<Select id="examinationAdequacy" label="Examination adequacy" bind:value={d.examinationAdequacy}>
			<option value="">Select…</option>
			<option value="adequate">Adequate</option>
			<option value="limited">Limited</option>
			<option value="non-diagnostic">Non-diagnostic</option>
		</Select>
	</Field>

	<Field
		label="Breast density (ACR composition)"
		inputId="breastDensity"
		description="Dense breasts (c / d) lower mammographic sensitivity and may prompt supplemental imaging."
	>
		<Select id="breastDensity" label="Breast density (ACR composition)" bind:value={d.breastDensity}>
			<option value="">Select…</option>
			<option value="a">a — almost entirely fatty</option>
			<option value="b">b — scattered fibroglandular</option>
			<option value="c">c — heterogeneously dense</option>
			<option value="d">d — extremely dense</option>
		</Select>
	</Field>
</Fieldset>
