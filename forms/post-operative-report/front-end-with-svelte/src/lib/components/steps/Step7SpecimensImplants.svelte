<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import SpecimenEntry from '$lib/components/ui/SpecimenEntry.svelte';
	import ImplantEntry from '$lib/components/ui/ImplantEntry.svelte';

	const d = assessment.data.specimensImplants;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Specimens & Implants">
	<p class="hint">Tissue specimens, implants, drains and catheters.</p>

	<Field label="Specimens" description="Tissue or fluid sent for histology, microbiology, or other analysis.">
		<SpecimenEntry bind:specimens={d.specimens} />
	</Field>

	<Field label="Implants" description="Devices or prostheses placed during the procedure.">
		<ImplantEntry bind:implants={d.implants} />
	</Field>

	<Field label="Was a prosthesis used?">
		<RadioGroup label="Was a prosthesis used?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="prosthesisUsed" value={opt.value} bind:group={d.prosthesisUsed} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Drains placed" inputId="drainsPlaced">
		<TextAreaInput id="drainsPlaced" label="Drains placed" rows={2} placeholder="e.g. Robinson drain ×1 to right paracolic gutter" bind:value={d.drainsPlaced} />
	</Field>

	<Field label="Catheters placed" inputId="cathetersPlaced">
		<TextAreaInput id="cathetersPlaced" label="Catheters placed" rows={2} placeholder="e.g. 14F urinary catheter" bind:value={d.cathetersPlaced} />
	</Field>
</Fieldset>
