<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculateEdd } from '$lib/engine/utils';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const p = assessment.data.currentPregnancy;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	// Estimate the EDD from the LMP (Naegele's rule) when no EDD is recorded yet.
	$effect(() => {
		if (p.lastMenstrualPeriod && !p.estimatedDueDate) {
			assessment.data.currentPregnancy.estimatedDueDate = calculateEdd(p.lastMenstrualPeriod);
		}
	});
</script>

<Fieldset legend="Current Pregnancy Details">
	<p class="hint">Key dates and pregnancy characteristics.</p>

	<div class="field-grid">
		<Field label="Last menstrual period (LMP)" inputId="lastMenstrualPeriod">
			<DateInput id="lastMenstrualPeriod" label="Last menstrual period" bind:value={p.lastMenstrualPeriod} />
		</Field>
		<Field label="Estimated due date (EDD)" inputId="estimatedDueDate" description="Auto-estimated from LMP">
			<DateInput id="estimatedDueDate" label="Estimated due date" bind:value={p.estimatedDueDate} />
		</Field>
	</div>

	<Field label="Dating scan date" inputId="datingScanDate">
		<DateInput id="datingScanDate" label="Dating scan date" bind:value={p.datingScanDate} />
	</Field>

	<div class="field-grid">
		<Field label="Current gestation - weeks" inputId="gestationWeeks">
			<NumberInput id="gestationWeeks" label="Gestation weeks" min={0} max={45} bind:value={p.gestationWeeks} />
		</Field>
		<Field label="Current gestation - days" inputId="gestationDays">
			<NumberInput id="gestationDays" label="Gestation days" min={0} max={6} bind:value={p.gestationDays} />
		</Field>
	</div>

	<Field label="Multiple pregnancy (twins, triplets)?">
		<RadioGroup label="Multiple pregnancy?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="multiplePregnancy" value={opt.value} bind:group={p.multiplePregnancy} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if p.multiplePregnancy === 'yes'}
		<Field label="Chorionicity" inputId="chorionicity">
			<Select id="chorionicity" label="Chorionicity" bind:value={p.chorionicity}>
				<option value="">— Select —</option>
				<option value="dcda">DCDA - dichorionic diamniotic</option>
				<option value="mcda">MCDA - monochorionic diamniotic</option>
				<option value="mcma">MCMA - monochorionic monoamniotic</option>
				<option value="unknown">Unknown / pending</option>
			</Select>
		</Field>
	{/if}

	<Field label="Conceived via IVF / assisted reproduction?">
		<RadioGroup label="Conceived via IVF / assisted reproduction?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="ivfConception" value={opt.value} bind:group={p.ivfConception} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Took folic acid pre-conception?">
		<RadioGroup label="Took folic acid pre-conception?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="folicAcidPreconception" value={opt.value} bind:group={p.folicAcidPreconception} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Is this the first antenatal contact?">
		<RadioGroup label="Is this the first antenatal contact?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="firstAntenatalContact" value={opt.value} bind:group={p.firstAntenatalContact} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Booking appointment date" inputId="bookingDate">
		<DateInput id="bookingDate" label="Booking appointment date" bind:value={p.bookingDate} />
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
