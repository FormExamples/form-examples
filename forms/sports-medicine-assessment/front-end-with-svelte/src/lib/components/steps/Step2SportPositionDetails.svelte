<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const s = assessment.data.sportPositionDetails;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Sport & Position Details">
	<p class="hint">The chosen sport, position, contact level, and training load.</p>

	<Field label="Primary sport" inputId="primarySport">
		<TextInput id="primarySport" label="Primary sport" placeholder="e.g. Football, Rugby, Swimming" bind:value={s.primarySport} />
	</Field>

	<Field label="Primary position" inputId="primaryPosition">
		<TextInput id="primaryPosition" label="Primary position" placeholder="e.g. Midfielder, Flanker" bind:value={s.primaryPosition} />
	</Field>

	<Field label="Contact level" inputId="contactLevel">
		<Select id="contactLevel" label="Contact level" bind:value={s.contactLevel}>
			<option value="">— Select —</option>
			<option value="low">Low (e.g. archery, golf, swimming)</option>
			<option value="moderate">Moderate (e.g. baseball, soccer, basketball)</option>
			<option value="high">High (e.g. football, rugby, ice hockey, MMA)</option>
		</Select>
	</Field>

	<Field label="Secondary sports" inputId="secondarySports">
		<TextInput id="secondarySports" label="Secondary sports" placeholder="Other sports played" bind:value={s.secondarySports} />
	</Field>

	<Field label="Competitive level" inputId="competitiveLevel">
		<Select id="competitiveLevel" label="Competitive level" bind:value={s.competitiveLevel}>
			<option value="">— Select —</option>
			<option value="recreational">Recreational</option>
			<option value="school">School / scholastic</option>
			<option value="club">Club / amateur</option>
			<option value="elite">Elite / professional</option>
		</Select>
	</Field>

	<Field label="Training hours per week" inputId="hoursPerWeek">
		<NumberInput id="hoursPerWeek" label="Training hours per week" min={0} max={60} bind:value={s.hoursPerWeek} />
	</Field>

	<Field label="Any previous clearance issue?">
		<RadioGroup label="Any previous clearance issue?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="previousClearanceIssue" value={opt.value} bind:group={s.previousClearanceIssue} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if s.previousClearanceIssue === 'yes'}
		<Field label="Previous clearance details" inputId="previousClearanceDetails">
			<TextAreaInput id="previousClearanceDetails" label="Previous clearance details" rows={2} bind:value={s.previousClearanceDetails} />
		</Field>
	{/if}
</Fieldset>
