<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { calculatePtaFromThresholds } from '$lib/engine/rules';
	import type { EarThresholds } from '$lib/engine/types';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Field from '$lib/components/ui/Field.svelte';
	import NumberInput from '$lib/components/ui/NumberInput.svelte';
	import TextAreaInput from '$lib/components/ui/TextAreaInput.svelte';

	const p = assessment.data.pureToneAudiometry;

	const freqs: { key: keyof EarThresholds; label: string }[] = [
		{ key: 'hz500', label: '0.5 kHz' },
		{ key: 'hz1000', label: '1 kHz' },
		{ key: 'hz2000', label: '2 kHz' },
		{ key: 'hz4000', label: '4 kHz' }
	];

	const rightPta = $derived(calculatePtaFromThresholds(p.rightEar.airConduction));
	const leftPta = $derived(calculatePtaFromThresholds(p.leftEar.airConduction));
	const betterPta = $derived(
		rightPta != null && leftPta != null
			? Math.min(rightPta, leftPta)
			: (rightPta ?? leftPta)
	);
	const asymmetry = $derived(
		rightPta != null && leftPta != null ? Math.round(Math.abs(rightPta - leftPta) * 10) / 10 : null
	);
</script>

<Fieldset legend="Pure-Tone Audiometry">
	<p class="hint">Air-conduction and bone-conduction thresholds at 0.5, 1, 2, and 4 kHz (dB HL).</p>

	<h3 class="mt-2 text-sm font-semibold text-base-content/80">Right ear — Air conduction</h3>
	<div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
		{#each freqs as f (f.key)}
			<Field label={f.label} inputId={`r-air-${f.key}`}>
				<NumberInput id={`r-air-${f.key}`} label={`Right air ${f.label}`} min={-10} max={120} bind:value={p.rightEar.airConduction[f.key]} />
			</Field>
		{/each}
	</div>

	<h3 class="mt-2 text-sm font-semibold text-base-content/80">Right ear — Bone conduction</h3>
	<div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
		{#each freqs as f (f.key)}
			<Field label={f.label} inputId={`r-bone-${f.key}`}>
				<NumberInput id={`r-bone-${f.key}`} label={`Right bone ${f.label}`} min={-10} max={120} bind:value={p.rightEar.boneConduction[f.key]} />
			</Field>
		{/each}
	</div>

	<Field label="Right ear PTA (4-frequency average, air conduction)" description="Auto-calculated">
		<p class="font-semibold text-base-content">{rightPta == null ? '—' : `${rightPta} dB HL`}</p>
	</Field>

	<h3 class="mt-2 text-sm font-semibold text-base-content/80">Left ear — Air conduction</h3>
	<div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
		{#each freqs as f (f.key)}
			<Field label={f.label} inputId={`l-air-${f.key}`}>
				<NumberInput id={`l-air-${f.key}`} label={`Left air ${f.label}`} min={-10} max={120} bind:value={p.leftEar.airConduction[f.key]} />
			</Field>
		{/each}
	</div>

	<h3 class="mt-2 text-sm font-semibold text-base-content/80">Left ear — Bone conduction</h3>
	<div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
		{#each freqs as f (f.key)}
			<Field label={f.label} inputId={`l-bone-${f.key}`}>
				<NumberInput id={`l-bone-${f.key}`} label={`Left bone ${f.label}`} min={-10} max={120} bind:value={p.leftEar.boneConduction[f.key]} />
			</Field>
		{/each}
	</div>

	<Field label="Left ear PTA (4-frequency average, air conduction)" description="Auto-calculated">
		<p class="font-semibold text-base-content">{leftPta == null ? '—' : `${leftPta} dB HL`}</p>
	</Field>

	<div class="grid gap-4 sm:grid-cols-2">
		<Field label="Better-ear PTA" description="Auto-calculated">
			<p class="font-semibold text-base-content">{betterPta == null ? '—' : `${betterPta} dB HL`}</p>
		</Field>
		<Field label="Inter-aural asymmetry" description="Both ears required">
			<p class="font-semibold text-base-content">{asymmetry == null ? '—' : `${asymmetry} dB`}</p>
		</Field>
	</div>

	<Field label="Audiometry notes" inputId="audiometryNotes">
		<TextAreaInput id="audiometryNotes" label="Audiometry notes" rows={3} placeholder="Masking applied, no-response thresholds, equipment notes…" bind:value={p.audiometryNotes} />
	</Field>
</Fieldset>
