<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import { OPTIONS, YES_NO } from '$lib/config/options';
	import { evaluationStore } from '$lib/stores/evaluation.svelte';

	const d = evaluationStore.data;
</script>

<Fieldset legend="11. General Health and Surgical Fitness Screen">
	<p class="hint">
		A brief general-fitness screening note only. This form does not compute an ASA grade — see the
		dedicated pre-operative assessment forms for anaesthetic-risk questions.
	</p>

	<Field label="Diabetes control" inputId="fitness-diabetesControlled">
		<Select id="fitness-diabetesControlled" label="Diabetes control" bind:value={d.fitness.diabetesControlled}>
			<option value="">— Select —</option>
			{#each OPTIONS.diabetesControlled as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Cardiac disease present" inputId="fitness-cardiacDiseasePresent">
		<Select id="fitness-cardiacDiseasePresent" label="Cardiac disease present" bind:value={d.fitness.cardiacDiseasePresent}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Bleeding disorder or anticoagulant use" inputId="fitness-bleedingDisorderOrAnticoagulantUse">
		<Select id="fitness-bleedingDisorderOrAnticoagulantUse" label="Bleeding disorder or anticoagulant use" bind:value={d.fitness.bleedingDisorderOrAnticoagulantUse}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Smoking status" inputId="fitness-smokingStatus">
		<Select id="fitness-smokingStatus" label="Smoking status" bind:value={d.fitness.smokingStatus}>
			<option value="">— Select —</option>
			{#each OPTIONS.smokingStatus as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="General fitness note" inputId="fitness-generalFitnessNote">
		<TextAreaInput id="fitness-generalFitnessNote" label="General fitness note" rows={2} bind:value={d.fitness.generalFitnessNote} />
	</Field>
</Fieldset>
