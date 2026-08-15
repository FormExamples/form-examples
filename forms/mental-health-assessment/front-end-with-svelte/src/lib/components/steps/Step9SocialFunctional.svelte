<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const sf = assessment.data.socialFunctional;
	const housingOptions = [
		{ value: 'stable', label: 'Stable' },
		{ value: 'unstable', label: 'Unstable' },
		{ value: 'homeless', label: 'Homeless' }
	];
	const supportOptions = [
		{ value: 'strong', label: 'Strong' },
		{ value: 'moderate', label: 'Moderate' },
		{ value: 'limited', label: 'Limited' },
		{ value: 'none', label: 'None' }
	];
	const functionalOptions = [
		{ value: 'none', label: 'Not at all' },
		{ value: 'mild', label: 'Mildly' },
		{ value: 'moderate', label: 'Moderately' },
		{ value: 'severe', label: 'Severely' }
	];
</script>

<Fieldset legend="Social and Functional">
	<p class="hint">Your social circumstances and daily functioning.</p>

	<Field label="Employment Status" inputId="employmentStatus">
		<Select id="employmentStatus" label="Employment Status" bind:value={sf.employmentStatus}>
			<option value="">-- Select --</option>
			<option value="employed-full-time">Employed Full-Time</option>
			<option value="employed-part-time">Employed Part-Time</option>
			<option value="unemployed">Unemployed</option>
			<option value="retired">Retired</option>
			<option value="disabled">Disabled</option>
			<option value="student">Student</option>
		</Select>
	</Field>

	<Field label="Relationship Status" inputId="relationshipStatus">
		<Select id="relationshipStatus" label="Relationship Status" bind:value={sf.relationshipStatus}>
			<option value="">-- Select --</option>
			<option value="single">Single</option>
			<option value="married">Married</option>
			<option value="partnered">Partnered</option>
			<option value="divorced">Divorced</option>
			<option value="widowed">Widowed</option>
			<option value="separated">Separated</option>
		</Select>
	</Field>

	<Field label="Housing Status">
		<RadioGroup label="Housing Status">
			{#each housingOptions as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="housingStatus" value={opt.value} bind:group={sf.housingStatus} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Support System">
		<RadioGroup label="Support System">
			{#each supportOptions as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="supportSystem" value={opt.value} bind:group={sf.supportSystem} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="How much do mental health symptoms affect your daily functioning?">
		<RadioGroup label="Functional impairment">
			{#each functionalOptions as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="functionalImpairment" value={opt.value} bind:group={sf.functionalImpairment} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Additional notes or concerns" inputId="additionalNotes">
		<TextAreaInput
			id="additionalNotes"
			label="Additional notes"
			rows={3}
			placeholder="Anything else you would like your clinician to know"
			bind:value={sf.additionalNotes}
		/>
	</Field>
</Fieldset>
