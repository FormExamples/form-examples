<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const v = assessment.data.vaccinationHistory;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Vaccination History">
	<p class="hint">Existing records, prior reactions, and immune status.</p>

	<Field label="Is a vaccination record available?">
		<RadioGroup label="Is a vaccination record available?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="hasRecord" value={opt.value} bind:group={v.hasVaccinationRecord} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if v.hasVaccinationRecord === 'yes'}
		<Field label="Record source" inputId="recordSource">
			<Select id="recordSource" label="Record source" bind:value={v.recordSource}>
				<option value="">-- Select --</option>
				<option value="red-book">Red book</option>
				<option value="gp-records">GP records</option>
				<option value="occupational-health">Occupational health</option>
				<option value="self-reported">Self-reported</option>
				<option value="overseas-records">Overseas records</option>
				<option value="other">Other</option>
			</Select>
		</Field>
		{#if v.recordSource === 'other'}
			<Field label="Other record source" inputId="recordSourceOther">
				<TextInput id="recordSourceOther" label="Other record source" bind:value={v.recordSourceOther} />
			</Field>
		{/if}
	{/if}

	<Field label="Previous adverse reaction to a vaccine?">
		<RadioGroup label="Previous adverse reaction to a vaccine?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="prevReaction" value={opt.value} bind:group={v.previousAdverseReaction} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if v.previousAdverseReaction === 'yes'}
		<Field label="Which vaccine?" inputId="reactionVaccine">
			<TextInput id="reactionVaccine" label="Which vaccine?" bind:value={v.adverseReactionVaccine} />
		</Field>
		<Field label="Reaction severity" inputId="reactionSeverity">
			<Select id="reactionSeverity" label="Reaction severity" bind:value={v.adverseReactionSeverity}>
				<option value="">-- Select --</option>
				<option value="mild">Mild</option>
				<option value="moderate">Moderate</option>
				<option value="severe">Severe</option>
				<option value="anaphylaxis">Anaphylaxis</option>
			</Select>
		</Field>
		<Field label="Reaction details" inputId="reactionDetails">
			<TextAreaInput id="reactionDetails" label="Reaction details" rows={2} bind:value={v.adverseReactionDetails} />
		</Field>
	{/if}

	<Field label="Immunocompromised?">
		<RadioGroup label="Immunocompromised?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="immuno" value={opt.value} bind:group={v.immunocompromised} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if v.immunocompromised === 'yes'}
		<Field label="Immunocompromise details" inputId="immunoDetails">
			<TextAreaInput id="immunoDetails" label="Immunocompromise details" rows={2} bind:value={v.immunocompromisedDetails} />
		</Field>
	{/if}

	<Field label="Pregnant or planning pregnancy?" inputId="pregnant">
		<Select id="pregnant" label="Pregnant or planning pregnancy?" bind:value={v.pregnantOrPlanning}>
			<option value="">-- Select --</option>
			<option value="yes">Yes</option>
			<option value="no">No</option>
			<option value="not-applicable">Not applicable</option>
		</Select>
	</Field>
</Fieldset>
