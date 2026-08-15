<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';

	const h = assessment.data.hearingHistory;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];

	const onsetOptions = [
		{ value: 'sudden', label: 'Sudden' },
		{ value: 'gradual', label: 'Gradual' }
	];

	const earOptions = [
		{ value: 'left', label: 'Left' },
		{ value: 'right', label: 'Right' },
		{ value: 'both', label: 'Both' }
	];
</script>

<Fieldset legend="Hearing History">
	<p class="hint">Details about your hearing loss and related conditions.</p>

	<Field label="How did your hearing loss begin?" required>
		<RadioGroup label="Onset type">{#each onsetOptions as opt (opt.value)}<label><input type="radio" class="radio-input" name="onsetType" value={opt.value} bind:group={h.onsetType} required /> {opt.label}</label>{/each}</RadioGroup>
	</Field>

	<Field label="How long have you had hearing difficulties?" required inputId="duration">
		<TextInput id="duration" label="Duration" required placeholder="e.g., 2 years, 6 months, since childhood" bind:value={h.duration} />
	</Field>

	<Field label="Which ear is affected?" required>
		<RadioGroup label="Affected ear">{#each earOptions as opt (opt.value)}<label><input type="radio" class="radio-input" name="affectedEar" value={opt.value} bind:group={h.affectedEar} required /> {opt.label}</label>{/each}</RadioGroup>
	</Field>

	<Field label="Is there a family history of hearing loss?">
		<RadioGroup label="Family history">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="familyHistory" value={opt.value} bind:group={h.familyHistory} /> {opt.label}</label>{/each}</RadioGroup>
	</Field>
	<Field label="Have you had significant noise exposure (occupational or recreational)?">
		<RadioGroup label="Noise exposure">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="noiseExposure" value={opt.value} bind:group={h.noiseExposure} /> {opt.label}</label>{/each}</RadioGroup>
	</Field>
	<Field label="Do you experience tinnitus (ringing, buzzing, or other sounds in your ears)?">
		<RadioGroup label="Tinnitus">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="tinnitus" value={opt.value} bind:group={h.tinnitus} /> {opt.label}</label>{/each}</RadioGroup>
	</Field>
	<Field label="Do you experience vertigo or dizziness?">
		<RadioGroup label="Vertigo">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="vertigo" value={opt.value} bind:group={h.vertigo} /> {opt.label}</label>{/each}</RadioGroup>
	</Field>
	<Field label="Have you had any ear surgery?">
		<RadioGroup label="Ear surgery">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="earSurgery" value={opt.value} bind:group={h.earSurgery} /> {opt.label}</label>{/each}</RadioGroup>
	</Field>
	<Field label="Have you taken any ototoxic medications (e.g., aminoglycosides, cisplatin)?">
		<RadioGroup label="Ototoxic medications">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="ototoxicMedications" value={opt.value} bind:group={h.ototoxicMedications} /> {opt.label}</label>{/each}</RadioGroup>
	</Field>
</Fieldset>
