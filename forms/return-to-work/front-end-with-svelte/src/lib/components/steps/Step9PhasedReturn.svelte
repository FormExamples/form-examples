<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';

	const pr = assessment.data.phasedReturn;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Phased return plan">
	<p class="hint">A graded return ramps hours back up to the contracted level.</p>

	<Field label="Is a phased return applicable?">
		<RadioGroup label="Is a phased return applicable?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="phasedApplicable" value={opt.value} bind:group={pr.applicable} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if pr.applicable === 'yes'}
		<Field label="Starting hours per week" inputId="startHoursPerWeek">
			<NumberInput id="startHoursPerWeek" label="Starting hours per week" min={0} max={168} step="0.5" bind:value={pr.startHoursPerWeek} />
		</Field>

		<Field label="Target full-hours date" inputId="targetFullHoursDate">
			<DateInput id="targetFullHoursDate" label="Target full-hours date" bind:value={pr.targetFullHoursDate} />
		</Field>

		<Field label="Days per week" inputId="daysPerWeek">
			<NumberInput id="daysPerWeek" label="Days per week" min={0} max={7} bind:value={pr.daysPerWeek} />
		</Field>

		<Field label="Support contact at workplace" inputId="supportContact">
			<TextInput id="supportContact" label="Support contact at workplace" bind:value={pr.supportContact} />
		</Field>
	{/if}
</Fieldset>
