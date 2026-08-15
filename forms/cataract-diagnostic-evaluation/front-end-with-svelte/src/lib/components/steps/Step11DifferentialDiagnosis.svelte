<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import { YES_NO } from '#lib/config/options.js';
	import { evaluationStore } from '#lib/stores/evaluation.svelte.js';

	const d = evaluationStore.data;
</script>

<Fieldset legend="11. Differential / Competing-pathology Screen">
	<p class="hint">Any suspected competing posterior-segment pathology raises a high-priority safety flag, independent of the surgical-candidacy recommendation.</p>

	<Field label="Glaucoma suspected" inputId="differential-glaucomaSuspected">
		<Select id="differential-glaucomaSuspected" label="Glaucoma suspected" bind:value={d.differential.glaucomaSuspected}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Glaucoma notes" inputId="differential-glaucomaNotes">
		<TextAreaInput id="differential-glaucomaNotes" label="Glaucoma notes" rows={2} bind:value={d.differential.glaucomaNotes} />
	</Field>
	<Field label="AMD suspected" inputId="differential-amdSuspected">
		<Select id="differential-amdSuspected" label="AMD suspected" bind:value={d.differential.amdSuspected}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="AMD notes" inputId="differential-amdNotes">
		<TextAreaInput id="differential-amdNotes" label="AMD notes" rows={2} bind:value={d.differential.amdNotes} />
	</Field>
	<Field label="Diabetic retinopathy suspected" inputId="differential-diabeticRetinopathySuspected">
		<Select id="differential-diabeticRetinopathySuspected" label="Diabetic retinopathy suspected" bind:value={d.differential.diabeticRetinopathySuspected}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Diabetic retinopathy notes" inputId="differential-diabeticRetinopathyNotes">
		<TextAreaInput id="differential-diabeticRetinopathyNotes" label="Diabetic retinopathy notes" rows={2} bind:value={d.differential.diabeticRetinopathyNotes} />
	</Field>
</Fieldset>
