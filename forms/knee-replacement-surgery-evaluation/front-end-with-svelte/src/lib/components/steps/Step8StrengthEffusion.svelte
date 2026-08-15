<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import { YES_NO } from '#lib/config/options.js';
	import { evaluationStore } from '#lib/stores/evaluation.svelte.js';

	const d = evaluationStore.data;
</script>

<Fieldset legend="8. Physical Examination — Muscle Strength and Effusion">
	<p class="hint">Quadriceps strength, joint effusion, and crepitus on examination.</p>

	<Field label="Quadriceps strength (MRC 0–5)" inputId="strength-quadricepsStrengthMrc">
		<NumberInput id="strength-quadricepsStrengthMrc" label="Quadriceps strength (MRC 0–5)" min={0} max={5} bind:value={d.strength.quadricepsStrengthMrc} />
	</Field>
	<Field label="Effusion present" inputId="strength-effusionPresent">
		<Select id="strength-effusionPresent" label="Effusion present" bind:value={d.strength.effusionPresent}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Crepitus present" inputId="strength-crepitusPresent">
		<Select id="strength-crepitusPresent" label="Crepitus present" bind:value={d.strength.crepitusPresent}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
</Fieldset>
