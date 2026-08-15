<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const a = assessment.data.absence;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Absence history">
	<p class="hint">When the absence began and how long it has lasted.</p>

	<Field label="First day of absence" inputId="firstDayOfAbsence">
		<DateInput id="firstDayOfAbsence" label="First day of absence" bind:value={a.firstDayOfAbsence} />
	</Field>

	<Field label="Total calendar days absent" inputId="totalDaysAbsent">
		<NumberInput id="totalDaysAbsent" label="Total calendar days absent" min={0} bind:value={a.totalDaysAbsent} />
	</Field>

	<Field label="Prior Med 3 reference (if a continuation)" inputId="priorMed3Ref">
		<TextInput id="priorMed3Ref" label="Prior Med 3 reference" bind:value={a.priorMed3Ref} />
	</Field>

	<Field label="Was there previous self-certification (SC2) on record?">
		<RadioGroup label="Was there previous self-certification (SC2) on record?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="previousSelfCertification" value={opt.value} bind:group={a.previousSelfCertification} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>
