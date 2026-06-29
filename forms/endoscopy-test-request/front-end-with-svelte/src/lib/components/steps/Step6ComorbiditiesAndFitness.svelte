<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import CheckboxGroup from '$lib/components/ui/CheckboxGroup.svelte';
	import CheckboxInput from '$lib/components/ui/CheckboxInput.svelte';
	import { request } from '$lib/stores/request.svelte';

	const d = request.data.comorbidities;
</script>

<Fieldset legend="6. Comorbidities and Fitness">
	<p class="hint">Cardiac, renal, and anaesthetic fitness for the procedure and sedation.</p>

	<Field label="NYHA cardiac class" inputId="cardiacNyhaClass" description="New York Heart Association functional class.">
		<Select id="cardiacNyhaClass" label="NYHA cardiac class" bind:value={d.cardiacNyhaClass}>
			<option value="">Select…</option>
			<option value="I">Class I — no limitation</option>
			<option value="II">Class II — slight limitation</option>
			<option value="III">Class III — marked limitation</option>
			<option value="IV">Class IV — symptoms at rest</option>
		</Select>
	</Field>

	<Field label="ASA grade" inputId="asaGrade" description="ASA physical-status classification.">
		<Select id="asaGrade" label="ASA grade" bind:value={d.asaGrade}>
			<option value="">Select…</option>
			<option value="I">ASA I — healthy</option>
			<option value="II">ASA II — mild systemic disease</option>
			<option value="III">ASA III — severe systemic disease</option>
			<option value="IV">ASA IV — constant threat to life</option>
			<option value="V">ASA V — moribund</option>
		</Select>
	</Field>

	<Field label="Chronic kidney disease">
		<CheckboxGroup label="Chronic kidney disease">
			<label>
				<CheckboxInput label="Chronic kidney disease" bind:checked={d.chronicKidneyDisease} />
				Chronic kidney disease
			</label>
		</CheckboxGroup>
	</Field>

	{#if d.chronicKidneyDisease}
		<Field label="eGFR" inputId="egfrMlMin" description="mL/min/1.73m².">
			<NumberInput id="egfrMlMin" label="eGFR" min={0} max={150} step={1} bind:value={d.egfrMlMin} />
		</Field>
	{/if}

	<Field label="Other comorbidities">
		<CheckboxGroup label="Other comorbidities">
			<label><CheckboxInput label="Pacemaker / ICD" bind:checked={d.pacemakerIcd} /> Pacemaker / ICD</label>
			<label><CheckboxInput label="Obstructive sleep apnoea" bind:checked={d.sleepApnoea} /> Obstructive sleep apnoea</label>
			<label><CheckboxInput label="Neutropenia" bind:checked={d.neutropenia} /> Neutropenia</label>
		</CheckboxGroup>
	</Field>
</Fieldset>
