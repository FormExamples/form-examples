<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const r = assessment.data.anteriorRhinoscopy;
	const sides = [
		{ key: 'right', label: 'Right nasal cavity' },
		{ key: 'left', label: 'Left nasal cavity' }
	] as const;
</script>

<Fieldset legend="Anterior Rhinoscopy">
	<p class="hint">Anterior rhinoscopic examination of each nasal cavity.</p>

	{#each sides as side (side.key)}
		<div class="side-block">
			<h3 class="side-title">{side.label}</h3>

			<Field label="Septum" inputId={`${side.key}-septum`}>
				<Select id={`${side.key}-septum`} label="Septum" bind:value={r[side.key].septum}>
					<option value="">-- Select --</option>
					<option value="midline">Midline</option>
					<option value="deviated-left">Deviated left</option>
					<option value="deviated-right">Deviated right</option>
				</Select>
			</Field>

			<Field label="Mucosa" inputId={`${side.key}-mucosa`}>
				<Select id={`${side.key}-mucosa`} label="Mucosa" bind:value={r[side.key].mucosa}>
					<option value="">-- Select --</option>
					<option value="normal">Normal</option>
					<option value="pale">Pale</option>
					<option value="congested">Congested</option>
					<option value="pale-boggy">Pale and boggy</option>
				</Select>
			</Field>

			<Field label="Polyps" inputId={`${side.key}-polyps`}>
				<Select id={`${side.key}-polyps`} label="Polyps" bind:value={r[side.key].polyps}>
					<option value="">-- Select --</option>
					<option value="none">None</option>
					<option value="small">Small</option>
					<option value="medium">Medium</option>
					<option value="large">Large</option>
				</Select>
			</Field>

			<Field label="Discharge" inputId={`${side.key}-discharge`}>
				<Select id={`${side.key}-discharge`} label="Discharge" bind:value={r[side.key].discharge}>
					<option value="">-- Select --</option>
					<option value="none">None</option>
					<option value="clear">Clear</option>
					<option value="mucoid">Mucoid</option>
					<option value="purulent">Purulent</option>
					<option value="blood">Blood-stained</option>
				</Select>
			</Field>

			<Field label="Turbinate hypertrophy" inputId={`${side.key}-turbinate`}>
				<Select id={`${side.key}-turbinate`} label="Turbinate hypertrophy" bind:value={r[side.key].turbinateHypertrophy}>
					<option value="">-- Select --</option>
					<option value="normal">Normal</option>
					<option value="mild">Mild</option>
					<option value="moderate">Moderate</option>
					<option value="severe">Severe</option>
				</Select>
			</Field>
		</div>
	{/each}

	<Field label="Rhinoscopy notes" inputId="rhinoscopyNotes">
		<TextAreaInput id="rhinoscopyNotes" label="Rhinoscopy notes" rows={2} bind:value={r.rhinoscopyNotes} />
	</Field>
</Fieldset>

<style>
	.side-block {
		border: 1px solid var(--color-base-300, currentColor);
		border-radius: 0.5rem;
		padding: 1rem;
		margin-bottom: 1rem;
	}
	.side-title {
		margin: 0 0 0.5rem;
		font-weight: 600;
	}
</style>
