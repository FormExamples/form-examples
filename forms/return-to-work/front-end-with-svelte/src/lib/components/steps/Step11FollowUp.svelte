<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const fu = assessment.data.followUp;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Follow-up plan">
	<p class="hint">Where and when the patient will be reviewed, and which teams are notified.</p>

	<Field label="Review clinic" inputId="reviewClinic">
		<Select id="reviewClinic" label="Review clinic" bind:value={fu.reviewClinic}>
			<option value="">-- Select --</option>
			<option value="gp">GP</option>
			<option value="oh">Occupational health</option>
			<option value="specialist">Specialist</option>
			<option value="none">No review needed</option>
		</Select>
	</Field>

	<Field label="Review date" inputId="reviewDate">
		<DateInput id="reviewDate" label="Review date" bind:value={fu.reviewDate} />
	</Field>

	<Field label="Occupational-health referral made?">
		<RadioGroup label="Occupational-health referral made?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="ohReferralMade" value={opt.value} bind:group={fu.ohReferralMade} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="DVLA notification required?">
		<RadioGroup label="DVLA notification required?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="dvlaNotificationRequired" value={opt.value} bind:group={fu.dvlaNotificationRequired} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Employer occupational-health team notified?">
		<RadioGroup label="Employer occupational-health team notified?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="employerOhNotified" value={opt.value} bind:group={fu.employerOhNotified} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
