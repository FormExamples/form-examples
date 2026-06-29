<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import MedicationEntry from '$lib/components/ui/MedicationEntry.svelte';

	const cs = assessment.data.currentSupport;

	const therapyOptions = [
		{ value: 'speech-language', label: 'Speech & Language Therapy' },
		{ value: 'occupational', label: 'Occupational Therapy' },
		{ value: 'behavioral', label: 'Behavioral Therapy (ABA)' },
		{ value: 'cbt', label: 'Cognitive Behavioral Therapy' },
		{ value: 'social-skills', label: 'Social Skills Training' },
		{ value: 'sensory-integration', label: 'Sensory Integration Therapy' },
		{ value: 'psychotherapy', label: 'Psychotherapy / Counselling' },
		{ value: 'other', label: 'Other' }
	];

	function toggleTherapy(value: string) {
		if (cs.currentTherapies.includes(value)) {
			cs.currentTherapies = cs.currentTherapies.filter((v) => v !== value);
		} else {
			cs.currentTherapies = [...cs.currentTherapies, value];
		}
	}
</script>

<Fieldset legend="Current Support">
	<p class="hint">Current accommodations, therapies, and support services.</p>

	<Field label="Current accommodations" inputId="currentAccommodations">
		<TextAreaInput id="currentAccommodations" label="Current accommodations" rows={3} bind:value={cs.currentAccommodations} />
	</Field>

	<Field label="Current therapies">
		<CheckboxGroup label="Current therapies">
			{#each therapyOptions as opt (opt.value)}
				<label>
					<input
						type="checkbox"
						class="checkbox-input"
						checked={cs.currentTherapies.includes(opt.value)}
						onchange={() => toggleTherapy(opt.value)}
					/>
					{opt.label}
				</label>
			{/each}
		</CheckboxGroup>
	</Field>

	<Field label="Educational support" inputId="educationalSupport">
		<TextAreaInput id="educationalSupport" label="Educational support" rows={3} bind:value={cs.educationalSupport} />
	</Field>

	<Field label="Current Medications">
		<MedicationEntry bind:medications={cs.medications} />
	</Field>
</Fieldset>
