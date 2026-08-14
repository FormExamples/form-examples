<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { OPTIONS, YES_NO } from '$lib/config/options';
	import { evaluationStore } from '$lib/stores/evaluation.svelte';

	const d = evaluationStore.data;
</script>

<Fieldset legend="11. General Health and Surgical Fitness Screen">
	<p class="hint">
		A high-level screen only. This form does not grade ASA physical status and does not replace a
		formal pre-operative assessment — see the pre-operative assessment forms for that.
	</p>

	<Field label="Diabetes control" inputId="generalHealth-diabetesControlled">
		<Select id="generalHealth-diabetesControlled" label="Diabetes control" bind:value={d.generalHealth.diabetesControlled}>
			<option value="">— Select —</option>
			{#each OPTIONS.diabetesControlled as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Cardiac disease" inputId="generalHealth-cardiacDisease">
		<Select id="generalHealth-cardiacDisease" label="Cardiac disease" bind:value={d.generalHealth.cardiacDisease}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Bleeding disorder or anticoagulant" inputId="generalHealth-bleedingDisorderOrAnticoagulant">
		<Select id="generalHealth-bleedingDisorderOrAnticoagulant" label="Bleeding disorder or anticoagulant" bind:value={d.generalHealth.bleedingDisorderOrAnticoagulant}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Smoking status" inputId="generalHealth-smokingStatus">
		<Select id="generalHealth-smokingStatus" label="Smoking status" bind:value={d.generalHealth.smokingStatus}>
			<option value="">— Select —</option>
			{#each OPTIONS.smokingStatus as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="General fitness note" inputId="generalHealth-generalFitnessNote">
		<TextAreaInput id="generalHealth-generalFitnessNote" label="General fitness note" rows={3} bind:value={d.generalHealth.generalFitnessNote} />
	</Field>
</Fieldset>
