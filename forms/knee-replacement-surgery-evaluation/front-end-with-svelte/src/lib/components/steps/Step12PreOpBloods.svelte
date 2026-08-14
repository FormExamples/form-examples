<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { YES_NO } from '$lib/config/options';
	import { evaluationStore } from '$lib/stores/evaluation.svelte';

	const d = evaluationStore.data;
</script>

<Fieldset legend="12. Pre-operative Baseline Bloods and Tests">
	<p class="hint">
		Done / not done checklist. Any item left not done fires the pre-op-bloods-incomplete safety
		flag when a surgical recommendation is made.
	</p>

	<Field label="Full blood count (FBC)" inputId="preOpBloods-fbcDone">
		<Select id="preOpBloods-fbcDone" label="Full blood count (FBC)" bind:value={d.preOpBloods.fbcDone}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Renal function" inputId="preOpBloods-renalFunctionDone">
		<Select id="preOpBloods-renalFunctionDone" label="Renal function" bind:value={d.preOpBloods.renalFunctionDone}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Clotting / INR" inputId="preOpBloods-clottingDone">
		<Select id="preOpBloods-clottingDone" label="Clotting / INR" bind:value={d.preOpBloods.clottingDone}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Electrocardiogram (ECG)" inputId="preOpBloods-ecgDone">
		<Select id="preOpBloods-ecgDone" label="Electrocardiogram (ECG)" bind:value={d.preOpBloods.ecgDone}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="MRSA screen" inputId="preOpBloods-mrsaScreenDone">
		<Select id="preOpBloods-mrsaScreenDone" label="MRSA screen" bind:value={d.preOpBloods.mrsaScreenDone}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Urinalysis" inputId="preOpBloods-urinalysisDone">
		<Select id="preOpBloods-urinalysisDone" label="Urinalysis" bind:value={d.preOpBloods.urinalysisDone}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
</Fieldset>
