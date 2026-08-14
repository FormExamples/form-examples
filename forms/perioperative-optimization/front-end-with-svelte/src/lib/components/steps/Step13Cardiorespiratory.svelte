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

<Fieldset legend="13. Cardiorespiratory Optimization">
	<p class="hint">Domain 8. Blood pressure at or above 180/110, uncontrolled airways disease, an ejection fraction below 40%, or an unassessed high STOP-BANG all trigger it.</p>

	<Field label="Systolic BP (mmHg)" inputId="cardioresp-systolicBp">
		<NumberInput id="cardioresp-systolicBp" label="Systolic BP (mmHg)" min={50} max={300} bind:value={d.cardioresp.systolicBp} />
	</Field>
	<Field label="Diastolic BP (mmHg)" inputId="cardioresp-diastolicBp">
		<NumberInput id="cardioresp-diastolicBp" label="Diastolic BP (mmHg)" min={20} max={200} bind:value={d.cardioresp.diastolicBp} />
	</Field>
	<Field label="Heart rate (bpm)" inputId="cardioresp-heartRate">
		<NumberInput id="cardioresp-heartRate" label="Heart rate (bpm)" min={20} max={250} bind:value={d.cardioresp.heartRate} />
	</Field>
	<Field label="Rhythm" inputId="cardioresp-heartRhythm">
		<Select id="cardioresp-heartRhythm" label="Rhythm" bind:value={d.cardioresp.heartRhythm}>
			<option value="">— Select —</option>
			{#each OPTIONS.heartRhythm as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Murmur present" inputId="cardioresp-murmurPresent">
		<Select id="cardioresp-murmurPresent" label="Murmur present" bind:value={d.cardioresp.murmurPresent}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Exercise tolerance" inputId="cardioresp-exerciseTolerance">
		<Select id="cardioresp-exerciseTolerance" label="Exercise tolerance" bind:value={d.cardioresp.exerciseTolerance}>
			<option value="">— Select —</option>
			{#each OPTIONS.exerciseTolerance as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Ejection fraction (%)" inputId="cardioresp-ejectionFractionPercent">
		<NumberInput id="cardioresp-ejectionFractionPercent" label="Ejection fraction (%)" min={5} max={80} bind:value={d.cardioresp.ejectionFractionPercent} />
	</Field>
	<Field label="Echocardiogram date" inputId="cardioresp-echoDate">
		<DateInput id="cardioresp-echoDate" label="Echocardiogram date" bind:value={d.cardioresp.echoDate} />
	</Field>
	<Field label="Asthma control" inputId="cardioresp-asthmaControl">
		<Select id="cardioresp-asthmaControl" label="Asthma control" bind:value={d.cardioresp.asthmaControl}>
			<option value="">— Select —</option>
			{#each OPTIONS.airwaysControl as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="COPD control" inputId="cardioresp-copdControl">
		<Select id="cardioresp-copdControl" label="COPD control" bind:value={d.cardioresp.copdControl}>
			<option value="">— Select —</option>
			{#each OPTIONS.airwaysControl as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Inhaler technique checked" inputId="cardioresp-inhalerTechniqueChecked">
		<Select id="cardioresp-inhalerTechniqueChecked" label="Inhaler technique checked" bind:value={d.cardioresp.inhalerTechniqueChecked}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Rescue steroids at home" inputId="cardioresp-rescueSteroids">
		<Select id="cardioresp-rescueSteroids" label="Rescue steroids at home" bind:value={d.cardioresp.rescueSteroids}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Spirometry FEV₁ (% predicted)" inputId="cardioresp-spirometryFev1Percent">
		<NumberInput id="cardioresp-spirometryFev1Percent" label="Spirometry FEV₁ (% predicted)" step="0.1" bind:value={d.cardioresp.spirometryFev1Percent} />
	</Field>
	<Field label="STOP-BANG score" inputId="cardioresp-stopBangScore" description="5 or more without a diagnosis triggers the domain.">
		<NumberInput id="cardioresp-stopBangScore" label="STOP-BANG score" min={0} max={8} bind:value={d.cardioresp.stopBangScore} />
	</Field>
	<Field label="Sleep apnoea diagnosed" inputId="cardioresp-sleepApnoeaDiagnosis">
		<Select id="cardioresp-sleepApnoeaDiagnosis" label="Sleep apnoea diagnosed" bind:value={d.cardioresp.sleepApnoeaDiagnosis}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Uses CPAP" inputId="cardioresp-cpapUse">
		<Select id="cardioresp-cpapUse" label="Uses CPAP" bind:value={d.cardioresp.cpapUse}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Oxygen saturation on air (%)" inputId="cardioresp-oxygenSaturationPercent">
		<NumberInput id="cardioresp-oxygenSaturationPercent" label="Oxygen saturation on air (%)" min={50} max={100} step="0.1" bind:value={d.cardioresp.oxygenSaturationPercent} />
	</Field>
	<Field label="Cardiorespiratory notes" inputId="cardioresp-cardiorespiratoryNotes">
		<TextAreaInput id="cardioresp-cardiorespiratoryNotes" label="Cardiorespiratory notes" rows={2} bind:value={d.cardioresp.cardiorespiratoryNotes} />
	</Field>
</Fieldset>
