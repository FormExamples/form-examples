<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import { YES_NO } from '#lib/config/options.js';
	import { evaluationStore } from '#lib/stores/assessment.svelte.js';

	const d = evaluationStore.data;
</script>

<Fieldset legend="6. Palpation and Cough Impulse">
	<p class="hint">A positive expansile cough impulse is the clinical sign of a hernia.</p>

	<Field label="Palpable mass" inputId="palpation-palpableMass">
		<Select id="palpation-palpableMass" label="Palpable mass" bind:value={d.palpation.palpableMass}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Cough impulse positive" inputId="palpation-coughImpulsePositive">
		<Select id="palpation-coughImpulsePositive" label="Cough impulse positive" bind:value={d.palpation.coughImpulsePositive}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Tenderness" inputId="palpation-tenderness">
		<Select id="palpation-tenderness" label="Tenderness" bind:value={d.palpation.tenderness}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Size (cm)" inputId="palpation-massSizeAsCm">
		<NumberInput id="palpation-massSizeAsCm" label="Size (cm)" min={0} max={40} step={0.1} bind:value={d.palpation.massSizeAsCm} />
	</Field>
	<Field label="Palpation notes" inputId="palpation-palpationNotes">
		<TextAreaInput id="palpation-palpationNotes" label="Palpation notes" rows={3} bind:value={d.palpation.palpationNotes} />
	</Field>
</Fieldset>
