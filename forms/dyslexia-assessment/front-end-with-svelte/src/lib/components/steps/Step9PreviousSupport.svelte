<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import RadioField from './RadioField.svelte';

	const d = assessment.data.previousSupport;

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const accessArrangements = [
		{ value: 'extra-time', label: 'Extra time' },
		{ value: 'reader', label: 'Reader' },
		{ value: 'scribe', label: 'Scribe' },
		{ value: 'word-processor', label: 'Word processor' },
		{ value: 'rest-breaks', label: 'Rest breaks' },
		{ value: 'separate-room', label: 'Separate room' },
		{ value: 'modified-paper', label: 'Modified paper / coloured overlay' }
	];
</script>

<Fieldset legend="Section 9 of 10 · Previous Support & Interventions">
	<p class="hint">Existing supports already in place.</p>

	<RadioField label="Has the pupil received previous targeted intervention?" name="previousIntervention" options={yesNo} bind:value={d.previousIntervention} />
	{#if d.previousIntervention === 'yes'}
		<Field label="Types of previous intervention" inputId="interventionTypes">
			<TextAreaInput id="interventionTypes" label="Types of previous intervention" rows={2} bind:value={d.interventionTypes} />
		</Field>
	{/if}

	<RadioField label="Does the pupil have a current EHCP or IEP?" name="currentEhcpOrIep" options={yesNo} bind:value={d.currentEhcpOrIep} />
	{#if d.currentEhcpOrIep === 'yes'}
		<Field label="EHCP / IEP details" inputId="ehcpDetails">
			<TextAreaInput id="ehcpDetails" label="EHCP / IEP details" rows={2} bind:value={d.ehcpDetails} />
		</Field>
	{/if}

	<RadioField label="Are exam access arrangements in place?" name="accessArrangements" options={yesNo} bind:value={d.accessArrangements} />
	{#if d.accessArrangements === 'yes'}
		<Field label="Which access arrangements?">
			<CheckboxGroup label="Which access arrangements?">
				{#each accessArrangements as opt (opt.value)}
					<label>
						<input type="checkbox" class="checkbox-input" value={opt.value} bind:group={d.accessArrangementsList} />
						{opt.label}
					</label>
				{/each}
			</CheckboxGroup>
		</Field>
	{/if}

	<RadioField label="Is tutorial / specialist teaching support in place?" name="tutorialSupport" options={yesNo} bind:value={d.tutorialSupport} />

	<RadioField label="Is assistive technology being used?" name="assistiveTechnologyUsed" options={yesNo} bind:value={d.assistiveTechnologyUsed} />
	{#if d.assistiveTechnologyUsed === 'yes'}
		<Field label="Assistive technology details" inputId="assistiveTechnologyDetails">
			<TextAreaInput id="assistiveTechnologyDetails" label="Assistive technology details" rows={2} bind:value={d.assistiveTechnologyDetails} />
		</Field>
	{/if}

	<Field label="Other previous support notes" inputId="previousSupportNotes">
		<TextAreaInput id="previousSupportNotes" label="Other previous support notes" rows={2} bind:value={d.previousSupportNotes} />
	</Field>
</Fieldset>
