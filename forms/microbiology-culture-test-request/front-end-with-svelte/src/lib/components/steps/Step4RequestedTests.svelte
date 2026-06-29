<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import { request } from '$lib/stores/request.svelte';

	const d = request.data.tests;
</script>

<Fieldset legend="4. Requested Tests">
	<p class="hint">Select at least one microbiology test. Culture &amp; sensitivity (MC&amp;S) is the most common.</p>

	<Field label="Requested tests">
		<CheckboxGroup label="Requested tests">
			<label><CheckboxInput label="Culture & sensitivity (MC&S)" bind:checked={d.cultureAndSensitivity} /> Culture &amp; sensitivity (MC&amp;S)</label>
			<label><CheckboxInput label="Gram stain / microscopy" bind:checked={d.gramStain} /> Gram stain / microscopy</label>
			<label><CheckboxInput label="Acid-fast bacilli (AFB / TB)" bind:checked={d.acidFastBacilliTb} /> Acid-fast bacilli (AFB / TB)</label>
			<label><CheckboxInput label="Fungal culture" bind:checked={d.fungalCulture} /> Fungal culture</label>
			<label><CheckboxInput label="PCR / molecular" bind:checked={d.pcrMolecular} /> PCR / molecular</label>
			<label><CheckboxInput label="C. difficile toxin" bind:checked={d.cDifficileToxin} /> C. difficile toxin</label>
			<label><CheckboxInput label="MRSA screen" bind:checked={d.mrsaScreen} /> MRSA screen</label>
		</CheckboxGroup>
	</Field>
</Fieldset>
