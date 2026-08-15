<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.visitDetails;

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Visit Details">
	<p class="hint">Tell us about the visit you are reviewing.</p>

	<div class="field-grid">
		<Field label="Visit date" required inputId="visitDate">
			<DateInput id="visitDate" label="Visit date" required bind:value={d.visitDate} />
		</Field>
		<Field label="Type of visit" inputId="visitType">
			<Select id="visitType" label="Type of visit" bind:value={d.visitType}>
				<option value="">-- Select --</option>
				<option value="outpatient">Outpatient appointment</option>
				<option value="inpatient">Inpatient stay</option>
				<option value="day-case">Day case</option>
				<option value="emergency">Emergency / A&amp;E</option>
				<option value="telehealth">Telehealth / virtual</option>
				<option value="home-visit">Home visit</option>
			</Select>
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Department / Specialty" inputId="department">
			<TextInput id="department" label="Department / Specialty" bind:value={d.department} />
		</Field>
		<Field label="Hospital / Site" inputId="hospitalSite">
			<TextInput id="hospitalSite" label="Hospital / Site" bind:value={d.hospitalSite} />
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Length of stay (days)" inputId="lengthOfStayDays">
			<NumberInput id="lengthOfStayDays" label="Length of stay" min={0} max={365} bind:value={d.lengthOfStayDays} />
		</Field>
		<Field label="How were you referred?" inputId="referralSource">
			<Select id="referralSource" label="How were you referred?" bind:value={d.referralSource}>
				<option value="">-- Select --</option>
				<option value="gp">GP referral</option>
				<option value="self">Self-referral</option>
				<option value="emergency">Emergency / 999</option>
				<option value="another-hospital">Another hospital</option>
				<option value="specialist">Another specialist</option>
			</Select>
		</Field>
	</div>

	<Field label="Was this your first visit to this service?">
		<RadioGroup label="Was this your first visit to this service?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="isFirstVisit" value={opt.value} bind:group={d.isFirstVisit} /> {opt.label}</label>
			{/each}
		</RadioGroup>
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
