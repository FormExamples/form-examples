<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import { OPTIONS } from '#lib/config/options.js';
	import { evaluationStore } from '#lib/stores/evaluation.svelte.js';

	const d = evaluationStore.data;
</script>

<Fieldset legend="8. Physical Examination — Stability and Muscle Strength">
	<p class="hint">Hip abductor strength, joint stability, and any site of tenderness.</p>

	<Field label="Hip abductor strength (MRC 0–5)" inputId="stability-hipAbductorStrengthMrc">
		<NumberInput id="stability-hipAbductorStrengthMrc" label="Hip abductor strength (MRC 0–5)" min={0} max={5} bind:value={d.stability.hipAbductorStrengthMrc} />
	</Field>
	<Field label="Joint stability" inputId="stability-jointStability">
		<Select id="stability-jointStability" label="Joint stability" bind:value={d.stability.jointStability}>
			<option value="">— Select —</option>
			{#each OPTIONS.jointStability as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Tenderness site" inputId="stability-tendernessSite">
		<Select id="stability-tendernessSite" label="Tenderness site" bind:value={d.stability.tendernessSite}>
			<option value="">— Select —</option>
			{#each OPTIONS.tendernessSite as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
</Fieldset>
