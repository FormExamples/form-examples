<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const o = assessment.data.occupationalVaccines;
	const generic = o as unknown as Record<string, string>;

	const yesNoUnknown = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' },
		{ value: 'unknown', label: 'Unknown' }
	];
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const simpleVaccines = [
		{ key: 'varicellaVaccine', dateKey: 'varicellaVaccineDate', label: 'Varicella vaccine' },
		{ key: 'hepatitisAVaccine', dateKey: 'hepatitisAVaccineDate', label: 'Hepatitis A vaccine' },
		{ key: 'typhoidVaccine', dateKey: 'typhoidVaccineDate', label: 'Typhoid vaccine' },
		{ key: 'rabiesVaccine', dateKey: 'rabiesVaccineDate', label: 'Rabies vaccine' }
	];
</script>

<Fieldset legend="Occupational Vaccines">
	<p class="hint">Vaccines required for higher-risk occupational roles.</p>

	<Field label="Hepatitis B course">
		<RadioGroup label="Hepatitis B course">
			{#each yesNoUnknown as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="hepB" value={opt.value} bind:group={o.hepatitisBCourse} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if o.hepatitisBCourse === 'yes'}
		<div class="field-grid">
			<Field label="Hepatitis B course date" inputId="hepBDate">
				<DateInput id="hepBDate" label="Hepatitis B course date" bind:value={o.hepatitisBCourseDate} />
			</Field>
			<Field label="Doses received" inputId="hepBDoses">
				<NumberInput id="hepBDoses" label="Doses received" min={0} max={6} bind:value={o.hepatitisBDosesReceived} />
			</Field>
		</div>
	{/if}
	<Field label="Hepatitis B antibody level" inputId="hepBAb">
		<Select id="hepBAb" label="Hepatitis B antibody level" bind:value={o.hepatitisBAntiBodyLevel}>
			<option value="">-- Select --</option>
			<option value="adequate">Adequate</option>
			<option value="inadequate">Inadequate</option>
			<option value="not-tested">Not tested</option>
		</Select>
	</Field>

	<Field label="BCG vaccine">
		<RadioGroup label="BCG vaccine">
			{#each yesNoUnknown as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="bcg" value={opt.value} bind:group={o.bcgVaccine} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if o.bcgVaccine === 'yes'}
		<div class="field-grid">
			<Field label="BCG date" inputId="bcgDate">
				<DateInput id="bcgDate" label="BCG date" bind:value={o.bcgVaccineDate} />
			</Field>
			<Field label="BCG scar present?">
				<RadioGroup label="BCG scar present?">
					{#each yesNo as opt (opt.value)}
						<label><input type="radio" class="radio-input" name="bcgScar" value={opt.value} bind:group={o.bcgScarPresent} /> {opt.label}</label>
					{/each}
				</RadioGroup>
			</Field>
		</div>
	{/if}

	<Field label="Varicella (chickenpox) history?" inputId="varicellaHistory">
		<Select id="varicellaHistory" label="Varicella history?" bind:value={o.varicellaHistory}>
			<option value="">-- Select --</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
			<option value="unknown">Unknown</option>
		</Select>
	</Field>

	{#each simpleVaccines as vac (vac.key)}
		<div class="vac-row">
			<Field label={vac.label}>
				<RadioGroup label={vac.label}>
					{#each yesNoUnknown as opt (opt.value)}
						<label><input type="radio" class="radio-input" name={vac.key} value={opt.value} bind:group={generic[vac.key]} /> {opt.label}</label>
					{/each}
				</RadioGroup>
			</Field>
			{#if generic[vac.key] === 'yes'}
				<Field label="Date" inputId={`${vac.key}-date`}>
					<DateInput id={`${vac.key}-date`} label={`${vac.label} date`} bind:value={generic[vac.dateKey]} />
				</Field>
			{/if}
		</div>
	{/each}

	<Field label="Notes" inputId="occNotes">
		<TextAreaInput id="occNotes" label="Notes" rows={2} bind:value={o.notes} />
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
	.vac-row {
		border-bottom: 1px solid var(--color-base-300, #e5e7eb);
		padding-bottom: 0.5rem;
		margin-bottom: 0.5rem;
	}
</style>
