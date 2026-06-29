<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.psychologicalAssessment;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
	const severity = [
		{ value: 'none', label: 'None' },
		{ value: 'mild', label: 'Mild' },
		{ value: 'moderate', label: 'Moderate' },
		{ value: 'severe', label: 'Severe' }
	];
</script>

<Fieldset legend="Psychological Assessment">
	<p class="hint">Psychological readiness, motivation, and expectations.</p>

	<Field label="Body dysmorphic concern identified?">
		<RadioGroup label="Body dysmorphic concern identified?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="bodyDysmorphicConcern" value={opt.value} bind:group={d.bodyDysmorphicConcern} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.bodyDysmorphicConcern === 'yes'}
		<Field label="Body dysmorphic concern details" inputId="bodyDysmorphicDetails">
			<TextInput id="bodyDysmorphicDetails" label="Body dysmorphic concern details" bind:value={d.bodyDysmorphicDetails} />
		</Field>
	{/if}

	<Field label="Realistic expectations?" inputId="realisticExpectations">
		<Select id="realisticExpectations" label="Realistic expectations?" bind:value={d.realisticExpectations}>
			<option value="">Select…</option>
			<option value="yes">Yes</option>
			<option value="partly">Partly</option>
			<option value="no">No</option>
		</Select>
	</Field>
	{#if d.realisticExpectations === 'partly' || d.realisticExpectations === 'no'}
		<Field label="Expectations details" inputId="expectationsDetails">
			<TextInput id="expectationsDetails" label="Expectations details" bind:value={d.expectationsDetails} />
		</Field>
	{/if}

	<Field label="Primary motivation" inputId="motivation">
		<Select id="motivation" label="Primary motivation" bind:value={d.motivation}>
			<option value="">Select…</option>
			<option value="functional-improvement">Functional improvement</option>
			<option value="cosmetic-improvement">Cosmetic improvement</option>
			<option value="pain-relief">Pain relief</option>
			<option value="cancer-treatment">Cancer treatment</option>
			<option value="trauma-repair">Trauma repair</option>
			<option value="other">Other</option>
		</Select>
	</Field>
	{#if d.motivation === 'other'}
		<Field label="Motivation (other)" inputId="motivationOther">
			<TextInput id="motivationOther" label="Motivation (other)" bind:value={d.motivationOther} />
		</Field>
	{/if}

	<Field label="Previous mental health history?">
		<RadioGroup label="Previous mental health history?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="previousMentalHealth" value={opt.value} bind:group={d.previousMentalHealth} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.previousMentalHealth === 'yes'}
		<Field label="Mental health details" inputId="mentalHealthDetails">
			<TextInput id="mentalHealthDetails" label="Mental health details" bind:value={d.mentalHealthDetails} />
		</Field>
	{/if}

	<Field label="Anxiety level" inputId="anxietyLevel">
		<Select id="anxietyLevel" label="Anxiety level" bind:value={d.anxietyLevel}>
			<option value="">Select…</option>
			{#each severity as opt (opt.value)}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</Select>
	</Field>

	<Field label="Positive depression screen?">
		<RadioGroup label="Positive depression screen?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="depressionScreen" value={opt.value} bind:group={d.depressionScreen} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Social impact of condition" inputId="socialImpact">
		<Select id="socialImpact" label="Social impact of condition" bind:value={d.socialImpact}>
			<option value="">Select…</option>
			{#each severity as opt (opt.value)}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</Select>
	</Field>
	{#if d.socialImpact !== '' && d.socialImpact !== 'none'}
		<Field label="Social impact details" inputId="socialImpactDetails">
			<TextAreaInput id="socialImpactDetails" label="Social impact details" rows={2} bind:value={d.socialImpactDetails} />
		</Field>
	{/if}

	<Field label="Psychological referral needed?">
		<RadioGroup label="Psychological referral needed?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="psychologicalReferralNeeded" value={opt.value} bind:group={d.psychologicalReferralNeeded} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
