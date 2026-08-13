<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { OPTIONS } from '$lib/config/options';
	import { assessmentStore } from '$lib/stores/assessment.svelte';

	const d = assessmentStore.data;
</script>

<Fieldset legend="11. Gastrointestinal and Swallowing">
	<p class="hint">Symptoms that limit what can be eaten or absorbed. Dysphagia without a speech-and-language-therapy assessment raises a high-priority flag.</p>

	<Field label="Appetite change" inputId="gastrointestinal-appetiteChange">
		<Select id="gastrointestinal-appetiteChange" label="Appetite change" bind:value={d.gastrointestinal.appetiteChange}>
			<option value="">— Select —</option>
			{#each OPTIONS.appetiteChange as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Early satiety" inputId="gastrointestinal-earlySatiety">
		<Select id="gastrointestinal-earlySatiety" label="Early satiety" bind:value={d.gastrointestinal.earlySatiety}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Nausea" inputId="gastrointestinal-nausea">
		<Select id="gastrointestinal-nausea" label="Nausea" bind:value={d.gastrointestinal.nausea}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Vomiting" inputId="gastrointestinal-vomiting">
		<Select id="gastrointestinal-vomiting" label="Vomiting" bind:value={d.gastrointestinal.vomiting}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Reflux" inputId="gastrointestinal-reflux">
		<Select id="gastrointestinal-reflux" label="Reflux" bind:value={d.gastrointestinal.reflux}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Dysphagia" inputId="gastrointestinal-dysphagia">
		<Select id="gastrointestinal-dysphagia" label="Dysphagia" bind:value={d.gastrointestinal.dysphagia}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Swallow screen outcome" inputId="gastrointestinal-dysphagiaScreenOutcome">
		<Select id="gastrointestinal-dysphagiaScreenOutcome" label="Swallow screen outcome" bind:value={d.gastrointestinal.dysphagiaScreenOutcome}>
			<option value="">— Select —</option>
			{#each OPTIONS.dysphagiaScreenOutcome as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Speech and language therapy involved" inputId="gastrointestinal-speechAndLanguageTherapy">
		<Select id="gastrointestinal-speechAndLanguageTherapy" label="Speech and language therapy involved" bind:value={d.gastrointestinal.speechAndLanguageTherapy}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Abdominal pain" inputId="gastrointestinal-abdominalPain">
		<Select id="gastrointestinal-abdominalPain" label="Abdominal pain" bind:value={d.gastrointestinal.abdominalPain}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Bloating" inputId="gastrointestinal-bloating">
		<Select id="gastrointestinal-bloating" label="Bloating" bind:value={d.gastrointestinal.bloating}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Bowel frequency (per week)" inputId="gastrointestinal-bowelFrequencyPerWeek">
		<NumberInput id="gastrointestinal-bowelFrequencyPerWeek" label="Bowel frequency (per week)" min={0} max={100} bind:value={d.gastrointestinal.bowelFrequencyPerWeek} />
	</Field>
	<Field label="Bristol stool type" inputId="gastrointestinal-bristolStoolType">
		<Select id="gastrointestinal-bristolStoolType" label="Bristol stool type" bind:value={d.gastrointestinal.bristolStoolType}>
			<option value="">— Select —</option>
			{#each OPTIONS.bristolStoolType as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Constipation" inputId="gastrointestinal-constipation">
		<Select id="gastrointestinal-constipation" label="Constipation" bind:value={d.gastrointestinal.constipation}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Diarrhoea" inputId="gastrointestinal-diarrhoea">
		<Select id="gastrointestinal-diarrhoea" label="Diarrhoea" bind:value={d.gastrointestinal.diarrhoea}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Stoma or fistula" inputId="gastrointestinal-stomaPresent">
		<Select id="gastrointestinal-stomaPresent" label="Stoma or fistula" bind:value={d.gastrointestinal.stomaPresent}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Stoma output (ml/day)" inputId="gastrointestinal-stomaOutputMlPerDay">
		<NumberInput id="gastrointestinal-stomaOutputMlPerDay" label="Stoma output (ml/day)" min={0} max={10000} bind:value={d.gastrointestinal.stomaOutputMlPerDay} />
	</Field>
	<Field label="Malabsorption signs" inputId="gastrointestinal-malabsorptionSigns">
		<Select id="gastrointestinal-malabsorptionSigns" label="Malabsorption signs" bind:value={d.gastrointestinal.malabsorptionSigns}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Gastrointestinal notes" inputId="gastrointestinal-gastrointestinalNotes">
		<TextAreaInput id="gastrointestinal-gastrointestinalNotes" label="Gastrointestinal notes" rows={2} bind:value={d.gastrointestinal.gastrointestinalNotes} />
	</Field>
</Fieldset>
