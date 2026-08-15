<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	import { assessment } from '#lib/stores/assessment.svelte.js';

	const c = assessment.data.cognitiveMentalHealth;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Cognitive and Mental Health">
	<p class="hint">Memory, mood and learning</p>
	<Field label="Have you ever had a head injury requiring hospitalisation?"><RadioGroup label="Have you ever had a head injury requiring hospitalisation?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="headInjury" value={opt.value} bind:group={c.headInjuryRequiringHospitalisation}/> {opt.label}</label>{/each}</RadioGroup></Field>

	<Field label="Have you attended a memory clinic, or do you have any concerns about your memory?"><RadioGroup label="Have you attended a memory clinic, or do you have any concerns about your memory?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="memoryConcerns" value={opt.value} bind:group={c.memoryConcerns}/> {opt.label}</label>{/each}</RadioGroup></Field>

	<Field label="Have you been diagnosed with dementia?"><RadioGroup label="Have you been diagnosed with dementia?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="dementia" value={opt.value} bind:group={c.dementiaDiagnosis}/> {opt.label}</label>{/each}</RadioGroup></Field>

	<Field label="Do you have a history of, or are you currently suffering with, depression or anxiety?"><RadioGroup label="Do you have a history of, or are you currently suffering with, depression or anxiety?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="depressionAnxiety" value={opt.value} bind:group={c.depressionOrAnxietyHistory}/> {opt.label}</label>{/each}</RadioGroup></Field>
	{#if c.depressionOrAnxietyHistory === 'yes'}
		<Field label="Does this impact on your daily life?"><RadioGroup label="Does this impact on your daily life?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="daImpact" value={opt.value} bind:group={c.depressionAnxietyImpactsDailyLife}/> {opt.label}</label>{/each}</RadioGroup></Field>
		<Field label="Have you seen a doctor with respect to this?"><RadioGroup label="Have you seen a doctor with respect to this?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="daDoctor" value={opt.value} bind:group={c.depressionAnxietySeenDoctor}/> {opt.label}</label>{/each}</RadioGroup></Field>
	{/if}

	<Field label="Do you have a history of learning difficulties or disabilities?"><RadioGroup label="Do you have a history of learning difficulties or disabilities?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="learningDifficulties" value={opt.value} bind:group={c.learningDifficulties}/> {opt.label}</label>{/each}</RadioGroup></Field>
</Fieldset>
