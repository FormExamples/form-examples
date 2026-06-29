<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.commentsSuggestions;

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Comments & Suggestions">
	<p class="hint">Tell us in your own words. All free-text fields are optional.</p>

	<Field label="What went well?" inputId="whatWentWell">
		<TextAreaInput id="whatWentWell" label="What went well?" rows={3} bind:value={d.whatWentWell} />
	</Field>
	<Field label="What could be improved?" inputId="whatCouldImprove">
		<TextAreaInput id="whatCouldImprove" label="What could be improved?" rows={3} bind:value={d.whatCouldImprove} />
	</Field>
	<Field label="Specific staff praise" inputId="specificStaffPraise">
		<TextAreaInput id="specificStaffPraise" label="Specific staff praise" rows={2} bind:value={d.specificStaffPraise} />
	</Field>

	<Field label="Did you raise a formal complaint about this visit?">
		<RadioGroup label="Did you raise a formal complaint about this visit?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="complaintRaised" value={opt.value} bind:group={d.complaintRaised} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if d.complaintRaised === 'yes'}
		<Field label="Complaint details" inputId="complaintDetails">
			<TextAreaInput id="complaintDetails" label="Complaint details" rows={3} bind:value={d.complaintDetails} />
		</Field>
	{/if}

	<Field label="Any other comments?" inputId="additionalComments">
		<TextAreaInput id="additionalComments" label="Any other comments?" rows={3} bind:value={d.additionalComments} />
	</Field>

	<Field label="Would you be willing to be contacted about this feedback?">
		<RadioGroup label="Would you be willing to be contacted about this feedback?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="consentToContact" value={opt.value} bind:group={d.consentToContact} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if d.consentToContact === 'yes'}
		<div class="field-grid">
			<Field label="Contact email" inputId="contactEmail">
				<TextInput id="contactEmail" type="email" label="Contact email" bind:value={d.contactEmail} />
			</Field>
			<Field label="Contact phone" inputId="contactPhone">
				<TextInput id="contactPhone" type="tel" label="Contact phone" bind:value={d.contactPhone} />
			</Field>
		</div>
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
