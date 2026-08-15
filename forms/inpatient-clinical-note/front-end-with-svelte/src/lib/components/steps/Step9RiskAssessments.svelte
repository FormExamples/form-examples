<script lang="ts">
	import { assessment } from '#lib/stores/assessment.svelte.js';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Field from '#lib/components/ui/Field.svelte';
	import TextInput from '#lib/components/ui/TextInput.svelte';
	import TextAreaInput from '#lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '#lib/components/ui/NumberInput.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import * as options from '#lib/config/options.js';
	import { TOTAL_STEPS } from '#lib/config/steps.js';

	const s = assessment.data.risks;
</script>

<Fieldset legend={`Step 9 of ${TOTAL_STEPS} — Risk assessments`}>
	<p class="hint">
		The mandatory inpatient risk assessments. VTE status alone documents this component — it is the
		only one NICE mandates for every inpatient.
	</p>

	<Field
		label="VTE risk assessment"
		description="NICE NG89. Not done raises a high-priority flag."
		inputId="risks-vteStatus"
	>
		<Select id="risks-vteStatus" label="VTE risk assessment" bind:value={s.vteStatus}>
			<option value="">— Select —</option>
			{#each options.vteStatus as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</Select>
	</Field>

	<Field label="VTE prophylaxis" inputId="risks-vteProphylaxis">
		<Select id="risks-vteProphylaxis" label="VTE prophylaxis" bind:value={s.vteProphylaxis}>
			<option value="">— Select —</option>
			{#each options.vteProphylaxis as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</Select>
	</Field>

	<Field label="VTE notes" inputId="risks-vteNotes">
		<TextAreaInput
			id="risks-vteNotes"
			label="VTE notes"
			rows={2}
			placeholder="Including any contraindication to prophylaxis."
			bind:value={s.vteNotes}
		/>
	</Field>

	<Field label="Falls risk" inputId="risks-fallsRisk">
		<Select id="risks-fallsRisk" label="Falls risk" bind:value={s.fallsRisk}>
			<option value="">— Select —</option>
			{#each options.fallsRisk as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</Select>
	</Field>

	<Field label="Falls interventions" inputId="risks-fallsInterventions">
		<TextAreaInput id="risks-fallsInterventions" label="Falls interventions" rows={2} bind:value={s.fallsInterventions} />
	</Field>

	<Field label="Pressure-ulcer risk" inputId="risks-pressureUlcerRisk">
		<Select id="risks-pressureUlcerRisk" label="Pressure-ulcer risk" bind:value={s.pressureUlcerRisk}>
			<option value="">— Select —</option>
			{#each options.pressureUlcerRisk as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</Select>
	</Field>

	<Field label="Skin integrity" inputId="risks-skinIntegrity">
		<Select id="risks-skinIntegrity" label="Skin integrity" bind:value={s.skinIntegrity}>
			<option value="">— Select —</option>
			{#each options.skinIntegrity as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</Select>
	</Field>

	<Field label="Pressure-ulcer category" inputId="risks-pressureUlcerGrade">
		<Select id="risks-pressureUlcerGrade" label="Pressure-ulcer category" bind:value={s.pressureUlcerGrade}>
			<option value="">— Select —</option>
			{#each options.pressureUlcerGrade as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</Select>
	</Field>

	<Field label="Pressure-damage sites" inputId="risks-pressureUlcerSites">
		<TextInput
			id="risks-pressureUlcerSites"
			label="Pressure-damage sites"
			placeholder="e.g. sacrum, left heel"
			bind:value={s.pressureUlcerSites}
		/>
	</Field>

	<Field label="Delirium screen" inputId="risks-deliriumScreen">
		<Select id="risks-deliriumScreen" label="Delirium screen" bind:value={s.deliriumScreen}>
			<option value="">— Select —</option>
			{#each options.deliriumScreen as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</Select>
	</Field>

	<Field
		label="4AT score"
		description="0–12. The full instrument lives in the 4AT form."
		inputId="risks-delirium4atScore"
	>
		<NumberInput id="risks-delirium4atScore" label="4AT score" min={0} max={12} step={1} bind:value={s.delirium4atScore} />
	</Field>

	<Field label="Delirium notes" inputId="risks-deliriumNotes">
		<TextAreaInput id="risks-deliriumNotes" label="Delirium notes" rows={2} bind:value={s.deliriumNotes} />
	</Field>

	<Field label="Nutrition screen" inputId="risks-nutritionScreen">
		<Select id="risks-nutritionScreen" label="Nutrition screen" bind:value={s.nutritionScreen}>
			<option value="">— Select —</option>
			{#each options.nutritionScreen as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</Select>
	</Field>

	<Field label="MUST score" inputId="risks-mustScore">
		<NumberInput id="risks-mustScore" label="MUST score" min={0} max={6} step={1} bind:value={s.mustScore} />
	</Field>

	<Field label="Nutrition plan" inputId="risks-nutritionPlan">
		<TextAreaInput id="risks-nutritionPlan" label="Nutrition plan" rows={2} bind:value={s.nutritionPlan} />
	</Field>

	<Field label="Infection status" inputId="risks-infectionStatus">
		<Select id="risks-infectionStatus" label="Infection status" bind:value={s.infectionStatus}>
			<option value="">— Select —</option>
			{#each options.infectionStatus as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</Select>
	</Field>

	<Field
		label="Isolation status"
		description="Must travel with a transfer note."
		inputId="risks-isolationStatus"
	>
		<Select id="risks-isolationStatus" label="Isolation status" bind:value={s.isolationStatus}>
			<option value="">— Select —</option>
			{#each options.isolationStatus as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</Select>
	</Field>

	<Field label="Organism" inputId="risks-organism">
		<TextInput id="risks-organism" label="Organism" placeholder="Identified or suspected" bind:value={s.organism} />
	</Field>

	<Field label="Safeguarding concern?" inputId="risks-safeguardingConcern">
		<Select id="risks-safeguardingConcern" label="Safeguarding concern?" bind:value={s.safeguardingConcern}>
			<option value="">— Select —</option>
			{#each options.yesNo as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</Select>
	</Field>

	<Field label="Safeguarding notes" inputId="risks-safeguardingNotes">
		<TextAreaInput id="risks-safeguardingNotes" label="Safeguarding notes" rows={2} bind:value={s.safeguardingNotes} />
	</Field>

	<Field label="Safeguarding referral made?" inputId="risks-safeguardingReferralMade">
		<Select
			id="risks-safeguardingReferralMade"
			label="Safeguarding referral made?"
			bind:value={s.safeguardingReferralMade}
		>
			<option value="">— Select —</option>
			{#each options.yesNo as o (o.value)}
				<option value={o.value}>{o.label}</option>
			{/each}
		</Select>
	</Field>
</Fieldset>
