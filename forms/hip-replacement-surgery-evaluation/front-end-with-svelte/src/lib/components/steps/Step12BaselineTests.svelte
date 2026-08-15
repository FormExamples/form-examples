<script lang="ts">
	import Field from '#lib/components/ui/Field.svelte';
	import Fieldset from '#lib/components/ui/Fieldset.svelte';
	import Select from '#lib/components/ui/Select.svelte';
	import { YES_NO } from '#lib/config/options.js';
	import { evaluationStore } from '#lib/stores/evaluation.svelte.js';

	const d = evaluationStore.data;
</script>

<Fieldset legend="12. Pre-operative Baseline Bloods and Tests">
	<p class="hint">Any test not yet done fires the pre-op-bloods-incomplete safety flag.</p>

	<Field label="Full blood count done" inputId="baselineTests-fullBloodCountDone">
		<Select id="baselineTests-fullBloodCountDone" label="Full blood count done" bind:value={d.baselineTests.fullBloodCountDone}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Renal function done" inputId="baselineTests-renalFunctionDone">
		<Select id="baselineTests-renalFunctionDone" label="Renal function done" bind:value={d.baselineTests.renalFunctionDone}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Clotting or INR done" inputId="baselineTests-clottingOrInrDone">
		<Select id="baselineTests-clottingOrInrDone" label="Clotting or INR done" bind:value={d.baselineTests.clottingOrInrDone}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="ECG done" inputId="baselineTests-ecgDone">
		<Select id="baselineTests-ecgDone" label="ECG done" bind:value={d.baselineTests.ecgDone}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="MRSA screen done" inputId="baselineTests-mrsaScreenDone">
		<Select id="baselineTests-mrsaScreenDone" label="MRSA screen done" bind:value={d.baselineTests.mrsaScreenDone}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Urinalysis done" inputId="baselineTests-urinalysisDone">
		<Select id="baselineTests-urinalysisDone" label="Urinalysis done" bind:value={d.baselineTests.urinalysisDone}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
</Fieldset>
