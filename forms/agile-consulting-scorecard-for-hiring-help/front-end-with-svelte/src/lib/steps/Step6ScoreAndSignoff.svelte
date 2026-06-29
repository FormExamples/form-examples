<script lang="ts">
	import { assessment } from '$lib/stores/assessment.svelte';
	import { bandColor, bandShortLabel, recommendationCopy } from '$lib/engine/utils';

	const grade = $derived(assessment.grade);
	const bandClass = $derived(bandColor(grade.computedBand));
</script>

<section>
	<h2 class="text-lg font-semibold text-base-content">Step 6 — Score &amp; sign-off</h2>

	<div class="mt-4 grid grid-cols-3 gap-3 text-center">
		<div class="rounded border border-base-300 p-3">
			<div class="text-3xl font-bold">{grade.scoreTotal}</div>
			<div class="text-xs text-base-content/70">/ 16 total</div>
		</div>
		<div class="rounded border border-base-300 p-3">
			<div class="text-3xl font-bold">{grade.manifestoSubtotal}</div>
			<div class="text-xs text-base-content/70">/ 4 manifesto</div>
		</div>
		<div class="rounded border border-base-300 p-3">
			<div class="text-3xl font-bold">{grade.principlesSubtotal}</div>
			<div class="text-xs text-base-content/70">/ 12 principles</div>
		</div>
	</div>

	<div class="mt-4 flex items-center gap-3">
		<span
			class="inline-block rounded-full border px-3 py-1 text-sm font-bold uppercase tracking-wide {bandClass}"
		>
			{bandShortLabel(grade.computedBand)}
		</span>
		<span class="text-sm text-base-content/80">{recommendationCopy(grade.computedBand)}</span>
	</div>

	{#if grade.additionalFlags.length > 0}
		<div class="mt-4">
			<h3 class="text-base font-semibold text-base-content">Readiness flags</h3>
			<ul class="mt-2 space-y-2">
				{#each grade.additionalFlags as flag (flag.flagId)}
					<li class="rounded border-l-4 border-error bg-error/10 p-2">
						<div class="text-sm font-semibold">
							{flag.category} <span class="text-xs text-base-content/60">({flag.priority})</span>
						</div>
						<div class="text-sm">{flag.description}</div>
						<div class="mt-1 text-xs text-base-content/70">
							<strong>Suggested action:</strong> {flag.suggestedAction}
						</div>
					</li>
				{/each}
			</ul>
		</div>
	{/if}

	<label class="mt-4 block text-sm">
		Signed by
		<input
			id="signedBy"
			type="text"
			class="mt-1 w-full rounded border border-base-300 p-1.5"
			placeholder="Your name"
		/>
	</label>
</section>
