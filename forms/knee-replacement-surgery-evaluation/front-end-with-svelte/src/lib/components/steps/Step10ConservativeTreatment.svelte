<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { OPTIONS, YES_NO } from '$lib/config/options';
	import { evaluationStore } from '$lib/stores/evaluation.svelte';

	const d = evaluationStore.data;
</script>

<Fieldset legend="10. Conservative Treatment Audit">
	<p class="hint">
		What has already been tried. Drives the computed surgical-candidacy recommendation: a
		recommendation for surgery without conservative measures exhausted raises a safety flag.
	</p>

	<Field label="Physiotherapy tried" inputId="conservative-physiotherapyTried">
		<Select id="conservative-physiotherapyTried" label="Physiotherapy tried" bind:value={d.conservative.physiotherapyTried}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Physiotherapy duration (weeks)" inputId="conservative-physiotherapyDurationWeeks">
		<NumberInput id="conservative-physiotherapyDurationWeeks" label="Physiotherapy duration (weeks)" min={0} max={520} bind:value={d.conservative.physiotherapyDurationWeeks} />
	</Field>
	<Field label="Weight-management advice given" inputId="conservative-weightManagementAdviceGiven">
		<Select id="conservative-weightManagementAdviceGiven" label="Weight-management advice given" bind:value={d.conservative.weightManagementAdviceGiven}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Injection given" inputId="conservative-injectionGiven">
		<Select id="conservative-injectionGiven" label="Injection given" bind:value={d.conservative.injectionGiven}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Injection type" inputId="conservative-injectionType">
		<Select id="conservative-injectionType" label="Injection type" bind:value={d.conservative.injectionType}>
			<option value="">— Select —</option>
			{#each OPTIONS.injectionType as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Injection count" inputId="conservative-injectionCount">
		<NumberInput id="conservative-injectionCount" label="Injection count" min={0} max={20} bind:value={d.conservative.injectionCount} />
	</Field>
	<Field label="Injection response" inputId="conservative-injectionResponse">
		<Select id="conservative-injectionResponse" label="Injection response" bind:value={d.conservative.injectionResponse}>
			<option value="">— Select —</option>
			{#each OPTIONS.goodPartialNone as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="NSAID / analgesic trial" inputId="conservative-nsaidAnalgesicTrial">
		<Select id="conservative-nsaidAnalgesicTrial" label="NSAID / analgesic trial" bind:value={d.conservative.nsaidAnalgesicTrial}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="NSAID / analgesic response" inputId="conservative-nsaidAnalgesicResponse">
		<Select id="conservative-nsaidAnalgesicResponse" label="NSAID / analgesic response" bind:value={d.conservative.nsaidAnalgesicResponse}>
			<option value="">— Select —</option>
			{#each OPTIONS.goodPartialNone as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Walking-aid trial" inputId="conservative-walkingAidTrial">
		<Select id="conservative-walkingAidTrial" label="Walking-aid trial" bind:value={d.conservative.walkingAidTrial}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Conservative measures exhausted" inputId="conservative-conservativeMeasuresExhausted" description="Drives the computed candidacy recommendation and the conservative-treatment-not-exhausted safety flag.">
		<Select id="conservative-conservativeMeasuresExhausted" label="Conservative measures exhausted" bind:value={d.conservative.conservativeMeasuresExhausted}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
</Fieldset>
