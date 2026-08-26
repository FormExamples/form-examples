<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import DateInput from '#lib/components/ui/DateInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import { OPTIONS, YES_NO_OPTS } from '#lib/config/options.js';
	import { assessmentStore } from '#lib/stores/assessment.svelte.js';

	const d = assessmentStore.data;
</script>

<Fieldset legend="11. Functional Capacity and Physical Fitness">
	<p class="hint">Domain 6. Prehabilitation needs at least four weeks to show benefit; six or more is preferred.</p>

	<Field label="Usual activity level" inputId="fitness-usualActivityLevel">
		<Select id="fitness-usualActivityLevel" label="Usual activity level" bind:value={d.fitness.usualActivityLevel}>
			<option value="">— Select —</option>
			{#each OPTIONS.activityLevel as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Can climb a flight of stairs without stopping" inputId="fitness-climbsFlightOfStairs" description="The plain-language proxy for four metabolic equivalents.">
		<Select id="fitness-climbsFlightOfStairs" label="Can climb a flight of stairs without stopping" bind:value={d.fitness.climbsFlightOfStairs}>
			<option value="">— Select —</option>
			{#each OPTIONS.stairs as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Estimated METs" inputId="fitness-metabolicEquivalents" description="Below 4 triggers the domain.">
		<NumberInput id="fitness-metabolicEquivalents" label="Estimated METs" min={0} max={25} step="0.1" bind:value={d.fitness.metabolicEquivalents} />
	</Field>
	<Field label="Duke Activity Status Index" inputId="fitness-dukeActivityStatusIndex" description="Below 34 triggers the domain.">
		<NumberInput id="fitness-dukeActivityStatusIndex" label="Duke Activity Status Index" min={0} max={60} step="0.01" bind:value={d.fitness.dukeActivityStatusIndex} />
	</Field>
	<Field label="Six-minute walk (m)" inputId="fitness-sixMinuteWalkMetres">
		<NumberInput id="fitness-sixMinuteWalkMetres" label="Six-minute walk (m)" min={0} max={1200} bind:value={d.fitness.sixMinuteWalkMetres} />
	</Field>
	<Field label="CPET anaerobic threshold (ml/kg/min)" inputId="fitness-cpetAnaerobicThreshold">
		<NumberInput id="fitness-cpetAnaerobicThreshold" label="CPET anaerobic threshold (ml/kg/min)" step="0.1" bind:value={d.fitness.cpetAnaerobicThreshold} />
	</Field>
	<Field label="CPET peak VO₂ (ml/kg/min)" inputId="fitness-cpetPeakVo2">
		<NumberInput id="fitness-cpetPeakVo2" label="CPET peak VO₂ (ml/kg/min)" step="0.1" bind:value={d.fitness.cpetPeakVo2} />
	</Field>
	<Field label="Hand-grip strength (kg)" inputId="fitness-gripStrengthKg">
		<NumberInput id="fitness-gripStrengthKg" label="Hand-grip strength (kg)" min={0} max={100} step="0.1" bind:value={d.fitness.gripStrengthKg} />
	</Field>
	<Field label="Prehabilitation offered" inputId="fitness-prehabilitationOffered">
		<Select id="fitness-prehabilitationOffered" label="Prehabilitation offered" bind:value={d.fitness.prehabilitationOffered}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Prehabilitation enrolled" inputId="fitness-prehabilitationEnrolled" description="Moves the domain to in-progress.">
		<Select id="fitness-prehabilitationEnrolled" label="Prehabilitation enrolled" bind:value={d.fitness.prehabilitationEnrolled}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Sessions per week" inputId="fitness-prehabilitationSessionsPerWeek">
		<NumberInput id="fitness-prehabilitationSessionsPerWeek" label="Sessions per week" min={0} max={21} bind:value={d.fitness.prehabilitationSessionsPerWeek} />
	</Field>
	<Field label="Programme start date" inputId="fitness-prehabilitationStartDate">
		<DateInput id="fitness-prehabilitationStartDate" label="Programme start date" bind:value={d.fitness.prehabilitationStartDate} />
	</Field>
	<Field label="Protein supplementation recommended" inputId="fitness-proteinSupplementationRecommended" description="Particularly for a frail patient on a GLP-1 receptor agonist, at risk of accelerated sarcopenia.">
		<Select id="fitness-proteinSupplementationRecommended" label="Protein supplementation recommended" bind:value={d.fitness.proteinSupplementationRecommended}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Fitness notes" inputId="fitness-fitnessNotes">
		<TextAreaInput id="fitness-fitnessNotes" label="Fitness notes" rows={2} bind:value={d.fitness.fitnessNotes} />
	</Field>
</Fieldset>
