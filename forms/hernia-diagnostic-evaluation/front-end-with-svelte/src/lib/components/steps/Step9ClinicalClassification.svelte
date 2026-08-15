<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import { OPTIONS } from '#lib/config/options.js';
	import { evaluationStore } from '#lib/stores/assessment.svelte.js';

	const d = evaluationStore.data;
</script>

<Fieldset legend="9. Clinical Classification">
	<p class="hint">Hernia type, EHS subtype, laterality, and EHS size grade.</p>

	<Field label="Hernia type" inputId="classification-herniaType" required>
		<Select id="classification-herniaType" label="Hernia type" bind:value={d.classification.herniaType} required>
			<option value="">— Select —</option>
			{#each OPTIONS.herniaType as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	{#if d.classification.herniaType === 'other'}
		<Field label="Hernia type, other" inputId="classification-herniaTypeOther">
			<TextInput id="classification-herniaTypeOther" label="Hernia type, other" bind:value={d.classification.herniaTypeOther} />
		</Field>
	{/if}
	{#if d.classification.herniaType === 'inguinal'}
		<Field label="Inguinal subtype (European Hernia Society)" inputId="classification-inguinalSubtype">
			<Select id="classification-inguinalSubtype" label="Inguinal subtype (European Hernia Society)" bind:value={d.classification.inguinalSubtype}>
				<option value="">— Select —</option>
				{#each OPTIONS.inguinalSubtype as option (option.value)}
					<option value={option.value}>{option.label}</option>
				{/each}
			</Select>
		</Field>
	{/if}
	<Field label="Laterality" inputId="classification-laterality">
		<Select id="classification-laterality" label="Laterality" bind:value={d.classification.laterality}>
			<option value="">— Select —</option>
			{#each OPTIONS.laterality as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="EHS size grade" inputId="classification-ehsSizeGrade" description="Grade 3 (> 4cm) contributes to the soon urgency band.">
		<Select id="classification-ehsSizeGrade" label="EHS size grade" bind:value={d.classification.ehsSizeGrade}>
			<option value="">— Select —</option>
			{#each OPTIONS.ehsSizeGrade as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Classification notes" inputId="classification-classificationNotes">
		<TextAreaInput id="classification-classificationNotes" label="Classification notes" rows={3} bind:value={d.classification.classificationNotes} />
	</Field>
</Fieldset>
