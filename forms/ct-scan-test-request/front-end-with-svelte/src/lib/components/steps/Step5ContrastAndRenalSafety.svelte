<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { request } from '$lib/stores/request.svelte';
	import { usesIvContrast } from '$lib/engine/utils';

	const d = request.data.contrast;
	const iv = $derived(usesIvContrast(d.contrastRequired));
</script>

<Fieldset legend="5. Contrast and Renal Safety">
	<p class="hint">Contrast requirement and renal-safety factors — these drive the contrast-safety band.</p>

	<Field label="Contrast required" inputId="contrastRequired">
		<Select id="contrastRequired" label="Contrast required" bind:value={d.contrastRequired}>
			<option value="">Select…</option>
			<option value="none">None</option>
			<option value="iv-iodinated">IV iodinated</option>
			<option value="oral">Oral</option>
			<option value="both">IV + oral</option>
			<option value="unknown">Unknown</option>
		</Select>
	</Field>

	{#if iv}
		<Alert type="info" heading="IV iodinated contrast requested">
			<p>Record renal function and any allergy history; these set the contrast-safety band.</p>
		</Alert>
	{/if}

	<Field label="eGFR (mL/min/1.73m²)" inputId="egfr" description="ESUR: caution below 45, high CIN risk below 30.">
		<NumberInput id="egfr" label="eGFR" min={0} max={200} step={0.1} bind:value={d.egfr} />
	</Field>

	<Field label="Previous contrast reaction" inputId="previousContrastReaction">
		<Select id="previousContrastReaction" label="Previous contrast reaction" bind:value={d.previousContrastReaction}>
			<option value="">Select…</option>
			<option value="none">None</option>
			<option value="mild">Mild</option>
			<option value="moderate">Moderate</option>
			<option value="severe">Severe</option>
			<option value="unknown">Unknown</option>
		</Select>
	</Field>

	<Field label="Safety factors">
		<CheckboxGroup label="Safety factors">
			<label><CheckboxInput label="Known iodinated-contrast allergy" bind:checked={d.iodineContrastAllergy} /> Known iodinated-contrast allergy</label>
			<label><CheckboxInput label="Taking metformin" bind:checked={d.metformin} /> Taking metformin</label>
			<label><CheckboxInput label="Diabetes" bind:checked={d.diabetes} /> Diabetes</label>
			<label><CheckboxInput label="Known renal impairment" bind:checked={d.renalImpairment} /> Known renal impairment</label>
		</CheckboxGroup>
	</Field>
</Fieldset>
