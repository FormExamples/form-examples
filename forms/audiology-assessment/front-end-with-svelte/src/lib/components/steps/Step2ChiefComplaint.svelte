<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';

	const c = assessment.data.chiefComplaint;

	const earOptions = [
		{ value: 'left', label: 'Left' },
		{ value: 'right', label: 'Right' },
		{ value: 'both', label: 'Both' }
	];

	const onsetOptions = [
		{ value: 'sudden', label: 'Sudden' },
		{ value: 'gradual', label: 'Gradual' }
	];
</script>

<Fieldset legend="Chief Complaint">
	<p class="hint">Primary hearing concern and symptoms.</p>

	<Field label="What is your primary hearing concern?" inputId="primaryConcern">
		<TextAreaInput id="primaryConcern" label="Primary hearing concern" rows={3} bind:value={c.primaryConcern} />
	</Field>

	<Field label="Which ear is affected?" required>
		<RadioGroup label="Affected ear">
			{#each earOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="affectedEar" value={opt.value} bind:group={c.affectedEar} required /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="How did the hearing difficulty start?" required>
		<RadioGroup label="Onset">
			{#each onsetOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="onset" value={opt.value} bind:group={c.onset} required /> {opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="How long have you had this hearing concern?" inputId="duration">
		<TextInput id="duration" label="Duration" bind:value={c.duration} />
	</Field>

	<Field label="Has the hearing difficulty changed over time?" inputId="progression">
		<Select id="progression" label="Progression" bind:value={c.progression}>
			<option value="">— Select —</option>
			<option value="stable">Stable — no change</option>
			<option value="worsening">Worsening</option>
			<option value="fluctuating">Fluctuating — comes and goes</option>
			<option value="improving">Improving</option>
		</Select>
	</Field>
</Fieldset>
