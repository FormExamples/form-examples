<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const g = assessment.data.treatmentPlanningGoals;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Treatment Planning & Goals">
	<p class="hint">Patient goals, readiness, and the proposed treatment plan.</p>

	<div class="field-grid">
		<Field label="Treatment goal" inputId="treatmentGoal">
			<Select id="treatmentGoal" label="Treatment goal" bind:value={g.treatmentGoal}>
				<option value="">-- Select --</option>
				<option value="abstinence">Abstinence</option>
				<option value="harm-reduction">Harm reduction</option>
				<option value="controlled-use">Controlled use</option>
				<option value="unsure">Unsure</option>
			</Select>
		</Field>
		<Field label="Readiness to change" inputId="readinessToChange">
			<Select id="readinessToChange" label="Readiness to change" bind:value={g.readinessToChange}>
				<option value="">-- Select --</option>
				<option value="pre-contemplation">Pre-contemplation</option>
				<option value="contemplation">Contemplation</option>
				<option value="preparation">Preparation</option>
				<option value="action">Action</option>
				<option value="maintenance">Maintenance</option>
			</Select>
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Motivation level" inputId="motivationLevel">
			<Select id="motivationLevel" label="Motivation level" bind:value={g.motivationLevel}>
				<option value="">-- Select --</option>
				<option value="low">Low</option>
				<option value="moderate">Moderate</option>
				<option value="high">High</option>
			</Select>
		</Field>
		<Field label="Preferred treatment setting" inputId="preferredTreatmentSetting">
			<Select id="preferredTreatmentSetting" label="Preferred treatment setting" bind:value={g.preferredTreatmentSetting}>
				<option value="">-- Select --</option>
				<option value="inpatient">Inpatient</option>
				<option value="residential">Residential</option>
				<option value="day-programme">Day programme</option>
				<option value="outpatient">Outpatient</option>
				<option value="community">Community</option>
			</Select>
		</Field>
	</div>

	<Field label="Interested in counselling?">
		<RadioGroup label="Interested in counselling?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="interestedInCounselling" value={opt.value} bind:group={g.interestedInCounselling} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Interested in medication?">
		<RadioGroup label="Interested in medication?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="interestedInMedication" value={opt.value} bind:group={g.interestedInMedication} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Interested in self-help groups?">
		<RadioGroup label="Interested in self-help groups?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="interestedInSelfHelp" value={opt.value} bind:group={g.interestedInSelfHelp} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Barriers to treatment" inputId="barriersToTreatment">
		<TextAreaInput id="barriersToTreatment" label="Barriers to treatment" rows={3} bind:value={g.barriersToTreatment} />
	</Field>

	<Field label="Support network available?">
		<RadioGroup label="Support network available?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="supportNetworkAvailable" value={opt.value} bind:group={g.supportNetworkAvailable} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if g.supportNetworkAvailable === 'yes'}
		<Field label="Support network details" inputId="supportNetworkDetails">
			<TextInput id="supportNetworkDetails" label="Support network details" bind:value={g.supportNetworkDetails} />
		</Field>
	{/if}

	<Field label="Risk of relapse" inputId="riskOfRelapse">
		<Select id="riskOfRelapse" label="Risk of relapse" bind:value={g.riskOfRelapse}>
			<option value="">-- Select --</option>
			<option value="low">Low</option>
			<option value="moderate">Moderate</option>
			<option value="high">High</option>
		</Select>
	</Field>

	<Field label="Safety plan needed?">
		<RadioGroup label="Safety plan needed?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="safetyPlanNeeded" value={opt.value} bind:group={g.safetyPlanNeeded} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Naloxone provided" inputId="naloxoneProvided">
		<Select id="naloxoneProvided" label="Naloxone provided" bind:value={g.naloxoneProvided}>
			<option value="">-- Select --</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
			<option value="not-applicable">Not applicable</option>
		</Select>
	</Field>

	<Field label="Follow-up plan" inputId="followUpPlan">
		<TextAreaInput id="followUpPlan" label="Follow-up plan" rows={3} bind:value={g.followUpPlan} />
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
