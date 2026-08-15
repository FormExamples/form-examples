<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const g = assessment.data.mobilityGait;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Mobility & Gait Assessment">
	<p class="hint">Functional mobility and signs of gait or balance impairment.</p>

	<Field label="Mobility level" inputId="mobilityLevel">
		<Select id="mobilityLevel" label="Mobility level" bind:value={g.mobilityLevel}>
			<option value="">— Select —</option>
			<option value="independent">Independent</option>
			<option value="supervision">Independent with supervision</option>
			<option value="assistance-1">Requires assistance of 1 person</option>
			<option value="assistance-2">Requires assistance of 2 people</option>
			<option value="wheelchair">Wheelchair-bound</option>
			<option value="bedbound">Bedbound</option>
		</Select>
	</Field>

	<Field label="Assistive device used" inputId="assistiveDeviceUsed">
		<Select id="assistiveDeviceUsed" label="Assistive device used" bind:value={g.assistiveDeviceUsed}>
			<option value="">— Select —</option>
			<option value="none">None</option>
			<option value="cane">Cane</option>
			<option value="crutches">Crutches</option>
			<option value="walker">Walker / rollator</option>
			<option value="wheelchair">Wheelchair</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	<Field label="Unsteady gait?">
		<RadioGroup label="Unsteady gait?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="unsteadyGait" value={opt.value} bind:group={g.unsteadyGait} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Difficulty rising from a chair without using arms?">
		<RadioGroup label="Difficulty rising from a chair without using arms?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="difficultyRisingFromChair" value={opt.value} bind:group={g.difficultyRisingFromChair} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Balance impairment on standing or turning?">
		<RadioGroup label="Balance impairment on standing or turning?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="balanceImpairment" value={opt.value} bind:group={g.balanceImpairment} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	<Field label="Lower-extremity weakness?">
		<RadioGroup label="Lower-extremity weakness?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="weaknessLowerExtremity" value={opt.value} bind:group={g.weaknessLowerExtremity} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Orthostatic hypotension on standing?">
		<RadioGroup label="Orthostatic hypotension on standing?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="orthostaticHypotension" value={opt.value} bind:group={g.orthostaticHypotension} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if g.orthostaticHypotension === 'yes'}
		<Field label="Severe orthostatic hypotension (symptomatic / drop ≥30 mmHg systolic)?">
			<RadioGroup label="Severe orthostatic hypotension?">
				{#each yesNo as opt (opt.value)}
					<label><input type="radio" class="radio-input" name="orthostaticHypotensionSevere" value={opt.value} bind:group={g.orthostaticHypotensionSevere} /> {opt.label}</label>
				{/each}
			</RadioGroup>
		</Field>
	{/if}

	<Field label="Timed Up and Go (TUG, seconds)" inputId="timedUpAndGoSeconds">
		<TextInput id="timedUpAndGoSeconds" label="Timed Up and Go" placeholder="e.g. 14" bind:value={g.timedUpAndGoSeconds} />
	</Field>

	<Field label="Mobility / gait notes" inputId="mobilityNotes">
		<TextAreaInput id="mobilityNotes" label="Mobility / gait notes" rows={3} placeholder="Any additional observations…" bind:value={g.mobilityNotes} />
	</Field>
</Fieldset>
