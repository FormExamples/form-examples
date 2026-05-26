<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';

	const m = assessment.data.mobilityFalls;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Mobility & Falls">
	<p class="hint">Gait, balance, fall history, and mobility assessment.</p>

	<Field label="Gait Assessment" required inputId="gaitAssessment">
		<Select id="gaitAssessment" label="Gait Assessment" required bind:value={m.gaitAssessment}>
			<option value="">-- Select --</option>
			<option value="normal">Normal gait</option>
			<option value="unsteady">Unsteady gait</option>
			<option value="unable">Unable to walk</option>
		</Select>
	</Field>

	<Field label="Balance Assessment" required inputId="balanceAssessment">
		<Select id="balanceAssessment" label="Balance Assessment" required bind:value={m.balanceAssessment}>
			<option value="">-- Select --</option>
			<option value="normal">Normal balance</option>
			<option value="impaired">Impaired balance</option>
			<option value="severely-impaired">Severely impaired balance</option>
		</Select>
	</Field>

	<Field label="Any falls in the past 12 months?">
		<RadioGroup label="Fall history">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="fallHistory" value={opt.value} bind:group={m.fallHistory} /> {opt.label}</label>{/each}</RadioGroup>
	</Field>
	{#if m.fallHistory === 'yes'}
		<Field label="Number of falls in the past year" required inputId="fallsLastYear"><NumberInput id="fallsLastYear" label="Falls in past year" min={0} max={100} required bind:value={m.fallsLastYear} /></Field>
	{/if}

	<Field label="Do you have a fear of falling?">
		<RadioGroup label="Fear of falling">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="fearOfFalling" value={opt.value} bind:group={m.fearOfFalling} /> {opt.label}</label>{/each}</RadioGroup>
	</Field>

	<Field label="Do you use any mobility aids?">
		<RadioGroup label="Mobility aids">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="mobilityAids" value={opt.value} bind:group={m.mobilityAids} /> {opt.label}</label>{/each}</RadioGroup>
	</Field>
	{#if m.mobilityAids === 'yes'}
		<Field label="Type of mobility aid" inputId="mobilityAidType"><TextInput id="mobilityAidType" label="Mobility aid type" placeholder="e.g., walking stick, frame, wheelchair" bind:value={m.mobilityAidType} /></Field>
	{/if}

	<Field label="Timed Up and Go (seconds)" inputId="timedUpAndGo"><NumberInput id="timedUpAndGo" label="Timed Up and Go" min={0} max={300} step={0.1} bind:value={m.timedUpAndGo} /></Field>
</Fieldset>
