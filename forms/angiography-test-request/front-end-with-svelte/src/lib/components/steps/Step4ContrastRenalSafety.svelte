<script lang="ts">
	import { request } from '$lib/stores/request.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';

	const c = request.data.contrast;
</script>

<Fieldset legend="Contrast & renal safety">
	<p class="hint">
		Contrast requirement, renal function, allergy, diabetes, and metformin — drives the safety axis.
	</p>

	<div class="field-grid">
		<Field label="Contrast required" inputId="contrastRequired">
			<Select id="contrastRequired" label="Contrast required" bind:value={c.contrastRequired}>
				<option value="">— Select —</option>
				<option value="iodinated">Iodinated</option>
				<option value="gadolinium">Gadolinium</option>
				<option value="none">None</option>
				<option value="unknown">Unknown</option>
			</Select>
		</Field>
		<Field label="eGFR (mL/min/1.73m²)" inputId="egfr">
			<NumberInput id="egfr" label="eGFR" min={0} max={200} step={0.1} bind:value={c.egfr} />
		</Field>
	</div>

	<h3 class="subhead">Risk factors</h3>
	<label class="checkbox-field">
		<CheckboxInput id="contrastAllergy" label="Previous contrast-media allergy / reaction" bind:checked={c.contrastAllergy} />
		<span>Previous contrast-media allergy / reaction</span>
	</label>
	<label class="checkbox-field">
		<CheckboxInput id="diabetes" label="Diabetes mellitus" bind:checked={c.diabetes} />
		<span>Diabetes mellitus</span>
	</label>
	<label class="checkbox-field">
		<CheckboxInput id="metformin" label="Taking metformin" bind:checked={c.metformin} />
		<span>Taking metformin</span>
	</label>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.field-grid {
			grid-template-columns: 1fr;
		}
	}
	.subhead {
		margin: 1rem 0 0.25rem;
		font-size: 0.95rem;
		font-weight: 600;
	}
	.checkbox-field {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-top: 0.5rem;
	}
</style>
