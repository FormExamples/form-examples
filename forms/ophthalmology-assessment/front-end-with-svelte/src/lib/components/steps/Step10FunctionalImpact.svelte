<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const f = assessment.data.functionalImpact;
	const yesNo = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];
</script>

<Fieldset legend="Functional Impact">
	<p class="hint">How your vision affects daily activities.</p>

	<Field label="Driving status" inputId="drivingStatus">
		<Select id="drivingStatus" label="Driving status" bind:value={f.drivingStatus}>
			<option value="">-- Select --</option>
			<option value="current-driver">Current driver</option>
			<option value="ceased-driving">Ceased driving (vision-related)</option>
			<option value="never-driven">Never driven</option>
		</Select>
	</Field>
	{#if f.drivingStatus === 'ceased-driving'}
		<Field label="Driving concerns" inputId="drivingConcerns">
			<TextAreaInput id="drivingConcerns" label="Driving concerns" rows={2} bind:value={f.drivingConcerns} />
		</Field>
	{/if}

	<Field label="Reading ability" inputId="readingAbility">
		<Select id="readingAbility" label="Reading ability" bind:value={f.readingAbility}>
			<option value="">-- Select --</option>
			<option value="no-difficulty">No difficulty</option>
			<option value="mild-difficulty">Mild difficulty</option>
			<option value="moderate-difficulty">Moderate difficulty</option>
			<option value="severe-difficulty">Severe difficulty</option>
			<option value="unable">Unable to read</option>
		</Select>
	</Field>

	<Field label="Any limitations in activities of daily living (ADL) due to vision?">
		<RadioGroup label="ADL limitations">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="adl" value={opt.value} bind:group={f.adlLimitations} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if f.adlLimitations === 'yes'}
		<Field label="Please describe limitations" inputId="adlDetails">
			<TextAreaInput id="adlDetails" label="ADL details" rows={2} bind:value={f.adlLimitationDetails} />
		</Field>
	{/if}

	<Field label="Have you had falls or near-falls related to your vision?">
		<RadioGroup label="Falls risk">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="falls" value={opt.value} bind:group={f.fallsRisk} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if f.fallsRisk === 'yes'}
		<Field label="Falls details" inputId="fallsDetails">
			<TextAreaInput id="fallsDetails" label="Falls details" rows={2} bind:value={f.fallsDetails} />
		</Field>
	{/if}

	<Field label="Do you need additional support services for your vision?">
		<RadioGroup label="Support needs">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="support" value={opt.value} bind:group={f.supportNeeds} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if f.supportNeeds === 'yes'}
		<Field label="Support needs details" inputId="supportDetails">
			<TextAreaInput id="supportDetails" label="Support details" rows={2} bind:value={f.supportDetails} />
		</Field>
	{/if}
</Fieldset>
