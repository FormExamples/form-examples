<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { OPTIONS, SEVERITY_4 } from '$lib/config/options';
	import { assessmentStore } from '$lib/stores/assessment.svelte';

	const d = assessmentStore.data;
</script>

<Fieldset legend="14. Behavioural and Readiness to Change">
	<p class="hint">Motivation, barriers, mood, and the SCOFF disordered-eating screen.</p>

	<Field label="Motivation (0–10)" inputId="behavioural-motivation0To10">
		<NumberInput id="behavioural-motivation0To10" label="Motivation (0–10)" min={0} max={10} bind:value={d.behavioural.motivation0To10} />
	</Field>
	<Field label="Stage of change" inputId="behavioural-stageOfChange">
		<Select id="behavioural-stageOfChange" label="Stage of change" bind:value={d.behavioural.stageOfChange}>
			<option value="">— Select —</option>
			{#each OPTIONS.stageOfChange as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Self-efficacy (0–10)" inputId="behavioural-selfEfficacy0To10">
		<NumberInput id="behavioural-selfEfficacy0To10" label="Self-efficacy (0–10)" min={0} max={10} bind:value={d.behavioural.selfEfficacy0To10} />
	</Field>
	<Field label="Previous attempts" inputId="behavioural-previousAttempts">
		<TextAreaInput id="behavioural-previousAttempts" label="Previous attempts" rows={2} bind:value={d.behavioural.previousAttempts} />
	</Field>
	<Field label="Barriers" inputId="behavioural-barriers">
		<TextAreaInput id="behavioural-barriers" label="Barriers" rows={2} bind:value={d.behavioural.barriers} />
	</Field>
	<Field label="SCOFF: do you make yourself sick because you feel uncomfortably full?" inputId="behavioural-scoffMakeYourselfSick">
		<Select id="behavioural-scoffMakeYourselfSick" label="SCOFF: do you make yourself sick because you feel uncomfortably full?" bind:value={d.behavioural.scoffMakeYourselfSick}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="SCOFF: do you worry you have lost control over how much you eat?" inputId="behavioural-scoffLostControl">
		<Select id="behavioural-scoffLostControl" label="SCOFF: do you worry you have lost control over how much you eat?" bind:value={d.behavioural.scoffLostControl}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="SCOFF: have you recently lost more than one stone (about 6 kg) in three months?" inputId="behavioural-scoffLostOneStone">
		<Select id="behavioural-scoffLostOneStone" label="SCOFF: have you recently lost more than one stone (about 6 kg) in three months?" bind:value={d.behavioural.scoffLostOneStone}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="SCOFF: do you believe yourself to be fat when others say you are too thin?" inputId="behavioural-scoffBelieveYourselfFat">
		<Select id="behavioural-scoffBelieveYourselfFat" label="SCOFF: do you believe yourself to be fat when others say you are too thin?" bind:value={d.behavioural.scoffBelieveYourselfFat}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="SCOFF: would you say that food dominates your life?" inputId="behavioural-scoffFoodDominates">
		<Select id="behavioural-scoffFoodDominates" label="SCOFF: would you say that food dominates your life?" bind:value={d.behavioural.scoffFoodDominates}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Mood" inputId="behavioural-mood">
		<Select id="behavioural-mood" label="Mood" bind:value={d.behavioural.mood}>
			<option value="">— Select —</option>
			{#each OPTIONS.mood as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Anxiety" inputId="behavioural-anxiety">
		<Select id="behavioural-anxiety" label="Anxiety" bind:value={d.behavioural.anxiety}>
			<option value="">— Select —</option>
			{#each SEVERITY_4 as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Cognitive impairment" inputId="behavioural-cognitiveImpairment">
		<Select id="behavioural-cognitiveImpairment" label="Cognitive impairment" bind:value={d.behavioural.cognitiveImpairment}>
			<option value="">— Select —</option>
			{#each SEVERITY_4 as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Capacity concern" inputId="behavioural-capacityConcern">
		<Select id="behavioural-capacityConcern" label="Capacity concern" bind:value={d.behavioural.capacityConcern}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Safeguarding concern" inputId="behavioural-safeguardingConcern">
		<Select id="behavioural-safeguardingConcern" label="Safeguarding concern" bind:value={d.behavioural.safeguardingConcern}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Health literacy" inputId="behavioural-healthLiteracy">
		<Select id="behavioural-healthLiteracy" label="Health literacy" bind:value={d.behavioural.healthLiteracy}>
			<option value="">— Select —</option>
			{#each OPTIONS.healthLiteracy as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Preferred learning style" inputId="behavioural-preferredLearningStyle">
		<Select id="behavioural-preferredLearningStyle" label="Preferred learning style" bind:value={d.behavioural.preferredLearningStyle}>
			<option value="">— Select —</option>
			{#each OPTIONS.learningStyle as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="The patient's goal, in their own words" inputId="behavioural-patientGoalInOwnWords" description="Recorded verbatim so the care plan can be written against what the patient actually wants.">
		<TextAreaInput id="behavioural-patientGoalInOwnWords" label="The patient's goal, in their own words" rows={2} bind:value={d.behavioural.patientGoalInOwnWords} />
	</Field>
</Fieldset>
