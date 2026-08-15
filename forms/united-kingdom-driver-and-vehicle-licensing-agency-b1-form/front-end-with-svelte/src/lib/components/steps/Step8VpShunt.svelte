<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import RadioGroup from '#lib/components/ui/RadioGroup.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';

	const v = assessment.data.vpShunt;
</script>

<Fieldset legend="Question 8 — VP shunt">
	<p class="hint">A ventriculoperitoneal (VP) shunt drains excess cerebrospinal fluid from the brain.</p>

	<Field label="Have you ever had an insertion or upper end revision of a VP shunt or external ventricular drain?" required>
		<RadioGroup label="VP shunt?">
			<label><input type="radio" class="radio-input" name="hadVpShunt" value="yes" bind:group={v.hadVpShuntOrDrain} required /> Yes</label>
			<label><input type="radio" class="radio-input" name="hadVpShunt" value="no" bind:group={v.hadVpShuntOrDrain} required /> No</label>
		</RadioGroup>
	</Field>

	{#if v.hadVpShuntOrDrain === 'yes'}
		<Field label="Date of procedure" required inputId="vpShuntDate">
			<DateInput id="vpShuntDate" label="Date" required bind:value={v.procedureDate} />
		</Field>
	{/if}
</Fieldset>
