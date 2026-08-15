<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import Select from '#lib/components/ui/Select.svelte';

	const c = assessment.data.chiefComplaint;
	const yesNo = [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }];
	const eyeOptions = [{ value: 'left', label: 'Left' }, { value: 'right', label: 'Right' }, { value: 'both', label: 'Both' }];
	const onsetOptions = [{ value: 'sudden', label: 'Sudden' }, { value: 'gradual', label: 'Gradual' }];
</script>

<Fieldset legend="Chief Complaint">
	<p class="hint">Primary eye concern and symptom details.</p>

	<Field label="What is your primary eye concern?" required inputId="primaryConcern">
		<TextAreaInput id="primaryConcern" label="Primary concern" rows={3} required placeholder="Describe your main eye problem or reason for visit" bind:value={c.primaryConcern} />
	</Field>

	<Field label="Which eye is affected?" required>
		<RadioGroup label="Affected eye">
			{#each eyeOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="affectedEye" value={opt.value} bind:group={c.affectedEye} required />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<Field label="How did the symptoms start?">
		<RadioGroup label="Onset type">
			{#each onsetOptions as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="onsetType" value={opt.value} bind:group={c.onsetType} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>

	<div class="field-grid">
		<Field label="Duration" inputId="durationValue"><TextInput id="durationValue" label="Duration value" placeholder="e.g. 3" bind:value={c.durationValue} /></Field>
		<Field label="Duration unit" inputId="durationUnit">
			<Select id="durationUnit" label="Duration unit" bind:value={c.durationUnit}>
				<option value="">-- Select --</option>
				<option value="hours">Hours</option><option value="days">Days</option><option value="weeks">Weeks</option><option value="months">Months</option><option value="years">Years</option>
			</Select>
		</Field>
	</div>

	<Field label="Is there any eye pain?">
		<RadioGroup label="Pain present">
			{#each yesNo as opt (opt.value)}
				<label><input type="radio" class="radio-input" name="painPresent" value={opt.value} bind:group={c.painPresent} />{opt.label}</label>
			{/each}
		</RadioGroup>
	</Field>
	{#if c.painPresent === 'yes'}
		<Field label="Pain severity (1-10)" inputId="painSeverity">
			<Select id="painSeverity" label="Pain severity" bind:value={c.painSeverity}>
				<option value="">-- Select --</option>
				<option value="1">1 - Minimal</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5 - Moderate</option><option value="6">6</option><option value="7">7</option><option value="8">8</option><option value="9">9</option><option value="10">10 - Worst possible</option>
			</Select>
		</Field>
	{/if}
</Fieldset>

<style>
	.field-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
	@media (max-width: 640px) { .field-grid { grid-template-columns: 1fr; } }
</style>
