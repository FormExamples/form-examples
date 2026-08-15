<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import { OPTIONS } from '#lib/config/options.js';
	import { assessmentStore } from '#lib/stores/assessment.svelte.js';

	const d = assessmentStore.data;
</script>

<Fieldset legend="3. Medical History Review">
	<p class="hint">Diagnosed conditions, recent surgery, symptoms, and relevant family history.</p>

	<Field label="Diabetes" inputId="history-conditionDiabetes">
		<Select id="history-conditionDiabetes" label="Diabetes" bind:value={d.history.conditionDiabetes}>
			<option value="">— Select —</option>
			{#each OPTIONS.diabetes as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Coeliac disease" inputId="history-conditionCoeliac">
		<Select id="history-conditionCoeliac" label="Coeliac disease" bind:value={d.history.conditionCoeliac}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Inflammatory bowel disease" inputId="history-conditionInflammatoryBowelDisease">
		<Select id="history-conditionInflammatoryBowelDisease" label="Inflammatory bowel disease" bind:value={d.history.conditionInflammatoryBowelDisease}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Chronic kidney disease" inputId="history-conditionChronicKidneyDisease">
		<Select id="history-conditionChronicKidneyDisease" label="Chronic kidney disease" bind:value={d.history.conditionChronicKidneyDisease}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Liver disease" inputId="history-conditionLiverDisease">
		<Select id="history-conditionLiverDisease" label="Liver disease" bind:value={d.history.conditionLiverDisease}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Cancer" inputId="history-conditionCancer">
		<Select id="history-conditionCancer" label="Cancer" bind:value={d.history.conditionCancer}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Cardiovascular disease" inputId="history-conditionCardiovascularDisease">
		<Select id="history-conditionCardiovascularDisease" label="Cardiovascular disease" bind:value={d.history.conditionCardiovascularDisease}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Respiratory disease" inputId="history-conditionRespiratoryDisease">
		<Select id="history-conditionRespiratoryDisease" label="Respiratory disease" bind:value={d.history.conditionRespiratoryDisease}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Stroke" inputId="history-conditionStroke">
		<Select id="history-conditionStroke" label="Stroke" bind:value={d.history.conditionStroke}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Dementia" inputId="history-conditionDementia">
		<Select id="history-conditionDementia" label="Dementia" bind:value={d.history.conditionDementia}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Eating disorder" inputId="history-conditionEatingDisorder">
		<Select id="history-conditionEatingDisorder" label="Eating disorder" bind:value={d.history.conditionEatingDisorder}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Other conditions" inputId="history-conditionOther">
		<TextInput id="history-conditionOther" label="Other conditions" bind:value={d.history.conditionOther} />
	</Field>
	<Field label="Recent surgery" inputId="history-recentSurgery">
		<Select id="history-recentSurgery" label="Recent surgery" bind:value={d.history.recentSurgery}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Surgery type" inputId="history-recentSurgeryType">
		<TextInput id="history-recentSurgeryType" label="Surgery type" bind:value={d.history.recentSurgeryType} />
	</Field>
	<Field label="Surgery date" inputId="history-recentSurgeryDate">
		<DateInput id="history-recentSurgeryDate" label="Surgery date" bind:value={d.history.recentSurgeryDate} />
	</Field>
	<Field label="Gastrointestinal surgery" inputId="history-gastrointestinalSurgery" description="Resection, bypass, and stoma formation each change absorption.">
		<Select id="history-gastrointestinalSurgery" label="Gastrointestinal surgery" bind:value={d.history.gastrointestinalSurgery}>
			<option value="">— Select —</option>
			{#each OPTIONS.gastrointestinalSurgery as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Current symptoms" inputId="history-currentSymptoms">
		<TextAreaInput id="history-currentSymptoms" label="Current symptoms" rows={2} bind:value={d.history.currentSymptoms} />
	</Field>
	<Field label="Relevant family history" inputId="history-familyHistory">
		<TextAreaInput id="history-familyHistory" label="Relevant family history" rows={2} bind:value={d.history.familyHistory} />
	</Field>
	<Field label="Pregnancy status" inputId="history-pregnancyStatus">
		<Select id="history-pregnancyStatus" label="Pregnancy status" bind:value={d.history.pregnancyStatus}>
			<option value="">— Select —</option>
			{#each OPTIONS.pregnancyStatus as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
</Fieldset>
