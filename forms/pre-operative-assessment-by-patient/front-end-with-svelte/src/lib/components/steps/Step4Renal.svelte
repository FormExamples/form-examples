<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	import { assessment } from '#lib/stores/assessment.svelte.js';

	const r = assessment.data.renal;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Renal">
	<p class="hint">Kidney conditions</p>
	<Field label="Do you have chronic kidney disease?"><RadioGroup label="Do you have chronic kidney disease?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="ckd" value={opt.value} bind:group={r.ckd}/> {opt.label}</label>{/each}</RadioGroup></Field>
	{#if r.ckd === 'yes'}
		<Field label="CKD Stage" required inputId="ckdStage"><Select id="ckdStage" label="CKD Stage" required bind:value={r.ckdStage}><option value="">-- Select --</option>{#each [
				{ value: '1', label: 'Stage 1' },
				{ value: '2', label: 'Stage 2' },
				{ value: '3', label: 'Stage 3' },
				{ value: '4', label: 'Stage 4' },
				{ value: '5', label: 'Stage 5' }
			] as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}</Select></Field>
	{/if}

	<Field label="Are you on dialysis?"><RadioGroup label="Are you on dialysis?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="dialysis" value={opt.value} bind:group={r.dialysis}/> {opt.label}</label>{/each}</RadioGroup></Field>
	{#if r.dialysis === 'yes'}
		<Field label="Dialysis Type" required inputId="dialysisType"><Select id="dialysisType" label="Dialysis Type" required bind:value={r.dialysisType}><option value="">-- Select --</option>{#each [
				{ value: 'haemodialysis', label: 'Haemodialysis' },
				{ value: 'peritoneal', label: 'Peritoneal dialysis' }
			] as opt (opt.value)}<option value={opt.value}>{opt.label}</option>{/each}</Select></Field>
	{/if}

	<Field label="Any urinary problems (difficulty passing urine, frequency at night)?"><RadioGroup label="Any urinary problems?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="urinarySymptoms" value={opt.value} bind:group={r.urinarySymptoms}/> {opt.label}</label>{/each}</RadioGroup></Field>
	<Field label="Have you ever had a urinary catheter?"><RadioGroup label="Have you ever had a urinary catheter?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="catheter" value={opt.value} bind:group={r.urinaryCatheterHistory}/> {opt.label}</label>{/each}</RadioGroup></Field>
	<Field label="Do you have prostate problems?"><RadioGroup label="Do you have prostate problems?">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="prostate" value={opt.value} bind:group={r.prostateProblems}/> {opt.label}</label>{/each}</RadioGroup></Field>
</Fieldset>
