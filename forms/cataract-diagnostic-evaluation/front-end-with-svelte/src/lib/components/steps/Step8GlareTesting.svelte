<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { OPTIONS } from '$lib/config/options';
	import { evaluationStore } from '$lib/stores/evaluation.svelte';

	const d = evaluationStore.data;
</script>

<Fieldset legend="8. Glare Testing">
	<p class="hint">A severe functional impact of glare independently raises the computed surgical candidacy to "indicated", even with a mild LOCS III grade, because glare disability is a recognised surgical indication not captured by static acuity.</p>

	<Field label="Glare acuity result — right" inputId="glare-glareAcuityResultRight">
		<TextInput id="glare-glareAcuityResultRight" label="Glare acuity result — right" bind:value={d.glare.glareAcuityResultRight} />
	</Field>
	<Field label="Glare acuity result — left" inputId="glare-glareAcuityResultLeft">
		<TextInput id="glare-glareAcuityResultLeft" label="Glare acuity result — left" bind:value={d.glare.glareAcuityResultLeft} />
	</Field>
	<Field label="Glare functional impact" inputId="glare-glareFunctionalImpact">
		<Select id="glare-glareFunctionalImpact" label="Glare functional impact" bind:value={d.glare.glareFunctionalImpact}>
			<option value="">— Select —</option>
			{#each OPTIONS.severity4 as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
</Fieldset>
