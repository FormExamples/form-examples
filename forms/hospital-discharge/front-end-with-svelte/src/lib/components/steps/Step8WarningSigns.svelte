<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import RedFlagEntry from '#lib/components/ui/RedFlagEntry.svelte';

	const d = assessment.data.warningSigns;

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Warning Signs &amp; When to Seek Help">
	<p class="hint">Safety-netting required by NICE NG27.</p>

	<h3 class="list-heading">Red-flag symptoms</h3>
	<RedFlagEntry bind:symptoms={d.redFlagSymptoms} />

	<Field label="When to seek help" required inputId="whenToSeekHelp">
		<TextAreaInput
			id="whenToSeekHelp"
			label="When to seek help"
			rows={4}
			bind:value={d.whenToSeekHelp}
			placeholder="Specific advice on which symptoms warrant urgent review…"
		/>
	</Field>

	<Field label="Emergency contact number" inputId="emergencyContactNumber">
		<TextInput
			id="emergencyContactNumber"
			label="Emergency contact number"
			type="tel"
			bind:value={d.emergencyContactNumber}
			placeholder="e.g. 999, 111, ward number"
		/>
	</Field>

	<Field label="Safety-netting advice provided?">
		<RadioGroup label="Safety-netting advice provided?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="safetyNetingProvided" value={opt.value} bind:group={d.safetyNetingProvided} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Written information given to patient?">
		<RadioGroup label="Written information given to patient?">
			{#each yesNo as opt (opt.value)}
				<label>
					<input type="radio" class="radio-input" name="writtenInfoGiven" value={opt.value} bind:group={d.writtenInfoGiven} />
					{opt.label}
				</label>
			{/each}
		</RadioGroup>
	</Field>
</Fieldset>

<style>
	.list-heading {
		margin: 0.5rem 0 0.25rem;
		font-size: 1rem;
		font-weight: 600;
	}
</style>
