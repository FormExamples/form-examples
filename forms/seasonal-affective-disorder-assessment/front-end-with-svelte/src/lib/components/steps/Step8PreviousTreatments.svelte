<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const p = assessment.data.previousTreatments;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Previous Treatments">
	<p class="hint">Past and current treatments for seasonal or non-seasonal depression.</p>

	<Field label="Antidepressant medication (past)?">
		<RadioGroup label="Antidepressants">
			{#each yesNo as opt (opt.value)}
				<label
					><input type="radio" class="radio-input" name="antidepressants" value={opt.value} bind:group={p.antidepressants} /> {opt.label}</label
				>
			{/each}
		</RadioGroup>
	</Field>
	{#if p.antidepressants === 'yes'}
		<Field label="Antidepressant details" inputId="antidepressantDetails">
			<TextAreaInput id="antidepressantDetails" label="Antidepressant details" rows={2} bind:value={p.antidepressantDetails} />
		</Field>
	{/if}

	<Field label="Psychotherapy (past)?">
		<RadioGroup label="Psychotherapy">
			{#each yesNo as opt (opt.value)}
				<label
					><input type="radio" class="radio-input" name="psychotherapy" value={opt.value} bind:group={p.psychotherapy} /> {opt.label}</label
				>
			{/each}
		</RadioGroup>
	</Field>
	{#if p.psychotherapy === 'yes'}
		<Field label="Psychotherapy details" inputId="psychotherapyDetails">
			<TextAreaInput id="psychotherapyDetails" label="Psychotherapy details" rows={2} bind:value={p.psychotherapyDetails} />
		</Field>
	{/if}

	<Field label="Light therapy (past)?">
		<RadioGroup label="Light therapy history">
			{#each yesNo as opt (opt.value)}
				<label
					><input type="radio" class="radio-input" name="lightTherapyHistory" value={opt.value} bind:group={p.lightTherapyHistory} /> {opt.label}</label
				>
			{/each}
		</RadioGroup>
	</Field>
	{#if p.lightTherapyHistory === 'yes'}
		<Field label="Light therapy history details" inputId="lightTherapyHistoryDetails">
			<TextAreaInput id="lightTherapyHistoryDetails" label="Light therapy history details" rows={2} bind:value={p.lightTherapyHistoryDetails} />
		</Field>
	{/if}

	<Field label="Currently receiving any treatment?">
		<RadioGroup label="Current treatment">
			{#each yesNo as opt (opt.value)}
				<label
					><input type="radio" class="radio-input" name="currentTreatment" value={opt.value} bind:group={p.currentTreatment} /> {opt.label}</label
				>
			{/each}
		</RadioGroup>
	</Field>
	{#if p.currentTreatment === 'yes'}
		<Field label="Current treatment details" inputId="currentTreatmentDetails">
			<TextAreaInput id="currentTreatmentDetails" label="Current treatment details" rows={2} bind:value={p.currentTreatmentDetails} />
		</Field>
	{/if}
</Fieldset>
