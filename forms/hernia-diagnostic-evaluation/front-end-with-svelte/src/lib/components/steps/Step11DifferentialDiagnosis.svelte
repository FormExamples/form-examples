<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import { YES_NO } from '#lib/config/options.js';
	import { evaluationStore } from '#lib/stores/assessment.svelte.js';

	const d = evaluationStore.data;
</script>

<Fieldset legend="11. Differential Diagnosis Considered">
	<p class="hint">Other conditions ruled in or out of the groin or abdominal-wall mass.</p>

	<Field label="Lipoma" inputId="differential-differentialLipoma">
		<Select id="differential-differentialLipoma" label="Lipoma" bind:value={d.differential.differentialLipoma}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Lymphadenopathy" inputId="differential-differentialLymphadenopathy">
		<Select id="differential-differentialLymphadenopathy" label="Lymphadenopathy" bind:value={d.differential.differentialLymphadenopathy}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Hydrocele" inputId="differential-differentialHydrocele">
		<Select id="differential-differentialHydrocele" label="Hydrocele" bind:value={d.differential.differentialHydrocele}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Undescended testis" inputId="differential-differentialUndescendedTestis">
		<Select id="differential-differentialUndescendedTestis" label="Undescended testis" bind:value={d.differential.differentialUndescendedTestis}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Femoral aneurysm" inputId="differential-differentialFemoralAneurysm">
		<Select id="differential-differentialFemoralAneurysm" label="Femoral aneurysm" bind:value={d.differential.differentialFemoralAneurysm}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Abscess" inputId="differential-differentialAbscess">
		<Select id="differential-differentialAbscess" label="Abscess" bind:value={d.differential.differentialAbscess}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Other" inputId="differential-differentialOther">
		<TextInput id="differential-differentialOther" label="Other" bind:value={d.differential.differentialOther} />
	</Field>
	<Field label="Differential notes" inputId="differential-differentialNotes">
		<TextAreaInput id="differential-differentialNotes" label="Differential notes" rows={3} bind:value={d.differential.differentialNotes} />
	</Field>
</Fieldset>
