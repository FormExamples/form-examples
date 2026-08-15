<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import { OPTIONS, YES_NO } from '#lib/config/options.js';
	import { evaluationStore } from '#lib/stores/evaluation.svelte.js';

	const d = evaluationStore.data;
</script>

<Fieldset legend="4. Ocular &amp; Medical History">
	<Field label="Diabetes" inputId="history-historyDiabetes">
		<Select id="history-historyDiabetes" label="Diabetes" bind:value={d.history.historyDiabetes}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Prior eye surgery" inputId="history-historyPriorEyeSurgery">
		<Select id="history-historyPriorEyeSurgery" label="Prior eye surgery" bind:value={d.history.historyPriorEyeSurgery}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Prior eye surgery detail" inputId="history-historyPriorEyeSurgeryDetail">
		<TextInput id="history-historyPriorEyeSurgeryDetail" label="Prior eye surgery detail" bind:value={d.history.historyPriorEyeSurgeryDetail} />
	</Field>
	<Field label="Ocular trauma" inputId="history-historyOcularTrauma">
		<Select id="history-historyOcularTrauma" label="Ocular trauma" bind:value={d.history.historyOcularTrauma}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Uveitis" inputId="history-historyUveitis">
		<Select id="history-historyUveitis" label="Uveitis" bind:value={d.history.historyUveitis}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Steroid use" inputId="history-historySteroidUse">
		<Select id="history-historySteroidUse" label="Steroid use" bind:value={d.history.historySteroidUse}>
			<option value="">— Select —</option>
			{#each OPTIONS.historySteroidUse as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Family history of cataract" inputId="history-historyFamilyCataract">
		<Select id="history-historyFamilyCataract" label="Family history of cataract" bind:value={d.history.historyFamilyCataract}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Smoking status" inputId="history-historySmokingStatus">
		<Select id="history-historySmokingStatus" label="Smoking status" bind:value={d.history.historySmokingStatus}>
			<option value="">— Select —</option>
			{#each OPTIONS.historySmokingStatus as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="High UV exposure" inputId="history-historyHighUvExposure">
		<Select id="history-historyHighUvExposure" label="High UV exposure" bind:value={d.history.historyHighUvExposure}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="High myopia" inputId="history-historyHighMyopia">
		<Select id="history-historyHighMyopia" label="High myopia" bind:value={d.history.historyHighMyopia}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Medical history notes" inputId="history-medicalHistoryNotes">
		<TextAreaInput id="history-medicalHistoryNotes" label="Medical history notes" rows={2} bind:value={d.history.medicalHistoryNotes} />
	</Field>
</Fieldset>
