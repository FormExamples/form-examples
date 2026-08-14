<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import DateInput from '$lib/components/ui/DateInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { OPTIONS, YES_NO_OPTS } from '$lib/config/options';
	import { assessmentStore } from '$lib/stores/assessment.svelte';

	const d = assessmentStore.data;
</script>

<Fieldset legend="8. Smoking and Tobacco">
	<p class="hint">Domain 3. Four weeks of abstinence measurably reduces respiratory complications; stopping at any time still helps wound healing.</p>

	<Field label="Smoking status" inputId="smoking-smokingStatus">
		<Select id="smoking-smokingStatus" label="Smoking status" bind:value={d.smoking.smokingStatus}>
			<option value="">— Select —</option>
			{#each OPTIONS.smokingStatus as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Cigarettes per day" inputId="smoking-cigarettesPerDay">
		<NumberInput id="smoking-cigarettesPerDay" label="Cigarettes per day" min={0} max={200} bind:value={d.smoking.cigarettesPerDay} />
	</Field>
	<Field label="Pack-years" inputId="smoking-packYears">
		<NumberInput id="smoking-packYears" label="Pack-years" min={0} max={300} step="0.1" bind:value={d.smoking.packYears} />
	</Field>
	<Field label="Quit date" inputId="smoking-quitDate">
		<DateInput id="smoking-quitDate" label="Quit date" bind:value={d.smoking.quitDate} />
	</Field>
	<Field label="Cessation support offered" inputId="smoking-smokingCessationOffered">
		<Select id="smoking-smokingCessationOffered" label="Cessation support offered" bind:value={d.smoking.smokingCessationOffered}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Cessation support accepted" inputId="smoking-smokingCessationAccepted" description="Moves the domain to in-progress.">
		<Select id="smoking-smokingCessationAccepted" label="Cessation support accepted" bind:value={d.smoking.smokingCessationAccepted}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Nicotine replacement supplied" inputId="smoking-nicotineReplacement">
		<Select id="smoking-nicotineReplacement" label="Nicotine replacement supplied" bind:value={d.smoking.nicotineReplacement}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Vapes" inputId="smoking-vaping">
		<Select id="smoking-vaping" label="Vapes" bind:value={d.smoking.vaping}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Smoking notes" inputId="smoking-smokingNotes">
		<TextAreaInput id="smoking-smokingNotes" label="Smoking notes" rows={2} bind:value={d.smoking.smokingNotes} />
	</Field>
</Fieldset>
