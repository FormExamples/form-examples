<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import { OPTIONS } from '#lib/config/options.js';
	import { questionnaireStore } from '#lib/stores/questionnaire.svelte.js';

	const d = questionnaireStore.data;
</script>

<Fieldset legend="12. Vaccination Status">
	<Field label="Vaccinations up to date" inputId="vaccination-vaccinationUpToDate">
		<Select id="vaccination-vaccinationUpToDate" label="Vaccinations up to date" bind:value={d.vaccination.vaccinationUpToDate}>
			<option value="">— Select —</option>
			{#each OPTIONS.vaccinationUpToDate as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	{#if d.vaccination.vaccinationUpToDate !== 'yes'}
		<Field label="Notable gaps" inputId="vaccination-vaccinationGapsNote">
			<TextAreaInput id="vaccination-vaccinationGapsNote" label="Notable gaps" rows={2} bind:value={d.vaccination.vaccinationGapsNote} />
		</Field>
	{/if}
</Fieldset>
