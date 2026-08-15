<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';

	const c = assessment.data.presentingComplaint;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Presenting Complaint">
	<p class="hint">Which symptom domains is the patient presenting with?</p>

	<Field label="Ear symptoms?">
		<RadioGroup label="Ear symptoms?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="earSymptoms" value={opt.value} bind:group={c.earSymptoms} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Nose symptoms?">
		<RadioGroup label="Nose symptoms?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="noseSymptoms" value={opt.value} bind:group={c.noseSymptoms} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Throat symptoms?">
		<RadioGroup label="Throat symptoms?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="throatSymptoms" value={opt.value} bind:group={c.throatSymptoms} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Neck symptoms?">
		<RadioGroup label="Neck symptoms?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="neckSymptoms" value={opt.value} bind:group={c.neckSymptoms} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Chief complaint" inputId="chiefComplaint">
		<TextAreaInput id="chiefComplaint" label="Chief complaint" rows={3} placeholder="In the patient's own words" bind:value={c.chiefComplaint} />
	</Field>
</Fieldset>
