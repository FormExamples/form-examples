<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';

	const p = assessment.data.pregnancyTransfusion;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Pregnancy & Transfusion History">
	<p class="hint">Pregnancy, breastfeeding, and prior receipt of blood or organ.</p>

	<Field label="Are you currently pregnant?">
		<RadioGroup label="Are you currently pregnant?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="currentlyPregnant" value={opt.value} bind:group={p.currentlyPregnant} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Have you been pregnant in the past 6 months?">
		<RadioGroup label="Have you been pregnant in the past 6 months?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="pregnancyPastSixMonths" value={opt.value} bind:group={p.pregnancyPastSixMonths} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Are you currently breastfeeding?">
		<RadioGroup label="Are you currently breastfeeding?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="breastfeeding" value={opt.value} bind:group={p.breastfeeding} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Have you ever received a blood transfusion?">
		<RadioGroup label="Have you ever received a blood transfusion?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="receivedTransfusionEver" value={opt.value} bind:group={p.receivedTransfusionEver} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if p.receivedTransfusionEver === 'yes'}
		<Field label="Date of last transfusion" inputId="lastTransfusionDate">
			<DateInput id="lastTransfusionDate" label="Date of last transfusion" bind:value={p.lastTransfusionDate} />
		</Field>
	{/if}

	<Field label="Have you ever received an organ or tissue transplant?">
		<RadioGroup label="Have you ever received an organ or tissue transplant?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="receivedTransplantEver" value={opt.value} bind:group={p.receivedTransplantEver} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
