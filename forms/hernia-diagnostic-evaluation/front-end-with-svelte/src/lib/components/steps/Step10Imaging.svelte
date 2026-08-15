<script lang="ts">
	import Field from '$lib/components/ui/Field.svelte';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import { OPTIONS, YES_NO } from '$lib/config/options';
	import { evaluationStore } from '$lib/stores/assessment.svelte';

	const d = evaluationStore.data;
</script>

<Fieldset legend="10. Imaging">
	<p class="hint">Most uncomplicated hernias are diagnosed clinically; imaging is not always needed.</p>

	<Field label="Ultrasound performed" inputId="imaging-ultrasoundPerformed">
		<Select id="imaging-ultrasoundPerformed" label="Ultrasound performed" bind:value={d.imaging.ultrasoundPerformed}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	{#if d.imaging.ultrasoundPerformed === 'yes'}
		<Field label="Ultrasound findings" inputId="imaging-ultrasoundFindings">
			<Select id="imaging-ultrasoundFindings" label="Ultrasound findings" bind:value={d.imaging.ultrasoundFindings}>
				<option value="">— Select —</option>
				{#each OPTIONS.imagingFinding as option (option.value)}
					<option value={option.value}>{option.label}</option>
				{/each}
			</Select>
		</Field>
	{/if}
	<Field label="CT performed" inputId="imaging-ctPerformed">
		<Select id="imaging-ctPerformed" label="CT performed" bind:value={d.imaging.ctPerformed}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	{#if d.imaging.ctPerformed === 'yes'}
		<Field label="CT findings" inputId="imaging-ctFindings">
			<Select id="imaging-ctFindings" label="CT findings" bind:value={d.imaging.ctFindings}>
				<option value="">— Select —</option>
				{#each OPTIONS.imagingFinding as option (option.value)}
					<option value={option.value}>{option.label}</option>
				{/each}
			</Select>
		</Field>
	{/if}
	<Field label="MRI performed" inputId="imaging-mriPerformed">
		<Select id="imaging-mriPerformed" label="MRI performed" bind:value={d.imaging.mriPerformed}>
			<option value="">— Select —</option>
			{#each YES_NO as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	{#if d.imaging.mriPerformed === 'yes'}
		<Field label="MRI findings" inputId="imaging-mriFindings">
			<Select id="imaging-mriFindings" label="MRI findings" bind:value={d.imaging.mriFindings}>
				<option value="">— Select —</option>
				{#each OPTIONS.imagingFinding as option (option.value)}
					<option value={option.value}>{option.label}</option>
				{/each}
			</Select>
		</Field>
	{/if}
	<Field label="Imaging indication" inputId="imaging-imagingIndication">
		<Select id="imaging-imagingIndication" label="Imaging indication" bind:value={d.imaging.imagingIndication}>
			<option value="">— Select —</option>
			{#each OPTIONS.imagingIndication as option (option.value)}
				<option value={option.value}>{option.label}</option>
			{/each}
		</Select>
	</Field>
	<Field label="Imaging notes" inputId="imaging-imagingNotes">
		<TextAreaInput id="imaging-imagingNotes" label="Imaging notes" rows={3} bind:value={d.imaging.imagingNotes} />
	</Field>
</Fieldset>
