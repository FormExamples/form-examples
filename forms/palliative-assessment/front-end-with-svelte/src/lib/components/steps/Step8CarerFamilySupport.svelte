<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const d = assessment.data.carerFamilySupport;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Carer & Family Support">
	<p class="hint">Primary carer details, carer strain, respite needs, and bereavement risk.</p>

	<div class="field-grid">
		<Field label="Primary carer name" inputId="primaryCarerName">
			<TextInput id="primaryCarerName" label="Primary carer name" bind:value={d.primaryCarerName} />
		</Field>
		<Field label="Relationship to patient" inputId="primaryCarerRelationship">
			<TextInput id="primaryCarerRelationship" label="Relationship to patient" placeholder="e.g. Spouse, daughter" bind:value={d.primaryCarerRelationship} />
		</Field>
	</div>

	<Field label="Does the carer live with the patient?">
		<RadioGroup label="Does the carer live with the patient?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="carerLivesWithPatient" value={opt.value} bind:group={d.carerLivesWithPatient} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Carer strain reported?">
		<RadioGroup label="Carer strain reported?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="carerStrainReported" value={opt.value} bind:group={d.carerStrainReported} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.carerStrainReported === 'yes'}
		<Field label="Carer strain level" inputId="carerStrainLevel">
			<Select id="carerStrainLevel" label="Carer strain level" bind:value={d.carerStrainLevel}>
				<option value="">-- Select --</option>
				<option value="low">Low</option>
				<option value="moderate">Moderate</option>
				<option value="high">High</option>
				<option value="overwhelmed">Overwhelmed</option>
			</Select>
		</Field>
		<Field label="Carer strain notes" inputId="carerStrainNotes">
			<TextAreaInput id="carerStrainNotes" label="Carer strain notes" rows={2} bind:value={d.carerStrainNotes} />
		</Field>
	{/if}

	<Field label="Respite required?">
		<RadioGroup label="Respite required?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="respiteRequired" value={opt.value} bind:group={d.respiteRequired} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.respiteRequired === 'yes'}
		<Field label="Respite notes" inputId="respiteNotes">
			<TextAreaInput id="respiteNotes" label="Respite notes" rows={2} bind:value={d.respiteNotes} />
		</Field>
	{/if}

	<Field label="Children in the household?">
		<RadioGroup label="Children in the household?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="childrenInHousehold" value={opt.value} bind:group={d.childrenInHousehold} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.childrenInHousehold === 'yes'}
		<Field label="Children support notes" inputId="childrenSupportNotes">
			<TextAreaInput id="childrenSupportNotes" label="Children support notes" rows={2} bind:value={d.childrenSupportNotes} />
		</Field>
	{/if}

	<Field label="Bereavement risk identified?">
		<RadioGroup label="Bereavement risk identified?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="bereavementRiskIdentified" value={opt.value} bind:group={d.bereavementRiskIdentified} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if d.bereavementRiskIdentified === 'yes'}
		<Field label="Bereavement notes" inputId="bereavementNotes">
			<TextAreaInput id="bereavementNotes" label="Bereavement notes" rows={2} bind:value={d.bereavementNotes} />
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
		.field-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
