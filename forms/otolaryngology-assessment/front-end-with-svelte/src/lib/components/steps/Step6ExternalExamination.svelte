<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const e = assessment.data.externalExamination;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="External Examination">
	<p class="hint">Inspection of the external head, face, ears, and nose.</p>

	<Field label="Facial asymmetry?">
		<RadioGroup label="Facial asymmetry?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="facialAsymmetry" value={opt.value} bind:group={e.facialAsymmetry} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Facial swelling?">
		<RadioGroup label="Facial swelling?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="facialSwelling" value={opt.value} bind:group={e.facialSwelling} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Skin lesions?">
		<RadioGroup label="Skin lesions?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="skinLesions" value={opt.value} bind:group={e.skinLesions} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="External ear findings" inputId="externalEarFindings">
		<TextAreaInput id="externalEarFindings" label="External ear findings" rows={2} bind:value={e.externalEarFindings} />
	</Field>

	<Field label="External nose findings" inputId="externalNoseFindings">
		<TextAreaInput id="externalNoseFindings" label="External nose findings" rows={2} bind:value={e.externalNoseFindings} />
	</Field>

	<Field label="Examination notes" inputId="externalExaminationNotes">
		<TextAreaInput id="externalExaminationNotes" label="Examination notes" rows={2} bind:value={e.examinationNotes} />
	</Field>
</Fieldset>
