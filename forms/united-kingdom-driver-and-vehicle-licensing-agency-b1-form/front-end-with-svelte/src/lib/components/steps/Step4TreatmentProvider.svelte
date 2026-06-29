<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import RadioGroup from '$lib/components/ui/RadioGroup.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';

	const t = assessment.data.treatmentProvider;
</script>

<Fieldset legend="Question 2 — Treatment provider">
	<p class="hint">Tell us who you most recently saw for the treatment of this condition.</p>

	<Field label="Who did you last see for the treatment of this condition?" required>
		<RadioGroup label="Last seen">
			<label><input type="radio" class="radio-input" name="lastSeen" value="gp" bind:group={t.lastSeen} required /> GP</label>
			<label><input type="radio" class="radio-input" name="lastSeen" value="consultant" bind:group={t.lastSeen} required /> Consultant</label>
		</RadioGroup>
	</Field>

	<h3 class="step-subhead">a) Dates of consultations for this condition</h3>

	{#if t.lastSeen === 'gp'}
		<div class="field-grid">
			<Field label="GP — date of last contact" required inputId="gpLastContact">
				<DateInput id="gpLastContact" label="GP date of last contact" required bind:value={t.gpLastContactDate} />
			</Field>
			<Field label="GP — date of next contact" inputId="gpNextContact">
				<DateInput id="gpNextContact" label="GP date of next contact" bind:value={t.gpNextContactDate} />
			</Field>
		</div>
	{/if}

	{#if t.lastSeen === 'consultant'}
		<div class="field-grid">
			<Field label="Consultant — date of last contact" required inputId="consLastContact">
				<DateInput id="consLastContact" label="Consultant date of last contact" required bind:value={t.consultantLastContactDate} />
			</Field>
			<Field label="Consultant — date of next contact" inputId="consNextContact">
				<DateInput id="consNextContact" label="Consultant date of next contact" bind:value={t.consultantNextContactDate} />
			</Field>
		</div>
	{/if}
</Fieldset>

<style>
	.field-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
	.step-subhead { font-size: 1rem; font-weight: 600; margin: 1.25rem 0 0.5rem; }
	@media (max-width: 640px) { .field-grid { grid-template-columns: 1fr; } }
</style>
