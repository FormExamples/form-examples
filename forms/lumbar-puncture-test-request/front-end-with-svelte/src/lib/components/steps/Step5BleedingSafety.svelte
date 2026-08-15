<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import { request } from '#lib/stores/request.svelte.js';

	const d = request.data.bleeding;

	const inrHigh = $derived(d.inr !== null && Number(d.inr) > 1.5);
	const plateletsLow = $derived(d.plateletCount !== null && Number(d.plateletCount) < 50);
</script>

<Fieldset legend="5. Bleeding and Coagulation Safety">
	<p class="hint">
		Anticoagulation, thrombocytopenia, coagulopathy, and local infection drive the safety axis.
	</p>

	<Field label="Bleeding risk screen">
		<CheckboxGroup label="Bleeding risk screen">
			<label><CheckboxInput label="Taking an anticoagulant" bind:checked={d.takingAnticoagulant} /> Taking an anticoagulant</label>
			<label><CheckboxInput label="Taking an antiplatelet agent" bind:checked={d.takingAntiplatelet} /> Taking an antiplatelet agent</label>
			<label><CheckboxInput label="Known bleeding disorder / coagulopathy" bind:checked={d.bleedingDisorder} /> Known bleeding disorder / coagulopathy</label>
			<label><CheckboxInput label="Local skin / soft-tissue infection at the puncture site" bind:checked={d.localSkinInfection} /> Local skin / soft-tissue infection at the puncture site</label>
		</CheckboxGroup>
	</Field>

	{#if d.takingAnticoagulant}
		<Field label="Anticoagulant agent" inputId="anticoagulantAgent">
			<TextInput
				id="anticoagulantAgent"
				label="Anticoagulant agent"
				placeholder="e.g. warfarin, apixaban, rivaroxaban"
				bind:value={d.anticoagulantAgent}
			/>
		</Field>
	{/if}

	{#if d.takingAntiplatelet}
		<Field label="Antiplatelet agent" inputId="antiplateletAgent">
			<TextInput
				id="antiplateletAgent"
				label="Antiplatelet agent"
				placeholder="e.g. aspirin, clopidogrel"
				bind:value={d.antiplateletAgent}
			/>
		</Field>
	{/if}

	<Field label="INR" inputId="inr" description="LP generally avoided / delayed if INR > 1.5.">
		<NumberInput id="inr" label="INR" min={0} step="0.1" bind:value={d.inr} />
	</Field>

	<Field label="Platelet count (×10⁹/L)" inputId="plateletCount" description="LP generally avoided if < 40–50 ×10⁹/L.">
		<NumberInput id="plateletCount" label="Platelet count" min={0} step="1" bind:value={d.plateletCount} />
	</Field>

	{#if d.localSkinInfection}
		<Alert type="error" heading="Local infection — contraindicated">
			<p>Do not perform LP through infected skin. Choose an alternative site or defer until resolved.</p>
		</Alert>
	{:else if inrHigh || plateletsLow}
		<Alert type="warning" heading="Bleeding risk">
			<p>Correct coagulopathy / thrombocytopenia and discuss with haematology before LP.</p>
		</Alert>
	{/if}
</Fieldset>
