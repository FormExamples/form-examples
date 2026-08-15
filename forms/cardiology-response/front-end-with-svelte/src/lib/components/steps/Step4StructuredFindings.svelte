<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import CheckboxGroup from '#lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '#lib/components/ui/CheckboxInput.svelte';
	import Alert from '#lib/components/ui/Alert.svelte';
	import { resultStore } from '#lib/stores/result.svelte.js';

	const d = resultStore.data;
</script>

<Fieldset legend="4. Structured Findings">
	<p class="hint">Structured cardiac findings that drive classification, severity, and flags.</p>

	<Field label="Structured findings">
		<CheckboxGroup label="Structured findings">
			<label><CheckboxInput label="Ischaemia or coronary artery disease" bind:checked={d.ischaemiaOrCad} /> Ischaemia or coronary artery disease</label>
			<label><CheckboxInput label="Significant arrhythmia" bind:checked={d.significantArrhythmia} /> Significant arrhythmia</label>
			<label><CheckboxInput label="Reduced ejection fraction" bind:checked={d.reducedEjectionFraction} /> Reduced ejection fraction</label>
			<label><CheckboxInput label="Significant valve disease" bind:checked={d.significantValveDisease} /> Significant valve disease</label>
			<label><CheckboxInput label="Structural abnormality" bind:checked={d.structuralAbnormality} /> Structural abnormality</label>
			<label><CheckboxInput label="Uncontrolled hypertension" bind:checked={d.uncontrolledHypertension} /> Uncontrolled hypertension</label>
			<label><CheckboxInput label="Non-cardiac cause" bind:checked={d.nonCardiacCause} /> Non-cardiac cause</label>
		</CheckboxGroup>
	</Field>

	{#if d.significantValveDisease || d.reducedEjectionFraction || d.significantArrhythmia}
		<Alert type="warning" heading="Major finding selected">
			<p>
				Significant valve disease, a reduced ejection fraction, or a significant arrhythmia grades
				the condition severity as major and recommends urgent cardiology follow-up. Set the critical
				result flag on sign-off if the result is critical.
			</p>
		</Alert>
	{/if}
</Fieldset>
