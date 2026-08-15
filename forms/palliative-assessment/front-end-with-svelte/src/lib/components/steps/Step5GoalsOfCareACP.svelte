<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.goalsOfCareACP;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
	const yesNoUnknown = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' },
		{ value: 'unknown', label: 'Unknown' }
	];
</script>

<Fieldset legend="Goals of Care & ACP Documents">
	<p class="hint">Patient priorities, preferred place of care/death, and advance-care planning documents.</p>

	<Field label="Patient priorities and wishes" inputId="patientPrioritiesAndWishes">
		<TextAreaInput id="patientPrioritiesAndWishes" label="Patient priorities and wishes" rows={2} bind:value={d.patientPrioritiesAndWishes} />
	</Field>

	<div class="field-grid">
		<Field label="Preferred place of care" inputId="preferredPlaceOfCare">
			<TextInput id="preferredPlaceOfCare" label="Preferred place of care" bind:value={d.preferredPlaceOfCare} />
		</Field>
		<Field label="Preferred place of death" inputId="preferredPlaceOfDeath">
			<TextInput id="preferredPlaceOfDeath" label="Preferred place of death" bind:value={d.preferredPlaceOfDeath} />
		</Field>
	</div>

	<Field label="ReSPECT form completed?">
		<RadioGroup label="ReSPECT form completed?">
			{#each yesNoUnknown as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="respectFormCompleted" value={opt.value} bind:group={d.respectFormCompleted} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.respectFormCompleted === 'yes'}
		<Field label="ReSPECT form date" inputId="respectFormDate">
			<DateInput id="respectFormDate" label="ReSPECT form date" bind:value={d.respectFormDate} />
		</Field>
	{/if}

	<Field label="ADRT (Advance Decision to Refuse Treatment) completed?">
		<RadioGroup label="ADRT completed?">
			{#each yesNoUnknown as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="adrtCompleted" value={opt.value} bind:group={d.adrtCompleted} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.adrtCompleted === 'yes'}
		<Field label="ADRT date" inputId="adrtDate">
			<DateInput id="adrtDate" label="ADRT date" bind:value={d.adrtDate} />
		</Field>
	{/if}

	<Field label="LPA for Health and Welfare in place?">
		<RadioGroup label="LPA for Health and Welfare in place?">
			{#each yesNoUnknown as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="lpaHealthAndWelfare" value={opt.value} bind:group={d.lpaHealthAndWelfare} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.lpaHealthAndWelfare === 'yes'}
		<Field label="LPA name" inputId="lpaName">
			<TextInput id="lpaName" label="LPA name" bind:value={d.lpaName} />
		</Field>
	{/if}

	<Field label="DNACPR documented?">
		<RadioGroup label="DNACPR documented?">
			{#each yesNoUnknown as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="dnacprDocumented" value={opt.value} bind:group={d.dnacprDocumented} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.dnacprDocumented === 'yes'}
		<Field label="DNACPR date" inputId="dnacprDate">
			<DateInput id="dnacprDate" label="DNACPR date" bind:value={d.dnacprDate} />
		</Field>
	{/if}

	<Field label="Ceiling of treatment discussed?">
		<RadioGroup label="Ceiling of treatment discussed?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="ceilingOfTreatmentDiscussed" value={opt.value} bind:group={d.ceilingOfTreatmentDiscussed} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Ceiling of treatment notes" inputId="ceilingOfTreatmentNotes">
		<TextAreaInput id="ceilingOfTreatmentNotes" label="Ceiling of treatment notes" rows={2} bind:value={d.ceilingOfTreatmentNotes} />
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
