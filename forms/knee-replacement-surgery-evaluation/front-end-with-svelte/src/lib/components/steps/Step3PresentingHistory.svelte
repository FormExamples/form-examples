<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import { OPTIONS, YES_NO } from '#lib/config/options.js';
	import { evaluationStore } from '#lib/stores/evaluation.svelte.js';

	const d = evaluationStore.data;
</script>

<Fieldset legend="3. Presenting History">
	<p class="hint">The affected knee, symptom duration and severity, and any prior surgery or injury.</p>

	<Field label="Knee side" inputId="history-kneeSide" required description="Bilateral raises the bilateral-symptomatic safety flag.">
		<Select id="history-kneeSide" label="Knee side" bind:value={d.history.kneeSide} required>
			<option value="">— Select —</option>
			{#each OPTIONS.kneeSide as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Symptom duration (months)" inputId="history-symptomDurationMonths">
		<NumberInput id="history-symptomDurationMonths" label="Symptom duration (months)" min={0} max={1200} bind:value={d.history.symptomDurationMonths} />
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
	<Field label="Prior knee surgery" inputId="history-priorKneeSurgery">
		<Select id="history-priorKneeSurgery" label="Prior knee surgery" bind:value={d.history.priorKneeSurgery}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Prior knee surgery type" inputId="history-priorKneeSurgeryType">
		<Select id="history-priorKneeSurgeryType" label="Prior knee surgery type" bind:value={d.history.priorKneeSurgeryType}>
			<option value="">— Select —</option>
			{#each OPTIONS.priorKneeSurgeryType as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Prior knee surgery date" inputId="history-priorKneeSurgeryDate">
		<DateInput id="history-priorKneeSurgeryDate" label="Prior knee surgery date" bind:value={d.history.priorKneeSurgeryDate} />
	</Field>
	<Field label="Prior injury" inputId="history-priorInjury">
		<Select id="history-priorInjury" label="Prior injury" bind:value={d.history.priorInjury}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Prior injury detail" inputId="history-priorInjuryDetail">
		<TextAreaInput id="history-priorInjuryDetail" label="Prior injury detail" rows={2} bind:value={d.history.priorInjuryDetail} />
	</Field>
</Fieldset>
