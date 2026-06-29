<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import { request } from '$lib/stores/request.svelte';

	const d = request.data.symptoms;
</script>

<Fieldset legend="5. Symptoms and Red Flags">
	<p class="hint">
		Presenting symptoms and red flags. A sudden onset, unilateral symptoms, or ear discharge
		auto-escalates the triage tier.
	</p>

	<Field label="Symptoms present">
		<CheckboxGroup label="Symptoms present">
			<label><CheckboxInput label="Hearing loss" bind:checked={d.hearingLoss} /> Hearing loss</label>
			<label><CheckboxInput label="Tinnitus" bind:checked={d.tinnitus} /> Tinnitus</label>
			<label><CheckboxInput label="Vertigo" bind:checked={d.vertigo} /> Vertigo</label>
			<label><CheckboxInput label="Otalgia (ear pain)" bind:checked={d.otalgia} /> Otalgia (ear pain)</label>
			<label><CheckboxInput label="Ear discharge" bind:checked={d.earDischarge} /> Ear discharge (otorrhoea)</label>
			<label><CheckboxInput label="Ototoxic medication" bind:checked={d.ototoxicMedication} /> On ototoxic medication</label>
		</CheckboxGroup>
	</Field>

	<Field label="Sudden onset of hearing loss">
		<CheckboxGroup label="Sudden onset of hearing loss">
			<label>
				<CheckboxInput label="Sudden onset reported" bind:checked={d.suddenOnset} />
				Sudden onset of hearing loss reported
			</label>
		</CheckboxGroup>
	</Field>

	{#if d.suddenOnset}
		<Field
			label="Onset timing"
			inputId="onsetWithinDays"
			description="Sudden SNHL within 30 days is an otological emergency (ENT-UK / BAO-HNS)."
		>
			<Select id="onsetWithinDays" label="Onset timing" bind:value={d.onsetWithinDays}>
				<option value="">Select…</option>
				<option value="within-30-days">Within the past 30 days</option>
				<option value="more-than-30-days">More than 30 days ago</option>
			</Select>
		</Field>
	{/if}
</Fieldset>
