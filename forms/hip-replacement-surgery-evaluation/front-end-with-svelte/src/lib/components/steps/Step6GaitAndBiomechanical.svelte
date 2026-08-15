<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import { YES_NO } from '#lib/config/options.js';
	import { evaluationStore } from '#lib/stores/evaluation.svelte.js';

	const d = evaluationStore.data;
</script>

<Fieldset legend="6. Physical Examination — Gait and Biomechanical">
	<p class="hint">
		Gait observation and leg-length discrepancy. A Trendelenburg-positive sign and a discrepancy
		over 2cm each raise a safety flag for surgical planning.
	</p>

	<Field label="Limp present" inputId="gait-limpPresent">
		<Select id="gait-limpPresent" label="Limp present" bind:value={d.gait.limpPresent}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Antalgic gait" inputId="gait-antalgicGait">
		<Select id="gait-antalgicGait" label="Antalgic gait" bind:value={d.gait.antalgicGait}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Trendelenburg sign" inputId="gait-trendelenburgSign">
		<Select id="gait-trendelenburgSign" label="Trendelenburg sign" bind:value={d.gait.trendelenburgSign}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Leg-length discrepancy (cm)" inputId="gait-legLengthDiscrepancyAsCm" description="Above 2cm affects surgical planning and fires a safety flag.">
		<NumberInput id="gait-legLengthDiscrepancyAsCm" label="Leg-length discrepancy (cm)" min={0} max={15} step="0.1" bind:value={d.gait.legLengthDiscrepancyAsCm} />
	</Field>
</Fieldset>
