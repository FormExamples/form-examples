<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { OPTIONS, YES_NO_OPTS } from '$lib/config/options';
	import { assessmentStore } from '$lib/stores/assessment.svelte';

	const d = assessmentStore.data;
</script>

<Fieldset legend="3. Medical and Surgical History">
	<p class="hint">Active diagnoses, previous surgery, and any previous anaesthetic complication.</p>

	<Field label="Cardiac disease" inputId="history-conditionCardiac">
		<Select id="history-conditionCardiac" label="Cardiac disease" bind:value={d.history.conditionCardiac}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Respiratory disease" inputId="history-conditionRespiratory">
		<Select id="history-conditionRespiratory" label="Respiratory disease" bind:value={d.history.conditionRespiratory}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Renal disease" inputId="history-conditionRenal">
		<Select id="history-conditionRenal" label="Renal disease" bind:value={d.history.conditionRenal}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Liver disease" inputId="history-conditionHepatic">
		<Select id="history-conditionHepatic" label="Liver disease" bind:value={d.history.conditionHepatic}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Stroke or TIA" inputId="history-conditionStroke">
		<Select id="history-conditionStroke" label="Stroke or TIA" bind:value={d.history.conditionStroke}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Cancer" inputId="history-conditionCancer">
		<Select id="history-conditionCancer" label="Cancer" bind:value={d.history.conditionCancer}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Rheumatological disease" inputId="history-conditionRheumatological">
		<Select id="history-conditionRheumatological" label="Rheumatological disease" bind:value={d.history.conditionRheumatological}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Thyroid disease" inputId="history-conditionThyroid">
		<Select id="history-conditionThyroid" label="Thyroid disease" bind:value={d.history.conditionThyroid}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Other conditions" inputId="history-conditionOther">
		<TextInput id="history-conditionOther" label="Other conditions" bind:value={d.history.conditionOther} />
	</Field>
	<Field label="Previous surgery" inputId="history-previousSurgery">
		<Select id="history-previousSurgery" label="Previous surgery" bind:value={d.history.previousSurgery}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Previous surgery detail" inputId="history-previousSurgeryDetail">
		<TextInput id="history-previousSurgeryDetail" label="Previous surgery detail" bind:value={d.history.previousSurgeryDetail} />
	</Field>
	<Field label="Previous anaesthetic complication" inputId="history-previousAnaestheticComplication">
		<Select id="history-previousAnaestheticComplication" label="Previous anaesthetic complication" bind:value={d.history.previousAnaestheticComplication}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Complication detail" inputId="history-previousAnaestheticComplicationDetail">
		<TextInput id="history-previousAnaestheticComplicationDetail" label="Complication detail" bind:value={d.history.previousAnaestheticComplicationDetail} />
	</Field>
	<Field label="Postoperative nausea and vomiting history" inputId="history-postoperativeNauseaHistory">
		<Select id="history-postoperativeNauseaHistory" label="Postoperative nausea and vomiting history" bind:value={d.history.postoperativeNauseaHistory}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Difficult airway documented" inputId="history-difficultAirwayHistory">
		<Select id="history-difficultAirwayHistory" label="Difficult airway documented" bind:value={d.history.difficultAirwayHistory}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Malignant hyperthermia history" inputId="history-malignantHyperthermiaHistory">
		<Select id="history-malignantHyperthermiaHistory" label="Malignant hyperthermia history" bind:value={d.history.malignantHyperthermiaHistory}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Venous thromboembolism history" inputId="history-venousThromboembolismHistory">
		<Select id="history-venousThromboembolismHistory" label="Venous thromboembolism history" bind:value={d.history.venousThromboembolismHistory}>
			<option value="">— Select —</option>
			{#each YES_NO_OPTS as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Relevant family history" inputId="history-familyHistory">
		<TextAreaInput id="history-familyHistory" label="Relevant family history" rows={2} bind:value={d.history.familyHistory} />
	</Field>
	<Field label="Pregnancy status" inputId="history-pregnancyStatus">
		<Select id="history-pregnancyStatus" label="Pregnancy status" bind:value={d.history.pregnancyStatus}>
			<option value="">— Select —</option>
			{#each OPTIONS.pregnancyStatus as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
</Fieldset>
