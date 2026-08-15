<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextInput from '$lib/components/ui/TextInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { OPTIONS, YES_NO } from '$lib/config/options';
	import { evaluationStore } from '$lib/stores/assessment.svelte';

	const d = evaluationStore.data;
</script>

<Fieldset legend="3. Presenting Complaint and History">
	<p class="hint">Duration, pain, aggravating factors, and prior hernia history.</p>

	<Field label="Duration of bulge" inputId="history-durationOfBulge">
		<Select id="history-durationOfBulge" label="Duration of bulge" bind:value={d.history.durationOfBulge}>
			<option value="">— Select —</option>
			{#each OPTIONS.durationOfBulge as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Pain score (0–10)" inputId="history-painScore0To10">
		<NumberInput id="history-painScore0To10" label="Pain score (0–10)" min={0} max={10} bind:value={d.history.painScore0To10} />
	</Field>
	<Field label="Pain onset" inputId="history-painOnset">
		<Select id="history-painOnset" label="Pain onset" bind:value={d.history.painOnset}>
			<option value="">— Select —</option>
			{#each OPTIONS.painOnset as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Aggravated by straining" inputId="history-aggravatedByStraining">
		<Select id="history-aggravatedByStraining" label="Aggravated by straining" bind:value={d.history.aggravatedByStraining}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Aggravated by lifting" inputId="history-aggravatedByLifting">
		<Select id="history-aggravatedByLifting" label="Aggravated by lifting" bind:value={d.history.aggravatedByLifting}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Aggravated by coughing" inputId="history-aggravatedByCoughing">
		<Select id="history-aggravatedByCoughing" label="Aggravated by coughing" bind:value={d.history.aggravatedByCoughing}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Prior hernia history" inputId="history-priorHerniaHistory">
		<Select id="history-priorHerniaHistory" label="Prior hernia history" bind:value={d.history.priorHerniaHistory}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Prior hernia repair" inputId="history-priorHerniaRepair">
		<Select id="history-priorHerniaRepair" label="Prior hernia repair" bind:value={d.history.priorHerniaRepair}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Prior hernia repair mesh" inputId="history-priorHerniaRepairMesh">
		<Select id="history-priorHerniaRepairMesh" label="Prior hernia repair mesh" bind:value={d.history.priorHerniaRepairMesh}>
			<option value="">— Select —</option>
			{#each OPTIONS.priorHerniaRepairMesh as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Prior hernia repair site" inputId="history-priorHerniaRepairSite" description="Recording the same site as this evaluation raises the recurrent-hernia flag.">
		<TextInput id="history-priorHerniaRepairSite" label="Prior hernia repair site" bind:value={d.history.priorHerniaRepairSite} />
	</Field>
	<Field label="History notes" inputId="history-historyNotes">
		<TextAreaInput id="history-historyNotes" label="History notes" rows={3} bind:value={d.history.historyNotes} />
	</Field>
</Fieldset>
