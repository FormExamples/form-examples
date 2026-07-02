<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const c = assessment.data.context;
</script>

<Fieldset legend="Step 1 of 5 — Grading context">
	<p class="hint">
		Who graded the retinal images, in what role, and with which imaging media. This records a
		human grader's decision; it does not interpret raw images.
	</p>

	<Field label="Grader name" required inputId="context-graderName">
		<TextInput
			id="context-graderName"
			label="Grader name"
			placeholder="e.g. A. Okoro"
			required
			bind:value={c.graderName}
		/>
	</Field>

	<Field label="Grader role" required inputId="context-graderRole">
		<Select id="context-graderRole" label="Grader role" bind:value={c.graderRole}>
			<option value="">— Select —</option>
			<option value="screener">Retinal screener</option>
			<option value="primary-grader">Primary grader</option>
			<option value="secondary-grader">Secondary grader</option>
			<option value="ophthalmologist">Ophthalmologist</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Date graded" inputId="context-gradedAt">
		<TextInput
			id="context-gradedAt"
			label="Date graded"
			type="date"
			class="date-input"
			bind:value={c.gradedAt}
		/>
	</Field>

	<Field label="Date images captured" inputId="context-imageCapturedAt">
		<TextInput
			id="context-imageCapturedAt"
			label="Date images captured"
			type="date"
			class="date-input"
			bind:value={c.imageCapturedAt}
		/>
	</Field>

	<Field label="Imaging media" inputId="context-imagingMedia">
		<Select id="context-imagingMedia" label="Imaging media" bind:value={c.imagingMedia}>
			<option value="">— Select —</option>
			<option value="digital-fundus">Digital fundus photography</option>
			<option value="mydriatic">Mydriatic (dilated)</option>
			<option value="non-mydriatic">Non-mydriatic</option>
			<option value="oct">Optical coherence tomography (OCT)</option>
			<option value="other">Other</option>
		</Select>
	</Field>
</Fieldset>
