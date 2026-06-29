<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const e = assessment.data.earExamination;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Ear Examination">
	<p class="hint">Clinical findings from otoscopic examination.</p>

	<h3 class="subhead">Left Ear</h3>
	<Field label="External ear appearance" inputId="leftExternalEar"><TextInput id="leftExternalEar" label="External ear" placeholder="e.g., Normal, inflammation, discharge..." bind:value={e.leftExternalEar} /></Field>
	<Field label="Tympanic membrane" inputId="leftTympanicMembrane"><TextInput id="leftTympanicMembrane" label="Tympanic membrane" placeholder="e.g., Normal, perforation, retraction..." bind:value={e.leftTympanicMembrane} /></Field>
	<Field label="Cerumen (earwax) present in left ear?">
		<RadioGroup label="Cerumen left">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="cerumenLeft" value={opt.value} bind:group={e.cerumenLeft} /> {opt.label}</label>{/each}</RadioGroup>
	</Field>

	<h3 class="subhead">Right Ear</h3>
	<Field label="External ear appearance" inputId="rightExternalEar"><TextInput id="rightExternalEar" label="External ear" placeholder="e.g., Normal, inflammation, discharge..." bind:value={e.rightExternalEar} /></Field>
	<Field label="Tympanic membrane" inputId="rightTympanicMembrane"><TextInput id="rightTympanicMembrane" label="Tympanic membrane" placeholder="e.g., Normal, perforation, retraction..." bind:value={e.rightTympanicMembrane} /></Field>
	<Field label="Cerumen (earwax) present in right ear?">
		<RadioGroup label="Cerumen right">{#each yesNo as opt (opt.value)}<label><input type="radio" class="radio-input" name="cerumenRight" value={opt.value} bind:group={e.cerumenRight} /> {opt.label}</label>{/each}</RadioGroup>
	</Field>

	<Field label="Any other abnormalities noted" inputId="abnormalities">
		<TextAreaInput id="abnormalities" label="Other abnormalities" rows={3} placeholder="Describe any other findings..." bind:value={e.abnormalities} />
	</Field>
</Fieldset>

<style>
	.subhead { font-size: 0.875rem; font-weight: 600; color: var(--color-text); margin: 1rem 0 0.5rem; }
</style>
