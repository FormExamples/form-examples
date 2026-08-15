<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const f = assessment.data.functionalCommunication;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Functional & Communication">
	<p class="hint">Daily life impact, hearing aid candidacy, and assistive devices.</p>

	<Field label="Do you have communication difficulties?">
		<RadioGroup label="Communication difficulties">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="commDifficulties" value={opt.value} bind:group={f.communicationDifficulties} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if f.communicationDifficulties === 'yes'}
		<Field label="Please describe your communication difficulties" inputId="commDetails">
			<TextAreaInput id="commDetails" label="Communication details" rows={3} bind:value={f.communicationDetails} />
		</Field>
	{/if}

	<Field label="Are you a candidate for hearing aids?">
		<RadioGroup label="Hearing aid candidacy">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="hearingAidCandidacy" value={opt.value} bind:group={f.hearingAidCandidacy} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Do you need assistive listening devices?">
		<RadioGroup label="Assistive device needs">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="assistiveNeeds" value={opt.value} bind:group={f.assistiveDeviceNeeds} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if f.assistiveDeviceNeeds === 'yes'}
		<Field label="What assistive devices are needed?" inputId="assistiveDetails">
			<TextInput id="assistiveDetails" label="Assistive device details" bind:value={f.assistiveDeviceDetails} />
		</Field>
	{/if}

	<Field label="Impact on work" inputId="workImpact">
		<Select id="workImpact" label="Work impact" bind:value={f.workImpact}>
			<option value="">— Select —</option>
			<option value="mild">Mild</option>
			<option value="moderate">Moderate</option>
			<option value="severe">Severe</option>
		</Select>
	</Field>

	<Field label="Impact on social life" inputId="socialImpact">
		<Select id="socialImpact" label="Social impact" bind:value={f.socialImpact}>
			<option value="">— Select —</option>
			<option value="mild">Mild</option>
			<option value="moderate">Moderate</option>
			<option value="severe">Severe</option>
		</Select>
	</Field>

	<Field label="Hearing Handicap Inventory for the Elderly (HHIE) Score" inputId="hhieScore" description="0–100">
		<NumberInput id="hhieScore" label="HHIE Score" min={0} max={100} bind:value={f.hhieScore} />
	</Field>
</Fieldset>
