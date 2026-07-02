<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const co = assessment.data.comorbidities;
	const isMale = $derived(assessment.data.identification.sex === 'male');
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Step 6 of 8 — Comorbidity history">
	<p class="hint">Conditions that raise cardiovascular risk.</p>

	<Field label="Family history of coronary heart disease in a first-degree relative aged under 60?">
		<RadioGroup label="Family history of coronary heart disease?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="co-familyHistoryChd" value={opt.value} bind:group={co.familyHistoryChd} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Atrial fibrillation?">
		<RadioGroup label="Atrial fibrillation?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="co-atrialFibrillation" value={opt.value} bind:group={co.atrialFibrillation} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Chronic kidney disease stage" inputId="co-chronicKidneyDiseaseStage">
		<Select id="co-chronicKidneyDiseaseStage" label="Chronic kidney disease stage" bind:value={co.chronicKidneyDiseaseStage}>
			<option value="">— Select —</option>
			<option value="none">No CKD</option>
			<option value="stage3">CKD stage 3</option>
			<option value="stage4">CKD stage 4</option>
			<option value="stage5">CKD stage 5</option>
		</Select>
	</Field>

	<Field label="Migraine?">
		<RadioGroup label="Migraine?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="co-migraine" value={opt.value} bind:group={co.migraine} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Rheumatoid arthritis?">
		<RadioGroup label="Rheumatoid arthritis?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="co-rheumatoidArthritis" value={opt.value} bind:group={co.rheumatoidArthritis} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Systemic lupus erythematosus (SLE)?">
		<RadioGroup label="Systemic lupus erythematosus?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="co-systemicLupusErythematosus" value={opt.value} bind:group={co.systemicLupusErythematosus} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Severe mental illness (schizophrenia, bipolar disorder, or severe depression)?">
		<RadioGroup label="Severe mental illness?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="co-severeMentalIllness" value={opt.value} bind:group={co.severeMentalIllness} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if isMale}
		<Field label="Erectile dysfunction?" description="Contributes to the male model only.">
			<RadioGroup label="Erectile dysfunction?">
				{#each yesNo as opt (opt.value)}
					<label>
						<input type="radio" class="radio-input" name="co-erectileDysfunction" value={opt.value} bind:group={co.erectileDysfunction} />
						{opt.label}
					</label>
				{/each}
			</RadioGroup>
		</Field>
	{/if}
</Fieldset>
