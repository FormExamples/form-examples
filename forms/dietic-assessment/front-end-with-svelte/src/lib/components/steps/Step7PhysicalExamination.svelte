<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import { OPTIONS, SEVERITY_4 } from '#lib/config/options.js';
	import { assessmentStore } from '#lib/stores/assessment.svelte.js';

	const d = assessmentStore.data;
</script>

<Fieldset legend="7. Nutrition-focused Physical Examination">
	<p class="hint">Fat and muscle stores, oedema, oral health, skin, hair, nails, and grip strength. These findings satisfy the GLIM reduced-muscle-mass criterion where body-composition measurement is unavailable.</p>

	<Field label="Subcutaneous fat loss" inputId="physicalExam-subcutaneousFatLoss">
		<Select id="physicalExam-subcutaneousFatLoss" label="Subcutaneous fat loss" bind:value={d.physicalExam.subcutaneousFatLoss}>
			<option value="">— Select —</option>
			{#each SEVERITY_4 as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Muscle wasting: temples" inputId="physicalExam-muscleWastingTemples">
		<Select id="physicalExam-muscleWastingTemples" label="Muscle wasting: temples" bind:value={d.physicalExam.muscleWastingTemples}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Muscle wasting: clavicles" inputId="physicalExam-muscleWastingClavicles">
		<Select id="physicalExam-muscleWastingClavicles" label="Muscle wasting: clavicles" bind:value={d.physicalExam.muscleWastingClavicles}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Muscle wasting: quadriceps" inputId="physicalExam-muscleWastingQuadriceps">
		<Select id="physicalExam-muscleWastingQuadriceps" label="Muscle wasting: quadriceps" bind:value={d.physicalExam.muscleWastingQuadriceps}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Overall muscle wasting severity" inputId="physicalExam-muscleWastingSeverity">
		<Select id="physicalExam-muscleWastingSeverity" label="Overall muscle wasting severity" bind:value={d.physicalExam.muscleWastingSeverity}>
			<option value="">— Select —</option>
			{#each SEVERITY_4 as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Peripheral oedema severity" inputId="physicalExam-peripheralOedemaSeverity">
		<Select id="physicalExam-peripheralOedemaSeverity" label="Peripheral oedema severity" bind:value={d.physicalExam.peripheralOedemaSeverity}>
			<option value="">— Select —</option>
			{#each SEVERITY_4 as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Oral health" inputId="physicalExam-oralHealth">
		<Select id="physicalExam-oralHealth" label="Oral health" bind:value={d.physicalExam.oralHealth}>
			<option value="">— Select —</option>
			{#each OPTIONS.goodFairPoor as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Dentition" inputId="physicalExam-dentition">
		<Select id="physicalExam-dentition" label="Dentition" bind:value={d.physicalExam.dentition}>
			<option value="">— Select —</option>
			{#each OPTIONS.dentition as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Chewing ability" inputId="physicalExam-chewingAbility">
		<Select id="physicalExam-chewingAbility" label="Chewing ability" bind:value={d.physicalExam.chewingAbility}>
			<option value="">— Select —</option>
			{#each OPTIONS.chewingAbility as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Tongue and mucosa" inputId="physicalExam-tongueAndMucosa">
		<Select id="physicalExam-tongueAndMucosa" label="Tongue and mucosa" bind:value={d.physicalExam.tongueAndMucosa}>
			<option value="">— Select —</option>
			{#each OPTIONS.tongueAndMucosa as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Skin" inputId="physicalExam-skinCondition">
		<Select id="physicalExam-skinCondition" label="Skin" bind:value={d.physicalExam.skinCondition}>
			<option value="">— Select —</option>
			{#each OPTIONS.skinCondition as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Hair" inputId="physicalExam-hairCondition">
		<Select id="physicalExam-hairCondition" label="Hair" bind:value={d.physicalExam.hairCondition}>
			<option value="">— Select —</option>
			{#each OPTIONS.hairCondition as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Nails" inputId="physicalExam-nailCondition">
		<Select id="physicalExam-nailCondition" label="Nails" bind:value={d.physicalExam.nailCondition}>
			<option value="">— Select —</option>
			{#each OPTIONS.nailCondition as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Pressure ulcer present" inputId="physicalExam-pressureUlcerPresent">
		<Select id="physicalExam-pressureUlcerPresent" label="Pressure ulcer present" bind:value={d.physicalExam.pressureUlcerPresent}>
			<option value="">— Select —</option>
			{#each [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }] as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Pressure ulcer category" inputId="physicalExam-pressureUlcerCategory">
		<Select id="physicalExam-pressureUlcerCategory" label="Pressure ulcer category" bind:value={d.physicalExam.pressureUlcerCategory}>
			<option value="">— Select —</option>
			{#each OPTIONS.pressureUlcerCategory as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Hand-grip strength (kg)" inputId="physicalExam-handGripStrengthKg" description="Sex-adjusted cut-offs: below 27 kg for men, below 16 kg for women.">
		<NumberInput id="physicalExam-handGripStrengthKg" label="Hand-grip strength (kg)" min={0} max={100} step="0.1" bind:value={d.physicalExam.handGripStrengthKg} />
	</Field>
	<Field label="Examination notes" inputId="physicalExam-physicalExamNotes">
		<TextAreaInput id="physicalExam-physicalExamNotes" label="Examination notes" rows={2} bind:value={d.physicalExam.physicalExamNotes} />
	</Field>
</Fieldset>
