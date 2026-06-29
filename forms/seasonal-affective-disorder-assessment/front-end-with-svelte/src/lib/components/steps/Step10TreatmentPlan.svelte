<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const t = assessment.data.treatmentPlan;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Treatment Plan & Monitoring">
	<p class="hint">Planned interventions and the follow-up interval.</p>

	<Field label="Light therapy?">
		<RadioGroup label="Plan light therapy">
			{#each yesNo as opt (opt.value)}
				<label
					><input type="radio" class="radio-input" name="planLightTherapy" value={opt.value} bind:group={t.planLightTherapy} /> {opt.label}</label
				>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Antidepressant medication?">
		<RadioGroup label="Plan antidepressant">
			{#each yesNo as opt (opt.value)}
				<label
					><input type="radio" class="radio-input" name="planAntidepressant" value={opt.value} bind:group={t.planAntidepressant} /> {opt.label}</label
				>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Psychotherapy?">
		<RadioGroup label="Plan psychotherapy">
			{#each yesNo as opt (opt.value)}
				<label
					><input type="radio" class="radio-input" name="planPsychotherapy" value={opt.value} bind:group={t.planPsychotherapy} /> {opt.label}</label
				>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Lifestyle measures (exercise, daylight, sleep hygiene)?">
		<RadioGroup label="Plan lifestyle">
			{#each yesNo as opt (opt.value)}
				<label
					><input type="radio" class="radio-input" name="planLifestyle" value={opt.value} bind:group={t.planLifestyle} /> {opt.label}</label
				>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Crisis / urgent mental-health referral?">
		<RadioGroup label="Plan crisis referral">
			{#each yesNo as opt (opt.value)}
				<label
					><input type="radio" class="radio-input" name="planCrisisReferral" value={opt.value} bind:group={t.planCrisisReferral} /> {opt.label}</label
				>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Follow-up interval" inputId="followUpInterval">
		<Select id="followUpInterval" label="Follow-up interval" bind:value={t.followUpInterval}>
			<option value="">-- Select --</option>
			<option value="2-weeks">2 weeks</option>
			<option value="4-weeks">4 weeks</option>
			<option value="8-weeks">8 weeks</option>
			<option value="12-weeks">12 weeks</option>
		</Select>
	</Field>

	<Field label="Clinician notes" inputId="clinicianNotes">
		<TextAreaInput id="clinicianNotes" label="Clinician notes" rows={4} bind:value={t.clinicianNotes} />
	</Field>
</Fieldset>
