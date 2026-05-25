<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';

	const r = assessment.data.radiographicFindings;
</script>

<Fieldset legend="Radiographic Findings">
	<p class="hint">X-ray and imaging results.</p>

	<Field label="Panoramic (OPG) findings" inputId="panoramicFindings">
		<TextAreaInput id="panoramicFindings" label="Panoramic findings" rows={3} bind:value={r.panoramicFindings} />
	</Field>

	<Field label="Periapical radiograph findings" inputId="periapicalFindings">
		<TextAreaInput id="periapicalFindings" label="Periapical findings" rows={3} bind:value={r.periapicalFindings} />
	</Field>

	<Field label="Bitewing radiograph findings" inputId="bitewingFindings">
		<TextAreaInput id="bitewingFindings" label="Bitewing findings" rows={3} bind:value={r.bitewingFindings} />
	</Field>

	<Field label="Bone loss pattern" inputId="boneLossPattern">
		<Select id="boneLossPattern" label="Bone loss pattern" bind:value={r.boneLossPattern}>
			<option value="">— Select —</option>
			<option value="none">No bone loss</option>
			<option value="horizontal">Horizontal bone loss</option>
			<option value="vertical">Vertical (angular) bone loss</option>
			<option value="combined">Combined pattern</option>
		</Select>
	</Field>

	{#if r.boneLossPattern !== 'none' && r.boneLossPattern !== ''}
		<Field label="Bone loss details" inputId="boneLossDetails">
			<TextInput id="boneLossDetails" label="Bone loss details" bind:value={r.boneLossDetails} />
		</Field>
	{/if}
</Fieldset>
