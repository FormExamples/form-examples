<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { OPTIONS, YES_NO } from '$lib/config/options';
	import { evaluationStore } from '$lib/stores/evaluation.svelte';

	const d = evaluationStore.data;
</script>

<Fieldset legend="3. Presenting History">
	<p class="hint">Which hip is affected, how long symptoms have been present, and prior hip surgery or injury.</p>

	<Field label="Affected side" inputId="history-affectedSide" required>
		<Select id="history-affectedSide" label="Affected side" bind:value={d.history.affectedSide} required>
			<option value="">— Select —</option>
			{#each OPTIONS.affectedSide as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Symptom duration (months)" inputId="history-symptomDurationMonths">
		<NumberInput id="history-symptomDurationMonths" label="Symptom duration (months)" min={0} max={600} bind:value={d.history.symptomDurationMonths} />
	</Field>
	<Field label="Pain at rest (0–10)" inputId="history-painAtRest0To10">
		<NumberInput id="history-painAtRest0To10" label="Pain at rest (0–10)" min={0} max={10} bind:value={d.history.painAtRest0To10} />
	</Field>
	<Field label="Pain on activity (0–10)" inputId="history-painOnActivity0To10">
		<NumberInput id="history-painOnActivity0To10" label="Pain on activity (0–10)" min={0} max={10} bind:value={d.history.painOnActivity0To10} />
	</Field>
	<Field label="Night pain" inputId="history-nightPain">
		<Select id="history-nightPain" label="Night pain" bind:value={d.history.nightPain}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Prior hip surgery" inputId="history-priorHipSurgery">
		<Select id="history-priorHipSurgery" label="Prior hip surgery" bind:value={d.history.priorHipSurgery}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	{#if d.history.priorHipSurgery === 'yes'}
		<Field label="Prior hip surgery detail" inputId="history-priorHipSurgeryDetail">
			<TextInput id="history-priorHipSurgeryDetail" label="Prior hip surgery detail"
				placeholder="For example, arthroscopy or osteotomy." bind:value={d.history.priorHipSurgeryDetail} />
		</Field>
	{/if}
	<Field label="Prior injury or dysplasia history" inputId="history-priorInjuryOrDysplasiaHistory">
		<Select id="history-priorInjuryOrDysplasiaHistory" label="Prior injury or dysplasia history" bind:value={d.history.priorInjuryOrDysplasiaHistory}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	{#if d.history.priorInjuryOrDysplasiaHistory === 'yes'}
		<Field label="Prior injury or dysplasia detail" inputId="history-priorInjuryOrDysplasiaDetail">
			<TextInput id="history-priorInjuryOrDysplasiaDetail" label="Prior injury or dysplasia detail" bind:value={d.history.priorInjuryOrDysplasiaDetail} />
		</Field>
	{/if}
</Fieldset>
