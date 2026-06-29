<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const d = assessment.data.psychologicalAssessment;
	const reg = assessment.data.donorTypeRegistration;
	const isDeceased = $derived(reg.donorType === 'deceased');
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="8. Psychological Assessment (Living Donor)">
	<p class="hint">Mental capacity, voluntariness, coercion screening, and ambivalence — for living donors only.</p>

	{#if isDeceased}
		<p class="not-applicable">Not applicable for deceased donors.</p>
	{:else}
		<Field label="Mental capacity confirmed?">
			<RadioGroup label="Mental capacity confirmed?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="mentalCapacityConfirmed" value={opt.value} bind:group={d.mentalCapacityConfirmed} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>

		<Field label="Do you understand the donation procedure?">
			<RadioGroup label="Do you understand the donation procedure?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="understandsProcedure" value={opt.value} bind:group={d.understandsProcedure} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>

		<Field label="Do you understand the risks involved?">
			<RadioGroup label="Do you understand the risks involved?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="understandsRisks" value={opt.value} bind:group={d.understandsRisks} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>

		<Field label="Is your decision to donate voluntary and free of pressure?">
			<RadioGroup label="Is your decision to donate voluntary and free of pressure?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="voluntaryDecision" value={opt.value} bind:group={d.voluntaryDecision} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>

		<Field label="Are there any coercion concerns identified?">
			<RadioGroup label="Are there any coercion concerns identified?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="coercionConcerns" value={opt.value} bind:group={d.coercionConcerns} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
		{#if d.coercionConcerns === 'yes'}
			<Field label="Coercion details" inputId="coercionDetails">
				<TextAreaInput id="coercionDetails" label="Coercion details" rows={2} placeholder="Describe concerns…" bind:value={d.coercionDetails} />
			</Field>
		{/if}

		<Field label="Significant ambivalence about donation?">
			<RadioGroup label="Significant ambivalence about donation?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="ambivalence" value={opt.value} bind:group={d.ambivalence} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
		{#if d.ambivalence === 'yes'}
			<Field label="Ambivalence details" inputId="ambivalenceDetails">
				<TextAreaInput id="ambivalenceDetails" label="Ambivalence details" rows={2} placeholder="Describe specific concerns or doubts…" bind:value={d.ambivalenceDetails} />
			</Field>
		{/if}

		<Field label="Anxiety about procedure" inputId="anxietyAboutProcedure">
			<Select id="anxietyAboutProcedure" label="Anxiety about procedure" bind:value={d.anxietyAboutProcedure}>
				<option value="">-- Select --</option>
				<option value="none">None</option>
				<option value="mild">Mild</option>
				<option value="moderate">Moderate</option>
				<option value="severe">Severe</option>
			</Select>
		</Field>

		<Field label="Previous psychological / mental health issues?">
			<RadioGroup label="Previous psychological / mental health issues?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="previousPsychologicalIssues" value={opt.value} bind:group={d.previousPsychologicalIssues} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
		{#if d.previousPsychologicalIssues === 'yes'}
			<Field label="Psychological issue details" inputId="psychologicalIssueDetails">
				<TextAreaInput id="psychologicalIssueDetails" label="Psychological issue details" rows={2} placeholder="Diagnosis, treatment, current status…" bind:value={d.psychologicalIssueDetails} />
			</Field>
		{/if}

		<Field label="Do you have a support network?">
			<RadioGroup label="Do you have a support network?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="supportNetwork" value={opt.value} bind:group={d.supportNetwork} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>

		<Field label="Are you willing to proceed with donation?">
			<RadioGroup label="Are you willing to proceed with donation?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="willingToProceed" value={opt.value} bind:group={d.willingToProceed} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/if}
</Fieldset>

<style>
	.not-applicable {
		margin: 0;
		color: var(--color-muted);
		font-style: italic;
	}
</style>
