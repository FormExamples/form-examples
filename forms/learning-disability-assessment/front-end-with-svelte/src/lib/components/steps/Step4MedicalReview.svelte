<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const m = assessment.data.medicalReview;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Medical Review">
	<p class="hint">Epilepsy, mental health, medications, and common comorbidities.</p>

	<Field label="Does the person have epilepsy?">
		<RadioGroup label="Does the person have epilepsy?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="hasEpilepsy" value={opt.value} bind:group={m.hasEpilepsy} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if m.hasEpilepsy === 'yes'}
		<div class="field-grid">
			<Field label="Date of last seizure" inputId="lastSeizureDate">
				<DateInput id="lastSeizureDate" label="Date of last seizure" bind:value={m.lastSeizureDate} />
			</Field>
			<Field label="Average seizures per month" inputId="seizuresPerMonth">
				<NumberInput id="seizuresPerMonth" label="Average seizures per month" min={0} max={200} bind:value={m.seizuresPerMonth} />
			</Field>
		</div>
	{/if}

	<Field label="Does the person have a mental health diagnosis?">
		<RadioGroup label="Does the person have a mental health diagnosis?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="hasMentalHealthDiagnosis" value={opt.value} bind:group={m.hasMentalHealthDiagnosis} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if m.hasMentalHealthDiagnosis === 'yes'}
		<Field label="Mental health diagnosis details" inputId="mentalHealthDetails">
			<TextInput id="mentalHealthDetails" label="Mental health diagnosis details" bind:value={m.mentalHealthDetails} />
		</Field>
	{/if}

	<Field label="Does the person take psychotropic medication?">
		<RadioGroup label="Does the person take psychotropic medication?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="takesPsychotropic" value={opt.value} bind:group={m.takesPsychotropic} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if m.takesPsychotropic === 'yes'}
		<Field label="Has a STOMP medication review been done in the last 12 months?">
			<RadioGroup label="Has a STOMP medication review been done in the last 12 months?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="stompReviewDone" value={opt.value} bind:group={m.stompReviewDone} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/if}

	<Field label="Current medications (name, dose, frequency)" inputId="currentMedications">
		<TextAreaInput id="currentMedications" label="Current medications" rows={4} placeholder="List all regular medications…" bind:value={m.currentMedications} />
	</Field>

	<Field label="Dysphagia (difficulty swallowing)?">
		<RadioGroup label="Dysphagia (difficulty swallowing)?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="hasDysphagia" value={opt.value} bind:group={m.hasDysphagia} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Persistent constipation?">
		<RadioGroup label="Persistent constipation?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="hasConstipation" value={opt.value} bind:group={m.hasConstipation} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Bladder or bowel incontinence?">
		<RadioGroup label="Bladder or bowel incontinence?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="hasIncontinence" value={opt.value} bind:group={m.hasIncontinence} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Sleep problems?">
		<RadioGroup label="Sleep problems?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="hasSleepProblems" value={opt.value} bind:group={m.hasSleepProblems} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Other medical issues" inputId="otherMedicalIssues">
		<TextAreaInput id="otherMedicalIssues" label="Other medical issues" rows={3} bind:value={m.otherMedicalIssues} />
	</Field>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.field-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
