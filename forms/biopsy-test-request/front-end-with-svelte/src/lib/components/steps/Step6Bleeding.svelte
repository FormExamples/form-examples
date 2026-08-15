<script lang="ts">
	import { request } from '#lib/stores/request.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';

	const d = request.data.bleeding;
</script>

<Fieldset legend="Bleeding & coagulation">
	<p class="hint">
		Anticoagulant / antiplatelet use, INR, platelets, bleeding disorder, and immunosuppression —
		drive the bleeding-risk axis.
	</p>

	<Field label="Anticoagulant">
		<label class="checkbox-row">
			<CheckboxInput label="Taking an anticoagulant" bind:checked={d.takingAnticoagulant} />
			Taking an anticoagulant (e.g. warfarin, DOAC)
		</label>
	</Field>

	<Field label="Anticoagulant agent" inputId="anticoagulantAgent">
		<TextInput id="anticoagulantAgent" label="Anticoagulant agent" placeholder="e.g. apixaban" bind:value={d.anticoagulantAgent} />
	</Field>

	<Field label="Antiplatelet">
		<label class="checkbox-row">
			<CheckboxInput label="Taking an antiplatelet" bind:checked={d.takingAntiplatelet} />
			Taking an antiplatelet (e.g. clopidogrel)
		</label>
	</Field>

	<Field label="Antiplatelet agent" inputId="antiplateletAgent">
		<TextInput id="antiplateletAgent" label="Antiplatelet agent" placeholder="e.g. clopidogrel" bind:value={d.antiplateletAgent} />
	</Field>

	<div class="field-grid">
		<Field label="INR" inputId="inr">
			<NumberInput id="inr" label="INR" min={0.5} max={20} step={0.1} bind:value={d.inr} />
		</Field>
		<Field label="Platelet count (×10⁹/L)" inputId="plateletCount">
			<NumberInput id="plateletCount" label="Platelet count" min={0} max={2000} step={1} bind:value={d.plateletCount} />
		</Field>
	</div>

	<h3 class="subhead">Coagulation flags</h3>
	<Field label="Bleeding disorder">
		<label class="checkbox-row">
			<CheckboxInput label="Known bleeding disorder / coagulopathy" bind:checked={d.bleedingDisorder} />
			Known bleeding disorder / coagulopathy
		</label>
	</Field>
	<Field label="Immunosuppressed">
		<label class="checkbox-row">
			<CheckboxInput label="Immunosuppressed" bind:checked={d.immunosuppressed} />
			Immunosuppressed
		</label>
	</Field>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	.checkbox-row {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.subhead {
		margin: 1rem 0 0.25rem;
		font-size: 0.95rem;
		font-weight: 600;
	}
	@media (max-width: 640px) {
		.field-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
