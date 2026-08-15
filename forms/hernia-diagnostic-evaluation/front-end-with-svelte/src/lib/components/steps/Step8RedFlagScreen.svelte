<script lang="ts">
	// Red-flag / emergency symptom screen — the sole gate that forces the
	// computed urgency band to `emergency`. Deliberately self-contained (it
	// duplicates the step-5 skin-changes question) so a clinician can complete
	// this screen without cross-referencing earlier steps. Styled as a warning
	// panel because a single positive answer here overrides every other
	// finding in the evaluation.
	import Alert from '$lib/components/ui/Alert.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { YES_NO } from '$lib/config/options';
	import { evaluationStore } from '$lib/stores/assessment.svelte';

	const d = evaluationStore.data;

	const anyRedFlag = $derived(
		[
			d.redFlags.redFlagSeverePain,
			d.redFlags.redFlagVomiting,
			d.redFlags.redFlagFever,
			d.redFlags.redFlagAbsoluteConstipation,
			d.redFlags.redFlagErythemaOrDiscolouration,
			d.redFlags.redFlagPreviouslyReducibleNowIrreducible,
			d.redFlags.redFlagTachycardia
		].includes('yes')
	);
</script>

<Fieldset legend="8. Red-flag / Emergency Symptom Screen" class="border-2 border-error">
	<Alert type="error" heading="A single positive answer forces emergency urgency">
		Any positive red flag overrides every other finding in this evaluation and cannot be diluted
		by an otherwise reassuring examination. A positive red flag requires same-day clinical
		escalation regardless of what this software displays.
	</Alert>

	{#if anyRedFlag}
		<Alert type="error" role="alert" class="mt-3" heading="Emergency: at least one red flag is positive">
			Escalate for emergency surgical assessment now.
		</Alert>
	{/if}

	<Field label="Severe pain out of proportion to examination" inputId="redFlags-redFlagSeverePain">
		<Select id="redFlags-redFlagSeverePain" label="Severe pain out of proportion to examination" bind:value={d.redFlags.redFlagSeverePain}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Vomiting" inputId="redFlags-redFlagVomiting">
		<Select id="redFlags-redFlagVomiting" label="Vomiting" bind:value={d.redFlags.redFlagVomiting}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Fever" inputId="redFlags-redFlagFever">
		<Select id="redFlags-redFlagFever" label="Fever" bind:value={d.redFlags.redFlagFever}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Absolute constipation with no passage of flatus" inputId="redFlags-redFlagAbsoluteConstipation">
		<Select id="redFlags-redFlagAbsoluteConstipation" label="Absolute constipation with no passage of flatus" bind:value={d.redFlags.redFlagAbsoluteConstipation}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Erythema or discolouration over the hernia" inputId="redFlags-redFlagErythemaOrDiscolouration">
		<Select id="redFlags-redFlagErythemaOrDiscolouration" label="Erythema or discolouration over the hernia" bind:value={d.redFlags.redFlagErythemaOrDiscolouration}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Previously reducible hernia now irreducible" inputId="redFlags-redFlagPreviouslyReducibleNowIrreducible">
		<Select id="redFlags-redFlagPreviouslyReducibleNowIrreducible" label="Previously reducible hernia now irreducible" bind:value={d.redFlags.redFlagPreviouslyReducibleNowIrreducible}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Tachycardia" inputId="redFlags-redFlagTachycardia">
		<Select id="redFlags-redFlagTachycardia" label="Tachycardia" bind:value={d.redFlags.redFlagTachycardia}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Red-flag notes" inputId="redFlags-redFlagNotes">
		<TextAreaInput id="redFlags-redFlagNotes" label="Red-flag notes" rows={3} bind:value={d.redFlags.redFlagNotes} />
	</Field>
</Fieldset>
