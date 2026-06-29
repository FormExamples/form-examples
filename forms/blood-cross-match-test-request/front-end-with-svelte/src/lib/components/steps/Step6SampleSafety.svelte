<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';

	const d = assessment.data.sample;

	const sampleCollectedOptions = [
		{ value: 'yes', label: 'Yes' },
		{ value: 'no', label: 'No' }
	];
</script>

<Fieldset legend="Step 6 of 7 · Sample & identity safety">
	<p class="hint">Pre-transfusion sample collection and the BSH / SHOT two-sample (group-check) rule.</p>

	<div class="field-grid">
		<Field label="Sample collected" inputId="sample-sampleCollected">
			<Select id="sample-sampleCollected" label="Sample collected" bind:value={d.sampleCollected}>
				<option value="">— Select —</option>
				{#each sampleCollectedOptions as opt (opt.value)}
					<option value={opt.value}>{opt.label}</option>
				{/each}
			</Select>
		</Field>
		<Field label="Collection date & time" inputId="sample-collectionDatetime">
			<TextInput
				id="sample-collectionDatetime"
				label="Collection date and time"
				type="datetime-local"
				bind:value={d.collectionDatetime}
			/>
		</Field>
	</div>

	<h3 class="subhead">Identity checks</h3>
	<label class="bool-field">
		<CheckboxInput id="sample-twoSampleRuleMet" label="Two-sample (group-check) rule met" bind:checked={d.twoSampleRuleMet} />
		<span>Two-sample (group-check) rule met</span>
	</label>
	<label class="bool-field">
		<CheckboxInput id="sample-labellingCheckComplete" label="Sample labelling check complete" bind:checked={d.labellingCheckComplete} />
		<span>Sample labelling check complete</span>
	</label>
</Fieldset>

<style>
	.field-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
	}
	@media (max-width: 640px) {
		.field-grid {
			grid-template-columns: 1fr;
		}
	}
	.subhead {
		margin: 1rem 0 0.25rem;
		font-weight: 600;
	}
	.bool-field {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
</style>
