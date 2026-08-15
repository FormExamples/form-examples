<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const s = assessment.data.socialHistory;
	const yesNo = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];
	const housingOptions = [
		{ value: 'stable', label: 'Stable housing' },
		{ value: 'temporary', label: 'Temporary accommodation' },
		{ value: 'homeless', label: 'Homeless / rough sleeping' },
		{ value: 'supported', label: 'Supported housing' },
		{ value: 'institution', label: 'Residential institution' }
	];
	const employmentOptions = [
		{ value: 'employed', label: 'Employed' },
		{ value: 'unemployed', label: 'Unemployed' },
		{ value: 'retired', label: 'Retired' },
		{ value: 'student', label: 'Student' },
		{ value: 'disability', label: 'On disability' }
	];
</script>

<Fieldset legend="Social History">
	<p class="hint">Social circumstances affecting mental health and recovery.</p>

	<Field label="Housing Status" inputId="housing">
		<Select id="housing" label="Housing" bind:value={s.housing}>
			<option value="">-- Select --</option>
			{#each housingOptions as opt}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>
	<Field label="Housing Details" inputId="housingDetails">
		<TextInput id="housingDetails" label="Housing details" bind:value={s.housingDetails} />
	</Field>

	<Field label="Employment Status" inputId="employment">
		<Select id="employment" label="Employment" bind:value={s.employment}>
			<option value="">-- Select --</option>
			{#each employmentOptions as opt}<option value={opt.value}>{opt.label}</option>{/each}
		</Select>
	</Field>
	<Field label="Employment Details" inputId="employmentDetails">
		<TextInput id="employmentDetails" label="Employment details" bind:value={s.employmentDetails} />
	</Field>

	<Field label="Relationships" inputId="relationships">
		<TextAreaInput id="relationships" label="Relationships" rows={3} bind:value={s.relationships} />
	</Field>

	<Field label="Current legal issues?">
		<RadioGroup label="Legal issues">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="legal" value={opt.value} bind:group={s.legalIssues} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if s.legalIssues === 'yes'}
		<Field label="Legal Details" inputId="legalDetails">
			<TextAreaInput id="legalDetails" label="Legal details" rows={3} bind:value={s.legalDetails} />
		</Field>
	{/if}

	<Field label="Financial difficulties?">
		<RadioGroup label="Financial difficulties">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="financial" value={opt.value} bind:group={s.financialDifficulties} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Support Network" inputId="supportNetwork">
		<TextAreaInput id="supportNetwork" label="Support network" rows={3} bind:value={s.supportNetwork} />
	</Field>
</Fieldset>
