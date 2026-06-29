<script lang="ts">
	import { request } from '$lib/stores/request.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';

	const b = request.data.bleeding;
</script>

<Fieldset legend="Bleeding & anticoagulation">
	<p class="hint">
		Anticoagulation, antiplatelet, and bleeding-disorder status relevant to arterial access.
	</p>

	<label class="checkbox-field">
		<CheckboxInput id="takingAnticoagulant" label="Taking an anticoagulant" bind:checked={b.takingAnticoagulant} />
		<span>Taking an anticoagulant</span>
	</label>

	<Field label="Anticoagulant agent" inputId="anticoagulantAgent">
		<TextInput
			id="anticoagulantAgent"
			label="Anticoagulant agent"
			placeholder="e.g. warfarin, apixaban, rivaroxaban"
			bind:value={b.anticoagulantAgent}
		/>
	</Field>

	<label class="checkbox-field">
		<CheckboxInput id="takingAntiplatelet" label="Taking an antiplatelet" bind:checked={b.takingAntiplatelet} />
		<span>Taking an antiplatelet</span>
	</label>
	<label class="checkbox-field">
		<CheckboxInput id="bleedingDisorder" label="Known bleeding disorder" bind:checked={b.bleedingDisorder} />
		<span>Known bleeding disorder</span>
	</label>
</Fieldset>

<style>
	.checkbox-field {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-top: 0.5rem;
	}
</style>
