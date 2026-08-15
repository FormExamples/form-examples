<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = resultStore.data;
</script>

<Fieldset legend="5. Polyps & Tissue">
	<p class="hint">Polyp count and size, tissue handling, and any complication.</p>

	<Field
		label="Polyp count"
		inputId="polypCount"
		description="Number of polyps detected, for surveillance interval determination."
	>
		<NumberInput
			id="polypCount"
			label="Polyp count"
			min={0}
			max={200}
			step={1}
			bind:value={d.polypCount}
		/>
	</Field>

	<Field
		label="Largest polyp (mm)"
		inputId="largestPolypMm"
		description="Largest polyp size, for surveillance and categorisation (BSG / ACPGBI / PHE)."
	>
		<NumberInput
			id="largestPolypMm"
			label="Largest polyp (mm)"
			min={0}
			max={200}
			step={0.1}
			bind:value={d.largestPolypMm}
		/>
	</Field>

	<Field label="Tissue handling">
		<CheckboxGroup label="Tissue handling">
			<label><CheckboxInput label="Biopsy taken" bind:checked={d.biopsyTaken} /> Biopsy taken</label>
			<label><CheckboxInput label="Polypectomy performed" bind:checked={d.polypectomyPerformed} /> Polypectomy performed</label>
		</CheckboxGroup>
	</Field>

	<Field label="Complication" inputId="complication">
		<Select id="complication" label="Complication" bind:value={d.complication}>
			<option value="">Select…</option>
			<option value="none">None</option>
			<option value="bleeding">Bleeding</option>
			<option value="perforation">Perforation</option>
			<option value="other">Other</option>
		</Select>
	</Field>

	{#if d.complication === 'perforation'}
		<Alert type="error" heading="Critical complication selected">
			<p>
				A perforation auto-escalates the follow-up urgency to a critical alert. Communicate the
				result to the referrer and arrange an urgent surgical review on sign-off.
			</p>
		</Alert>
	{/if}
</Fieldset>
