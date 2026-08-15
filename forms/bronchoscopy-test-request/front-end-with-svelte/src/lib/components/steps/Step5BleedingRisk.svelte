<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import { requestStore } from '#lib/stores/result.svelte.js';

	const d = requestStore.data.bleeding;
</script>

<Fieldset legend="5. Bleeding Risk">
	<p class="hint">
		Anticoagulant / antiplatelet therapy and the platelet count drive the pre-procedure risk axis.
	</p>

	<Field label="Anticoagulation">
		<CheckboxGroup label="Anticoagulation">
			<label>
				<CheckboxInput label="Taking an anticoagulant" bind:checked={d.takingAnticoagulant} />
				Taking an anticoagulant
			</label>
		</CheckboxGroup>
	</Field>

	{#if d.takingAnticoagulant}
		<Field label="Anticoagulant agent" inputId="anticoagulantAgent">
			<TextInput
				id="anticoagulantAgent"
				label="Anticoagulant agent"
				placeholder="e.g. apixaban, warfarin"
				bind:value={d.anticoagulantAgent}
			/>
		</Field>
		<Alert type="warning" heading="High bleeding risk">
			<p>
				An anticoagulant is high bleeding risk for biopsy. Confirm the omission / bridging plan
				before any endobronchial biopsy.
			</p>
		</Alert>
	{/if}

	<Field label="Antiplatelet">
		<CheckboxGroup label="Antiplatelet">
			<label>
				<CheckboxInput label="Taking an antiplatelet agent" bind:checked={d.takingAntiplatelet} />
				Taking an antiplatelet agent
			</label>
		</CheckboxGroup>
	</Field>

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

	<Field
		label="Platelet count"
		inputId="plateletCount"
		description="x10⁹/L. Below 50 is high bleeding risk; 50–99 is moderate."
	>
		<NumberInput
			id="plateletCount"
			label="Platelet count"
			min={0}
			max={1000}
			step={1}
			bind:value={d.plateletCount}
		/>
	</Field>
</Fieldset>
