<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const s = assessment.data.socialLegalImpact;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Social & Legal Impact">
	<p class="hint">Social circumstances and legal consequences of substance use.</p>

	<div class="field-grid">
		<Field label="Employment status" inputId="employmentStatus">
			<Select id="employmentStatus" label="Employment status" bind:value={s.employmentStatus}>
				<option value="">-- Select --</option>
				<option value="employed">Employed</option>
				<option value="unemployed">Unemployed</option>
				<option value="retired">Retired</option>
				<option value="sick-leave">Sick leave</option>
				<option value="student">Student</option>
				<option value="other">Other</option>
			</Select>
		</Field>
		<Field label="Occupation" inputId="occupation">
			<TextInput id="occupation" label="Occupation" bind:value={s.occupation} />
		</Field>
	</div>

	<Field label="Has employment been affected by substance use?">
		<RadioGroup label="Has employment been affected by substance use?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="employmentAffected" value={opt.value} bind:group={s.employmentAffected} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<div class="field-grid">
		<Field label="Housing status" inputId="housingStatus">
			<Select id="housingStatus" label="Housing status" bind:value={s.housingStatus}>
				<option value="">-- Select --</option>
				<option value="stable">Stable</option>
				<option value="unstable">Unstable</option>
				<option value="homeless">Homeless</option>
				<option value="temporary">Temporary</option>
				<option value="supported">Supported</option>
			</Select>
		</Field>
		<Field label="Relationship status" inputId="relationshipStatus">
			<Select id="relationshipStatus" label="Relationship status" bind:value={s.relationshipStatus}>
				<option value="">-- Select --</option>
				<option value="single">Single</option>
				<option value="partnered">Partnered</option>
				<option value="married">Married</option>
				<option value="separated">Separated</option>
				<option value="divorced">Divorced</option>
				<option value="widowed">Widowed</option>
			</Select>
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Impact on relationships" inputId="relationshipImpact">
			<Select id="relationshipImpact" label="Impact on relationships" bind:value={s.relationshipImpact}>
				<option value="none">None</option>
				<option value="mild">Mild</option>
				<option value="moderate">Moderate</option>
				<option value="severe">Severe</option>
			</Select>
		</Field>
		<Field label="Number of dependents" inputId="dependents">
			<NumberInput id="dependents" label="Number of dependents" min={0} max={30} bind:value={s.dependents} />
		</Field>
	</div>

	<Field label="Children safeguarding concerns?">
		<RadioGroup label="Children safeguarding concerns?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="childrenSafeguardingConcerns" value={opt.value} bind:group={s.childrenSafeguardingConcerns} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Social support" inputId="socialSupport">
		<Select id="socialSupport" label="Social support" bind:value={s.socialSupport}>
			<option value="">-- Select --</option>
			<option value="good">Good</option>
			<option value="limited">Limited</option>
			<option value="none">None</option>
		</Select>
	</Field>

	<Field label="Criminal record?">
		<RadioGroup label="Criminal record?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="criminalRecord" value={opt.value} bind:group={s.criminalRecord} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if s.criminalRecord === 'yes'}
		<Field label="Criminal record details" inputId="criminalRecordDetails">
			<TextInput id="criminalRecordDetails" label="Criminal record details" bind:value={s.criminalRecordDetails} />
		</Field>
	{/if}

	<Field label="Current legal issues?">
		<RadioGroup label="Current legal issues?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="currentLegalIssues" value={opt.value} bind:group={s.currentLegalIssues} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if s.currentLegalIssues === 'yes'}
		<Field label="Current legal details" inputId="currentLegalDetails">
			<TextInput id="currentLegalDetails" label="Current legal details" bind:value={s.currentLegalDetails} />
		</Field>
	{/if}

	<Field label="DUI / DWI history?">
		<RadioGroup label="DUI / DWI history?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="duiDwiHistory" value={opt.value} bind:group={s.duiDwiHistory} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Financial difficulties?">
		<RadioGroup label="Financial difficulties?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="financialDifficulties" value={opt.value} bind:group={s.financialDifficulties} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Domestic violence involvement?">
		<RadioGroup label="Domestic violence involvement?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="domesticViolence" value={opt.value} bind:group={s.domesticViolence} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if s.domesticViolence === 'yes'}
		<Field label="Domestic violence details" inputId="domesticViolenceDetails">
			<TextInput id="domesticViolenceDetails" label="Domestic violence details" bind:value={s.domesticViolenceDetails} />
		</Field>
	{/if}
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
