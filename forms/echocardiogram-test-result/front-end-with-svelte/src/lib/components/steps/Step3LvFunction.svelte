<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import { resultStore } from '$lib/stores/result.svelte';

	const d = resultStore.data;
</script>

<Fieldset legend="3. LV Function & Dimensions">
	<p class="hint">Left-ventricular ejection fraction, qualitative function, and dimensions.</p>

	<Field
		label="Ejection fraction — LVEF (%)"
		inputId="lvEjectionFractionPercent"
		description="Left-ventricular ejection fraction as a percentage (0–100)."
	>
		<NumberInput
			id="lvEjectionFractionPercent"
			label="Ejection fraction — LVEF (%)"
			min={0}
			max={100}
			step={0.1}
			bind:value={d.lvEjectionFractionPercent}
		/>
	</Field>

	<Field label="Qualitative LV function" inputId="lvFunction">
		<Select id="lvFunction" label="Qualitative LV function" bind:value={d.lvFunction}>
			<option value="">Select…</option>
			<option value="normal">Normal</option>
			<option value="mildly-impaired">Mildly impaired</option>
			<option value="moderately-impaired">Moderately impaired</option>
			<option value="severely-impaired">Severely impaired</option>
		</Select>
	</Field>

	<Field
		label="LV internal diameter — LVIDd (mm)"
		inputId="lvInternalDiameterDiastoleMm"
		description="Left-ventricular internal diameter at end-diastole."
	>
		<NumberInput
			id="lvInternalDiameterDiastoleMm"
			label="LV internal diameter — LVIDd (mm)"
			min={0}
			max={200}
			step={0.1}
			bind:value={d.lvInternalDiameterDiastoleMm}
		/>
	</Field>

	<Field label="LV structure">
		<CheckboxGroup label="LV structure">
			<label><CheckboxInput label="Left-ventricular hypertrophy" bind:checked={d.lvHypertrophy} /> Left-ventricular hypertrophy</label>
			<label><CheckboxInput label="Regional wall-motion abnormality" bind:checked={d.regionalWallMotionAbnormality} /> Regional wall-motion abnormality</label>
		</CheckboxGroup>
	</Field>
</Fieldset>
