<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { YES_NO } from '$lib/config/options';
	import { evaluationStore } from '$lib/stores/assessment.svelte';

	const d = evaluationStore.data;
</script>

<Fieldset legend="12. Functional Impact">
	<p class="hint">How the hernia affects work, activity, and daily function.</p>

	<Field label="Pain interferes with work or activity" inputId="functionalImpact-painInterferesWithWorkOrActivity">
		<Select id="functionalImpact-painInterferesWithWorkOrActivity" label="Pain interferes with work or activity" bind:value={d.functionalImpact.painInterferesWithWorkOrActivity}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Functional impact scale (0–10)" inputId="functionalImpact-functionalImpactScale0To10">
		<NumberInput id="functionalImpact-functionalImpactScale0To10" label="Functional impact scale (0–10)" min={0} max={10} bind:value={d.functionalImpact.functionalImpactScale0To10} />
	</Field>
	<Field label="Activity limitation" inputId="functionalImpact-activityLimitation">
		<TextAreaInput id="functionalImpact-activityLimitation" label="Activity limitation" rows={3} bind:value={d.functionalImpact.activityLimitation} />
	</Field>
</Fieldset>
