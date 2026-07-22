<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	import { assessment } from '$lib/stores/assessment.svelte';

	const h = assessment.data.haematological;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Haematological">
	<p class="hint">Blood and clotting conditions</p>
	<Field label="Do you have a bleeding disorder?"><RadioGroup label="Do you have a bleeding disorder?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="bleeding" value={opt.value} bind:group={h.bleedingDisorder}/> {opt.label}</label>{/each}</RadioGroup></Field>
	{#if h.bleedingDisorder === 'yes'}
		<Field label="Please provide details" inputId="bleedDetails"><TextInput id="bleedDetails" label="Please provide details" bind:value={h.bleedingDetails} /></Field>
	{/if}

	<Field label="Are you taking blood thinners (anticoagulants/antiplatelets)?"><RadioGroup label="Are you taking blood thinners (anticoagulants/antiplatelets)?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="anticoag" value={opt.value} bind:group={h.onAnticoagulants}/> {opt.label}</label>{/each}</RadioGroup></Field>
	{#if h.onAnticoagulants === 'yes'}
		<Field label="Which medication? (e.g. warfarin, rivaroxaban, clopidogrel)" inputId="anticoagType"><TextInput id="anticoagType" label="Which medication? (e.g. warfarin, rivaroxaban, clopidogrel)" bind:value={h.anticoagulantType} /></Field>
	{/if}

	<Field label="Do you have sickle cell disease?"><RadioGroup label="Do you have sickle cell disease?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="sickle" value={opt.value} bind:group={h.sickleCellDisease}/> {opt.label}</label>{/each}</RadioGroup></Field>
	{#if h.sickleCellDisease !== 'yes'}
		<Field label="Do you carry the sickle cell trait?"><RadioGroup label="Do you carry the sickle cell trait?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="sickleTrait" value={opt.value} bind:group={h.sickleCellTrait}/> {opt.label}</label>{/each}</RadioGroup></Field>
	{/if}

	<Field label="Do you have anaemia?"><RadioGroup label="Do you have anaemia?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="anaemia" value={opt.value} bind:group={h.anaemia}/> {opt.label}</label>{/each}</RadioGroup></Field>

	<Field label="Have you ever had a blood clot in your lungs or legs (DVT or pulmonary embolism)?"><RadioGroup label="Personal history of DVT/PE?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="vtePersonal" value={opt.value} bind:group={h.personalVteHistory}/> {opt.label}</label>{/each}</RadioGroup></Field>
	<Field label="Does a blood relative have a history of blood clots in the lungs or legs (DVT or pulmonary embolism)?"><RadioGroup label="Family history of DVT/PE?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="vteFamily" value={opt.value} bind:group={h.familyVteHistory}/> {opt.label}</label>{/each}</RadioGroup></Field>
	<Field label="Have you ever had a blood transfusion?"><RadioGroup label="Have you ever had a blood transfusion?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="transfusion" value={opt.value} bind:group={h.bloodTransfusionHistory}/> {opt.label}</label>{/each}</RadioGroup></Field>
</Fieldset>
