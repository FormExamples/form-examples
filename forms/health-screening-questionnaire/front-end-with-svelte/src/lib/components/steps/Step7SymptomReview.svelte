<script lang="ts">
	import Alert from '#lib/components/ui/Alert.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import { YES_NO } from '#lib/config/options.js';
	import { questionnaireStore } from '#lib/stores/questionnaire.svelte.js';

	const d = questionnaireStore.data;

	const urgent = $derived(
		d.symptoms.symptomUnexplainedChestPain === 'yes' || d.symptoms.symptomDizzySpellsOrFainting === 'yes'
	);
</script>

<Fieldset legend="7. Symptom Review">
	<p class="hint">
		Unexplained chest pain or fainting alone triggers same-day referral, independent of every other
		answer on this form.
	</p>

	{#if urgent}
		<Alert type="warning" class="mt-2 mb-4">
			This combination needs same-day medical attention, not a routine screening pathway.
		</Alert>
	{/if}

	<Field label="Unexplained chest pain" inputId="symptoms-symptomUnexplainedChestPain">
		<Select id="symptoms-symptomUnexplainedChestPain" label="Unexplained chest pain" bind:value={d.symptoms.symptomUnexplainedChestPain}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Dizzy spells or fainting" inputId="symptoms-symptomDizzySpellsOrFainting">
		<Select id="symptoms-symptomDizzySpellsOrFainting" label="Dizzy spells or fainting" bind:value={d.symptoms.symptomDizzySpellsOrFainting}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Persistent cough (more than 3 weeks)" inputId="symptoms-symptomPersistentCoughOver3Weeks">
		<Select id="symptoms-symptomPersistentCoughOver3Weeks" label="Persistent cough (more than 3 weeks)" bind:value={d.symptoms.symptomPersistentCoughOver3Weeks}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Unexplained weight loss" inputId="symptoms-symptomUnexplainedWeightLoss"
		description="Fires a safety flag independently, regardless of other findings.">
		<Select id="symptoms-symptomUnexplainedWeightLoss" label="Unexplained weight loss" bind:value={d.symptoms.symptomUnexplainedWeightLoss}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Joint pain restricting movement" inputId="symptoms-symptomJointPainRestrictingMovement">
		<Select id="symptoms-symptomJointPainRestrictingMovement" label="Joint pain restricting movement" bind:value={d.symptoms.symptomJointPainRestrictingMovement}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Shortness of breath on exertion" inputId="symptoms-symptomShortnessOfBreathOnExertion">
		<Select id="symptoms-symptomShortnessOfBreathOnExertion" label="Shortness of breath on exertion" bind:value={d.symptoms.symptomShortnessOfBreathOnExertion}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Palpitations" inputId="symptoms-symptomPalpitations">
		<Select id="symptoms-symptomPalpitations" label="Palpitations" bind:value={d.symptoms.symptomPalpitations}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
</Fieldset>
