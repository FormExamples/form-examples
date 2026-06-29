<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const o = assessment.data.otoscopy;
	const yesNo = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
	const sides = [
		{ key: 'right', label: 'Right ear' },
		{ key: 'left', label: 'Left ear' }
	] as const;
</script>

<Fieldset legend="Otoscopy">
	<p class="hint">Otoscopic examination of each ear canal and tympanic membrane.</p>

	{#each sides as side (side.key)}
		<div class="side-block">
			<h3 class="side-title">{side.label}</h3>

			<Field label="Tympanic membrane" inputId={`${side.key}-tm`}>
				<Select id={`${side.key}-tm`} label="Tympanic membrane" bind:value={o[side.key].tympanicMembrane}>
					<option value="">-- Select --</option>
					<option value="normal">Normal</option>
					<option value="erythematous">Erythematous</option>
					<option value="bulging">Bulging</option>
					<option value="retracted">Retracted</option>
					<option value="perforated">Perforated</option>
					<option value="effusion">Effusion</option>
				</Select>
			</Field>

			<Field label="Ear canal" inputId={`${side.key}-canal`}>
				<Select id={`${side.key}-canal`} label="Ear canal" bind:value={o[side.key].canal}>
					<option value="">-- Select --</option>
					<option value="normal">Normal</option>
					<option value="wax">Wax</option>
					<option value="discharge">Discharge</option>
					<option value="foreign-body">Foreign body</option>
					<option value="inflamed">Inflamed</option>
				</Select>
			</Field>

			<Field label="Tympanic membrane mobile?">
				<RadioGroup label="Tympanic membrane mobile?">
					{#each yesNo as opt (opt.value)}
						<label><input type="radio" class="radio-input" name={`${side.key}-mobility`} value={opt.value} bind:group={o[side.key].mobility} /> {opt.label}</label>
					{/each}
				</RadioGroup>
			</Field>
		</div>
	{/each}

	<Field label="Otoscopy notes" inputId="otoscopyNotes">
		<TextAreaInput id="otoscopyNotes" label="Otoscopy notes" rows={2} bind:value={o.otoscopyNotes} />
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
