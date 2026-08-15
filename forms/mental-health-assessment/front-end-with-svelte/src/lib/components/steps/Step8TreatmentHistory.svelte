<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const t = assessment.data.treatmentHistory;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Treatment History">
	<p class="hint">Your previous and current mental health treatment.</p>

	<Field label="Have you previously received therapy or counselling?">
		<RadioGroup label="Previous therapy">
			{#each yesNo as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="previousTherapy" value={opt.value} bind:group={t.previousTherapy} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if t.previousTherapy === 'yes'}
		<Field label="Please describe (type of therapy, duration, outcome)" inputId="therapyDetails">
			<TextAreaInput id="therapyDetails" label="Therapy details" rows={3} bind:value={t.therapyDetails} />
		</Field>
	{/if}

	<Field label="Have you ever been hospitalised for mental health reasons?">
		<RadioGroup label="Previous hospitalizations">
			{#each yesNo as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="previousHospitalizations" value={opt.value} bind:group={t.previousHospitalizations} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if t.previousHospitalizations === 'yes'}
		<Field label="Please describe (when, where, reason)" inputId="hospitalizationDetails">
			<TextAreaInput id="hospitalizationDetails" label="Hospitalization details" rows={3} bind:value={t.hospitalizationDetails} />
		</Field>
	{/if}

	<Field label="Current mental health providers (therapist, psychiatrist, etc.)" inputId="currentProviders">
		<TextAreaInput
			id="currentProviders"
			label="Current providers"
			rows={3}
			placeholder="List any current providers and their roles"
			bind:value={t.currentProviders}
		/>
	</Field>
</Fieldset>
