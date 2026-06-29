<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const b = assessment.data.birthHistory;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
	const deliveryOptions = [
		{ value: 'vaginal', label: 'Vaginal' },
		{ value: 'caesarean-elective', label: 'Caesarean (Elective)' },
		{ value: 'caesarean-emergency', label: 'Caesarean (Emergency)' },
		{ value: 'assisted', label: 'Assisted (Forceps/Vacuum)' }
	];
</script>

<Fieldset legend="Birth History">
	<p class="hint">Details about the child's birth.</p>

	<Field label="Gestational Age at Birth (weeks)" required inputId="gestAge">
		<NumberInput id="gestAge" label="Gestational age" min={20} max={44} required bind:value={b.gestationalAge} />
	</Field>
	<Field label="Birth Weight (kg)" required inputId="birthWeight">
		<NumberInput id="birthWeight" label="Birth weight" min={0.3} max={7} step={0.01} required bind:value={b.birthWeight} />
	</Field>

	<Field label="Delivery Type" required inputId="deliveryType">
		<Select id="deliveryType" label="Delivery type" required bind:value={b.deliveryType}>
			<option value="">-- Select --</option>
			{#each deliveryOptions as opt}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</Select>
	</Field>

	<div class="field-grid">
		<Field label="APGAR Score (1 minute)" inputId="apgar1">
			<NumberInput id="apgar1" label="APGAR 1 minute" min={0} max={10} bind:value={b.apgarOneMinute} />
		</Field>
		<Field label="APGAR Score (5 minutes)" inputId="apgar5">
			<NumberInput id="apgar5" label="APGAR 5 minutes" min={0} max={10} bind:value={b.apgarFiveMinutes} />
		</Field>
	</div>

	<Field label="Was there a NICU stay?">
		<RadioGroup label="NICU stay">
			{#each yesNo as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="nicu" value={opt.value} bind:group={b.nicuStay} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if b.nicuStay === 'yes'}
		<Field label="Duration of NICU stay (days)" inputId="nicuDuration">
			<NumberInput id="nicuDuration" label="NICU duration" min={1} max={365} bind:value={b.nicuDuration} />
		</Field>
	{/if}

	<Field label="Were there any birth complications?">
		<RadioGroup label="Birth complications">
			{#each yesNo as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="birthComp" value={opt.value} bind:group={b.birthComplications} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if b.birthComplications === 'yes'}
		<Field label="Please describe the complications" inputId="birthCompDetails">
			<TextAreaInput id="birthCompDetails" label="Complications" rows={3} bind:value={b.birthComplicationDetails} />
		</Field>
	{/if}
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.field-grid { grid-template-columns: 1fr; }
	}
</style>
