<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';

	const b = assessment.data.blackouts;
</script>

<Fieldset legend="Question 3 — Blackouts">
	<p class="hint">A blackout is any episode of altered or lost consciousness.</p>

	<Field label="Have you ever had a blackout(s) or altered level of consciousness?" required>
		<RadioGroup label="Had blackouts?">
			<label><input type="radio" class="radio-input" name="hadBlackouts" value="yes" bind:group={b.hadBlackouts} required /> Yes</label>
			<label><input type="radio" class="radio-input" name="hadBlackouts" value="no" bind:group={b.hadBlackouts} required /> No</label>
		</RadioGroup>
	</Field>

	{#if b.hadBlackouts === 'yes'}
		<Field label="Date of blackout" required inputId="blackoutDate">
			<DateInput id="blackoutDate" label="Date of blackout" required bind:value={b.blackoutDate} />
		</Field>
	{/if}
</Fieldset>
