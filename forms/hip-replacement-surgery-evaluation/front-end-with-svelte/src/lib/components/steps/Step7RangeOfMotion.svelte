<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import { YES_NO } from '#lib/config/options.js';
	import { evaluationStore } from '#lib/stores/evaluation.svelte.js';

	const d = evaluationStore.data;
</script>

<Fieldset legend="7. Physical Examination — Range of Motion">
	<p class="hint">Hip range of motion in degrees, and whether a fixed flexion deformity is present.</p>

	<Field label="Flexion (degrees)" inputId="rangeOfMotion-flexionDegrees">
		<NumberInput id="rangeOfMotion-flexionDegrees" label="Flexion (degrees)" min={0} max={150} bind:value={d.rangeOfMotion.flexionDegrees} />
	</Field>
	<Field label="Internal rotation (degrees)" inputId="rangeOfMotion-internalRotationDegrees">
		<NumberInput id="rangeOfMotion-internalRotationDegrees" label="Internal rotation (degrees)" min={0} max={60} bind:value={d.rangeOfMotion.internalRotationDegrees} />
	</Field>
	<Field label="External rotation (degrees)" inputId="rangeOfMotion-externalRotationDegrees">
		<NumberInput id="rangeOfMotion-externalRotationDegrees" label="External rotation (degrees)" min={0} max={60} bind:value={d.rangeOfMotion.externalRotationDegrees} />
	</Field>
	<Field label="Abduction (degrees)" inputId="rangeOfMotion-abductionDegrees">
		<NumberInput id="rangeOfMotion-abductionDegrees" label="Abduction (degrees)" min={0} max={60} bind:value={d.rangeOfMotion.abductionDegrees} />
	</Field>
	<Field label="Adduction (degrees)" inputId="rangeOfMotion-adductionDegrees">
		<NumberInput id="rangeOfMotion-adductionDegrees" label="Adduction (degrees)" min={0} max={45} bind:value={d.rangeOfMotion.adductionDegrees} />
	</Field>
	<Field label="Fixed flexion deformity present" inputId="rangeOfMotion-fixedFlexionDeformityPresent">
		<Select id="rangeOfMotion-fixedFlexionDeformityPresent" label="Fixed flexion deformity present" bind:value={d.rangeOfMotion.fixedFlexionDeformityPresent}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
</Fieldset>
