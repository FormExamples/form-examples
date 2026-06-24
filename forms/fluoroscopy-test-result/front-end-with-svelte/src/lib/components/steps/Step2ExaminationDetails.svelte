<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;
</script>

<Fieldset legend="2. Examination Details">
	<p class="hint">The performed study, contrast used, adequacy, and screening time.</p>

	<Field label="Study type" inputId="studyType" required>
		<Select id="studyType" label="Study type" bind:value={d.studyType} required>
			<option value="">Select…</option>
			<option value="barium-swallow">Barium swallow</option>
			<option value="barium-meal">Barium meal</option>
			<option value="barium-follow-through">Barium follow-through</option>
			<option value="barium-enema">Barium enema</option>
			<option value="water-soluble-contrast-swallow">Water-soluble contrast swallow</option>
			<option value="defecating-proctogram">Defecating proctogram</option>
			<option value="hysterosalpingogram">Hysterosalpingogram</option>
			<option value="micturating-cystourethrogram">Micturating cystourethrogram</option>
			<option value="arthrogram">Arthrogram</option>
			<option value="fluoroscopy-guided-procedure">Fluoroscopy-guided procedure</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Contrast used" inputId="contrastUsed">
		<Select id="contrastUsed" label="Contrast used" bind:value={d.contrastUsed}>
			<option value="">Select…</option>
			<option value="barium">Barium</option>
			<option value="water-soluble-iodinated">Water-soluble iodinated</option>
			<option value="none">None</option>
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
		label="Screening time (minutes)"
		inputId="screeningTimeMinutes"
		description="Total fluoroscopy screening time, for IR(ME)R dose audit."
	>
		<NumberInput
			id="screeningTimeMinutes"
			label="Screening time (minutes)"
			min={0}
			max={600}
			step={0.1}
			bind:value={d.screeningTimeMinutes}
		/>
	</Field>
</Fieldset>
