<script lang="ts">
	import { store } from '$lib/stores/checklist.svelte.js';
	import Fieldset from '$lib/components/ui/Fieldset.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { statusLabel } from '$lib/checklist/labels.js';

	const c = $derived(store.data);
	const flags = $derived(store.flags);
	const status = $derived(store.status);
	const highCount = $derived(flags.filter((f) => f.priority === 'high').length);
	const alertType = $derived(highCount > 0 ? 'error' : flags.length > 0 ? 'warning' : 'success');
</script>

<Fieldset legend="Step 5 — Summary">
	<p class="hint">Lifecycle status, safety flags, and team roster. Submit to generate the report.</p>

	<div class="rounded-lg border border-base-300 bg-base-200 p-4 text-sm text-base-content">
		<p><strong>Status:</strong> {statusLabel(status)}</p>
		<p><strong>Procedure:</strong> {c.plannedProcedure || '—'}</p>
		<p><strong>Theatre:</strong> {c.siteName || '—'} · {c.operatingRoom || '—'}</p>
		<p><strong>Urgency:</strong> {c.urgency || '—'} · <strong>Laterality:</strong> {c.laterality || '—'}</p>
		<p>
			<strong>Sign In:</strong>
			{c.signInCompletedAt ? `${c.signInCoordinatorName} — ${c.signInCompletedAt}` : 'pending'}
		</p>
		<p>
			<strong>Time Out:</strong>
			{c.timeOutCompletedAt ? `${c.timeOutCoordinatorName} — ${c.timeOutCompletedAt}` : 'pending'}
		</p>
		<p>
			<strong>Sign Out:</strong>
			{c.signOutCompletedAt ? `${c.signOutCoordinatorName} — ${c.signOutCompletedAt}` : 'pending'}
		</p>
	</div>

	<div class="mt-4">
		<Alert type={alertType} heading={flags.length === 0 ? 'No safety flags raised.' : `Safety flags (${flags.length}${highCount > 0 ? `, ${highCount} high priority` : ''})`}>
			{#if flags.length > 0}
				<ul class="mt-1 list-inside list-disc space-y-1 text-sm">
					{#each flags as f (f.flag)}
						<li><span class="font-medium">[{f.priority.toUpperCase()}]</span> {f.message}</li>
					{/each}
				</ul>
			{/if}
		</Alert>
	</div>

	{#if c.teamMembers.length > 0}
		<h3 class="mt-6 mb-2 text-lg font-semibold text-base-content">Operating team roster</h3>
		<ul class="list-inside list-disc space-y-1 text-sm text-base-content/80">
			{#each c.teamMembers as m, i (i)}
				<li>
					{m.name || '—'} <span class="text-base-content/60">({m.role || '—'})</span>
					— introduced: {m.introducedDuringTimeOut || '—'}
				</li>
			{/each}
		</ul>
	{/if}

	{#if c.abandonedReason}
		<div class="mt-4">
			<Alert type="error" heading="Case abandoned">{c.abandonedReason}</Alert>
		</div>
	{/if}
</Fieldset>
