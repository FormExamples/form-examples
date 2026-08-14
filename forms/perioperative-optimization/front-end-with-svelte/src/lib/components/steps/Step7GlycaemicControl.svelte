<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { OPTIONS, YES_NO_OPTS } from '$lib/config/options';
	import { assessmentStore } from '$lib/stores/assessment.svelte';

	const d = assessmentStore.data;
</script>

<Fieldset legend="7. Glycaemic Control">
	<p class="hint">Domain 2. HbA1c reflects roughly three months of glycaemia, so the lead time is 12 weeks.</p>

	<Field label="Diabetes type" inputId="glycaemic-diabetesType">
		<Select id="glycaemic-diabetesType" label="Diabetes type" bind:value={d.glycaemic.diabetesType}>
			<option value="">— Select —</option>
			{#each OPTIONS.diabetesType as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Duration (years)" inputId="glycaemic-diabetesDurationYears">
		<NumberInput id="glycaemic-diabetesDurationYears" label="Duration (years)" min={0} max={100} step="0.1" bind:value={d.glycaemic.diabetesDurationYears} />
	</Field>
	<Field label="HbA1c (mmol/mol)" inputId="glycaemic-hba1cMmolPerMol" description="48 or above triggers the domain; 69 or above (8.5%) defers surgery.">
		<NumberInput id="glycaemic-hba1cMmolPerMol" label="HbA1c (mmol/mol)" step="0.1" bind:value={d.glycaemic.hba1cMmolPerMol} />
	</Field>
	<Field label="HbA1c sample date" inputId="glycaemic-hba1cSampleDate">
		<DateInput id="glycaemic-hba1cSampleDate" label="HbA1c sample date" bind:value={d.glycaemic.hba1cSampleDate} />
	</Field>
	<Field label="Capillary glucose (mmol/L)" inputId="glycaemic-capillaryGlucoseMmolPerL">
		<NumberInput id="glycaemic-capillaryGlucoseMmolPerL" label="Capillary glucose (mmol/L)" step="0.1" bind:value={d.glycaemic.capillaryGlucoseMmolPerL} />
	</Field>
	<Field label="Treatment" inputId="glycaemic-diabetesTreatment">
		<Select id="glycaemic-diabetesTreatment" label="Treatment" bind:value={d.glycaemic.diabetesTreatment}>
			<option value="">— Select —</option>
			{#each OPTIONS.diabetesTreatment as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Insulin regimen" inputId="glycaemic-insulinRegimen">
		<TextInput id="glycaemic-insulinRegimen" label="Insulin regimen" bind:value={d.glycaemic.insulinRegimen} />
	</Field>
	<Field label="Hypoglycaemia awareness" inputId="glycaemic-hypoglycaemiaAwareness">
		<Select id="glycaemic-hypoglycaemiaAwareness" label="Hypoglycaemia awareness" bind:value={d.glycaemic.hypoglycaemiaAwareness}>
			<option value="">— Select —</option>
			{#each OPTIONS.hypoAwareness as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Diabetes team review" inputId="glycaemic-diabetesTeamReview">
		<Select id="glycaemic-diabetesTeamReview" label="Diabetes team review" bind:value={d.glycaemic.diabetesTeamReview}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Review date" inputId="glycaemic-diabetesTeamReviewDate">
		<DateInput id="glycaemic-diabetesTeamReviewDate" label="Review date" bind:value={d.glycaemic.diabetesTeamReviewDate} />
	</Field>
	<Field label="Foot check done" inputId="glycaemic-footCheckDone">
		<Select id="glycaemic-footCheckDone" label="Foot check done" bind:value={d.glycaemic.footCheckDone}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Glycaemic notes" inputId="glycaemic-glycaemicNotes">
		<TextAreaInput id="glycaemic-glycaemicNotes" label="Glycaemic notes" rows={2} bind:value={d.glycaemic.glycaemicNotes} />
	</Field>
</Fieldset>
