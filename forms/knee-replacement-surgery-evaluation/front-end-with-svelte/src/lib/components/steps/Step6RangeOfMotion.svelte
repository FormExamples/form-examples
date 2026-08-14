<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { YES_NO } from '$lib/config/options';
	import { evaluationStore } from '$lib/stores/evaluation.svelte';

	const d = evaluationStore.data;
</script>

<Fieldset legend="6. Physical Examination — Range of Motion">
	<p class="hint">Active flexion, extension deficit, and any fixed flexion deformity.</p>

	<Field label="Flexion (degrees)" inputId="rangeOfMotion-flexionDegrees">
		<NumberInput id="rangeOfMotion-flexionDegrees" label="Flexion (degrees)" min={0} max={150} bind:value={d.rangeOfMotion.flexionDegrees} />
	</Field>
	<Field label="Extension deficit (degrees)" inputId="rangeOfMotion-extensionDeficitDegrees" description="0 indicates full extension.">
		<NumberInput id="rangeOfMotion-extensionDeficitDegrees" label="Extension deficit (degrees)" min={0} max={90} bind:value={d.rangeOfMotion.extensionDeficitDegrees} />
	</Field>
	<Field label="Fixed flexion deformity present" inputId="rangeOfMotion-fixedFlexionDeformityPresent">
		<Select id="rangeOfMotion-fixedFlexionDeformityPresent" label="Fixed flexion deformity present" bind:value={d.rangeOfMotion.fixedFlexionDeformityPresent}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Fixed flexion deformity (degrees)" inputId="rangeOfMotion-fixedFlexionDeformityDegrees" description="Above 15 degrees raises the fixed-flexion-deformity safety flag.">
		<NumberInput id="rangeOfMotion-fixedFlexionDeformityDegrees" label="Fixed flexion deformity (degrees)" min={0} max={90} bind:value={d.rangeOfMotion.fixedFlexionDeformityDegrees} />
	</Field>
</Fieldset>
