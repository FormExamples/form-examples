<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';

	const bandClass = $derived({
		low: 'bg-band-low text-band-low-text',
		borderline: 'bg-band-borderline text-band-borderline-text',
		medium: 'bg-band-medium text-band-medium-text',
		high: 'bg-band-high text-band-high-text',
	}[assessment.grade.computedBand]);

	const recommendationCopy = {
		low: "Don't hire agile help yet — focus on internal operations first.",
		borderline: 'Borderline — do your agile homework first; revisit in ~3 months.',
		medium: 'Do your agile homework first; revisit the scorecard in ~3 months.',
		high: 'Likely ready — trial an engagement and review in ~3 months.',
	} as const;
</script>

<section>
	<h2 class="text-lg font-semibold text-slate-800">Step 6 — Score &amp; sign-off</h2>

	<div class="mt-4 grid grid-cols-3 gap-3 text-center">
		<div class="rounded border border-slate-300 p-3">
			<div class="text-3xl font-bold">{assessment.grade.scoreTotal}</div>
			<div class="text-xs text-slate-600">/ 16 total</div>
		</div>
		<div class="rounded border border-slate-300 p-3">
			<div class="text-3xl font-bold">{assessment.grade.manifestoSubtotal}</div>
			<div class="text-xs text-slate-600">/ 4 manifesto</div>
		</div>
		<div class="rounded border border-slate-300 p-3">
			<div class="text-3xl font-bold">{assessment.grade.principlesSubtotal}</div>
			<div class="text-xs text-slate-600">/ 12 principles</div>
		</div>
	</div>

	<div class="mt-4 flex items-center gap-3">
		<span
			class="inline-block px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide {bandClass}"
		>
			{assessment.grade.computedBand}
		</span>
		<span class="text-sm text-slate-700">{recommendationCopy[assessment.grade.computedBand]}</span>
	</div>

	{#if assessment.grade.additionalFlags.length > 0}
		<div class="mt-4">
			<h3 class="text-base font-semibold text-slate-800">Readiness flags</h3>
			<ul class="mt-2 space-y-2">
				{#each assessment.grade.additionalFlags as flag}
					<li class="rounded border-l-4 border-red-500 bg-red-50 p-2">
						<div class="font-semibold text-sm">{flag.category} <span class="text-xs text-slate-500">({flag.priority})</span></div>
						<div class="text-sm">{flag.description}</div>
						<div class="text-xs text-slate-600 mt-1"><strong>Suggested action:</strong> {flag.suggestedAction}</div>
					</li>
				{/each}
			</ul>
		</div>
	{/if}

	<label class="block mt-4 text-sm">
		Signed by
		<input
			type="text"
			class="w-full mt-1 p-1.5 rounded border border-slate-300"
			placeholder="Your name"
		/>
	</label>
</section>
