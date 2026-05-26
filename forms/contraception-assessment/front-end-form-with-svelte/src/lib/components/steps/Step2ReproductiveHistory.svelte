<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const r = assessment.data.reproductiveHistory;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Reproductive History">
	<p class="hint">Pregnancy and reproductive background.</p>

	<div class="field-grid">
		<Field label="Gravida (total pregnancies)" inputId="gravida">
			<NumberInput id="gravida" label="Gravida" min={0} max={20} bind:value={r.gravida} />
		</Field>
		<Field label="Para (births past 24 weeks)" inputId="para">
			<NumberInput id="para" label="Para" min={0} max={20} bind:value={r.para} />
		</Field>
	</div>

	<Field label="Date of last delivery" inputId="lastDeliveryDate">
		<DateInput id="lastDeliveryDate" label="Date of last delivery" bind:value={r.lastDeliveryDate} />
	</Field>

	<Field label="Are you currently breastfeeding?">
		<RadioGroup label="Are you currently breastfeeding?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="breastfeeding" value={opt.value} bind:group={r.breastfeeding} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Pregnancy intention" inputId="pregnancyIntention">
		<TextAreaInput id="pregnancyIntention" label="Pregnancy intention" rows={3} placeholder="Describe your plans regarding future pregnancies..." bind:value={r.pregnancyIntention} />
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
