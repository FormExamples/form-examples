<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const o = assessment.data.occupationalHealth;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Occupational Health">
	<p class="hint">Vision, hearing, immunisation, and health screening for fitness to work.</p>

	<div class="field-grid">
		<Field label="Vision test" inputId="visionTest">
			<Select id="visionTest" label="Vision test" bind:value={o.visionTest}>
				<option value="">-- Select --</option>
				<option value="pass">Pass</option>
				<option value="fail">Fail</option>
				<option value="refer">Refer</option>
			</Select>
		</Field>
		<Field label="Vision corrected?">
			<RadioGroup label="Vision corrected?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="visionCorrected" value={opt.value} bind:group={o.visionCorrected} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Hearing test" inputId="hearingTest">
			<Select id="hearingTest" label="Hearing test" bind:value={o.hearingTest}>
				<option value="">-- Select --</option>
				<option value="pass">Pass</option>
				<option value="fail">Fail</option>
				<option value="refer">Refer</option>
			</Select>
		</Field>
		<Field label="Hearing aid required?">
			<RadioGroup label="Hearing aid required?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="hearingAidRequired" value={opt.value} bind:group={o.hearingAidRequired} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Immunisation status" inputId="immunisationStatus">
			<Select id="immunisationStatus" label="Immunisation status" bind:value={o.immunisationStatus}>
				<option value="">-- Select --</option>
				<option value="up-to-date">Up to date</option>
				<option value="incomplete">Incomplete</option>
				<option value="unknown">Unknown</option>
			</Select>
		</Field>
		<Field label="Hepatitis B immune?">
			<RadioGroup label="Hepatitis B immune?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="hepatitisBImmune" value={opt.value} bind:group={o.hepatitisBImmune} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	</div>

	<div class="field-grid">
		<Field label="Substance misuse screen" inputId="substanceMisuseScreen">
			<Select id="substanceMisuseScreen" label="Substance misuse screen" bind:value={o.substanceMisuseScreen}>
				<option value="">-- Select --</option>
				<option value="negative">Negative</option>
				<option value="positive">Positive</option>
				<option value="not-done">Not done</option>
			</Select>
		</Field>
		<Field label="Sickness absence days (last year)" inputId="sicknessAbsenceDays">
			<NumberInput id="sicknessAbsenceDays" label="Sickness absence days" min={0} max={365} bind:value={o.sicknessAbsenceDays} />
		</Field>
	</div>

	<Field label="Current medications" inputId="currentMedications">
		<TextAreaInput id="currentMedications" label="Current medications" rows={3} bind:value={o.currentMedications} />
	</Field>

	<div class="field-grid">
		<Field label="Musculoskeletal issues?">
			<RadioGroup label="Musculoskeletal issues?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="musculoskeletalIssues" value={opt.value} bind:group={o.musculoskeletalIssues} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
		<Field label="Respiratory issues?">
			<RadioGroup label="Respiratory issues?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="respiratoryIssues" value={opt.value} bind:group={o.respiratoryIssues} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	</div>

	{#if o.musculoskeletalIssues === 'yes'}
		<Field label="Musculoskeletal details" inputId="musculoskeletalDetails">
			<TextAreaInput id="musculoskeletalDetails" label="Musculoskeletal details" rows={3} bind:value={o.musculoskeletalDetails} />
		</Field>
	{/if}

	{#if o.respiratoryIssues === 'yes'}
		<Field label="Respiratory details" inputId="respiratoryDetails">
			<TextAreaInput id="respiratoryDetails" label="Respiratory details" rows={3} bind:value={o.respiratoryDetails} />
		</Field>
	{/if}

	<Field label="Skin conditions?">
		<RadioGroup label="Skin conditions?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="skinConditions" value={opt.value} bind:group={o.skinConditions} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if o.skinConditions === 'yes'}
		<Field label="Skin condition details" inputId="skinConditionDetails">
			<TextAreaInput id="skinConditionDetails" label="Skin condition details" rows={3} bind:value={o.skinConditionDetails} />
		</Field>
	{/if}

	<Field label="Occupational health notes" inputId="occupationalHealthNotes">
		<TextAreaInput id="occupationalHealthNotes" label="Occupational health notes" rows={3} bind:value={o.occupationalHealthNotes} />
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
