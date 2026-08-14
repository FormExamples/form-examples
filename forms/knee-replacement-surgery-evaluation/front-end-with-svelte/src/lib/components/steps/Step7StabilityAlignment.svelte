<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { OPTIONS } from '$lib/config/options';
	import { evaluationStore } from '$lib/stores/evaluation.svelte';

	const d = evaluationStore.data;
</script>

<Fieldset legend="7. Physical Examination — Stability and Alignment">
	<p class="hint">Coronal-plane deformity, ligament stability, and patellar tracking.</p>

	<Field label="Coronal deformity type" inputId="stability-coronalDeformityType">
		<Select id="stability-coronalDeformityType" label="Coronal deformity type" bind:value={d.stability.coronalDeformityType}>
			<option value="">— Select —</option>
			{#each OPTIONS.coronalDeformityType as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Coronal deformity severity" inputId="stability-coronalDeformitySeverity">
		<Select id="stability-coronalDeformitySeverity" label="Coronal deformity severity" bind:value={d.stability.coronalDeformitySeverity}>
			<option value="">— Select —</option>
			{#each OPTIONS.coronalDeformitySeverity as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Anterior cruciate ligament (ACL)" inputId="stability-ligamentAcl">
		<Select id="stability-ligamentAcl" label="Anterior cruciate ligament (ACL)" bind:value={d.stability.ligamentAcl}>
			<option value="">— Select —</option>
			{#each OPTIONS.ligament as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Posterior cruciate ligament (PCL)" inputId="stability-ligamentPcl">
		<Select id="stability-ligamentPcl" label="Posterior cruciate ligament (PCL)" bind:value={d.stability.ligamentPcl}>
			<option value="">— Select —</option>
			{#each OPTIONS.ligament as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Medial collateral ligament (MCL)" inputId="stability-ligamentMcl">
		<Select id="stability-ligamentMcl" label="Medial collateral ligament (MCL)" bind:value={d.stability.ligamentMcl}>
			<option value="">— Select —</option>
			{#each OPTIONS.ligament as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Lateral collateral ligament (LCL)" inputId="stability-ligamentLcl">
		<Select id="stability-ligamentLcl" label="Lateral collateral ligament (LCL)" bind:value={d.stability.ligamentLcl}>
			<option value="">— Select —</option>
			{#each OPTIONS.ligament as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Patellar tracking" inputId="stability-patellarTracking">
		<Select id="stability-patellarTracking" label="Patellar tracking" bind:value={d.stability.patellarTracking}>
			<option value="">— Select —</option>
			{#each OPTIONS.patellarTracking as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
</Fieldset>
