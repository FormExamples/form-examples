<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import { OPTIONS, YES_NO } from '#lib/config/options.js';
	import { evaluationStore } from '#lib/stores/assessment.svelte.js';

	const d = evaluationStore.data;
</script>

<Fieldset legend="5. Visual Inspection">
	<p class="hint">Location, appearance at rest and on straining, and skin changes.</p>

	<Field label="Location" inputId="inspection-inspectionLocation">
		<Select id="inspection-inspectionLocation" label="Location" bind:value={d.inspection.inspectionLocation}>
			<option value="">— Select —</option>
			{#each OPTIONS.inspectionLocation as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	{#if d.inspection.inspectionLocation === 'other'}
		<Field label="Location, other" inputId="inspection-inspectionLocationOther">
			<TextInput id="inspection-inspectionLocationOther" label="Location, other" bind:value={d.inspection.inspectionLocationOther} />
		</Field>
	{/if}
	<Field label="Bulge visible at rest" inputId="inspection-bulgeVisibleAtRest">
		<Select id="inspection-bulgeVisibleAtRest" label="Bulge visible at rest" bind:value={d.inspection.bulgeVisibleAtRest}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Bulge enlarges on standing or straining" inputId="inspection-bulgeEnlargesOnStandingOrStraining">
		<Select id="inspection-bulgeEnlargesOnStandingOrStraining" label="Bulge enlarges on standing or straining" bind:value={d.inspection.bulgeEnlargesOnStandingOrStraining}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Skin changes" inputId="inspection-skinChanges">
		<Select id="inspection-skinChanges" label="Skin changes" bind:value={d.inspection.skinChanges}>
			<option value="">— Select —</option>
			{#each OPTIONS.skinChanges as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Inspection notes" inputId="inspection-inspectionNotes">
		<TextAreaInput id="inspection-inspectionNotes" label="Inspection notes" rows={3} bind:value={d.inspection.inspectionNotes} />
	</Field>
</Fieldset>
