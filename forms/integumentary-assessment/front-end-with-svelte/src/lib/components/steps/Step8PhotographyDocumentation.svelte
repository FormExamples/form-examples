<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import PhotoEntry from '#lib/components/ui/PhotoEntry.svelte';

	const d = assessment.data.photographyDocumentation;

	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Photography & Documentation">
	<p class="hint">Photographic documentation of skin findings (with consent).</p>

	<Field label="Has the patient given consent for clinical photography?">
		<RadioGroup label="Consent for clinical photography?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="consentObtained" value={opt.value} bind:group={d.consentObtained} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="Were photographs taken at this assessment?">
		<RadioGroup label="Photographs taken?">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="photosTaken" value={opt.value} bind:group={d.photosTaken} /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	{#if d.photosTaken === 'yes'}
		<Field label="Photograph references" description="Document the site, date, and a reference number / filename for each image stored in the patient record.">
			<PhotoEntry bind:photos={d.photos} />
		</Field>
	{/if}

	<Field label="Documentation notes" inputId="documentationNotes">
		<TextAreaInput id="documentationNotes" label="Documentation notes" rows={3} placeholder="Where images are stored, body-map references, etc." bind:value={d.documentationNotes} />
	</Field>
</Fieldset>
