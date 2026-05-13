<script lang="ts">
	let backendUrl = $state('http://localhost:5150');
	let jsonlText = $state('');
	let submitting = $state(false);

	interface RejectedRow {
		lineNumber: number;
		error: string;
		rawLine?: string;
	}

	interface ImportResponse {
		accepted: number;
		rejected: RejectedRow[];
		totalLines: number;
		skippedBlank: number;
		skippedComment: number;
	}

	let result = $state<ImportResponse | null>(null);
	let error = $state<string | null>(null);

	async function importJsonl() {
		submitting = true;
		result = null;
		error = null;
		try {
			const base = backendUrl.replace(/\/+$/, '');
			const res = await fetch(`${base}/api/bulk-import`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/x-ndjson' },
				body: jsonlText,
			});
			if (!res.ok) {
				const body = await res.text();
				throw new Error(`${res.status} ${res.statusText} — ${body.slice(0, 200)}`);
			}
			result = (await res.json()) as ImportResponse;
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		} finally {
			submitting = false;
		}
	}

	async function onFileChange(e: Event) {
		const target = e.currentTarget as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;
		jsonlText = await file.text();
	}
</script>

<svelte:head>
	<title>Bulk import — Agile Consulting Dashboard</title>
</svelte:head>

<main class="max-w-3xl mx-auto px-4 py-6">
	<header class="flex items-baseline justify-between gap-3">
		<h1 class="text-2xl font-bold text-slate-800">Bulk import scorecards</h1>
		<a href="/" class="text-sm text-blue-600">← Back to dashboard</a>
	</header>
	<p class="text-sm text-slate-600 mt-1">
		Upload or paste a JSON-Lines document (one assessment per line). Blank lines
		and lines starting with <code>#</code> are skipped silently. Posted to the
		Rust axum server's <code>/api/bulk-import</code> endpoint, which validates
		every row, scores it, and persists the accepted rows so the dashboard
		reflects the import.
	</p>

	<section class="bg-white border border-slate-300 rounded p-4 mt-4">
		<h2 class="text-lg font-semibold text-slate-800">Backend</h2>
		<input
			type="url"
			class="w-full mt-2 p-1.5 rounded border border-slate-300 text-sm"
			bind:value={backendUrl}
			placeholder="http://localhost:5150"
		/>
	</section>

	<section class="bg-white border border-slate-300 rounded p-4 mt-4">
		<h2 class="text-lg font-semibold text-slate-800">Document</h2>
		<input type="file" accept=".jsonl,application/x-ndjson,application/json,text/plain" onchange={onFileChange} class="mt-2 text-sm" />
		<textarea
			class="w-full mt-2 p-2 rounded border border-slate-300 font-mono text-xs"
			rows="10"
			placeholder={'# one JSON object per line\n{"organization":{…},"respondent":{…},…}\n{"organization":{…},…}'}
			bind:value={jsonlText}
		></textarea>
		<div class="mt-3 flex gap-2">
			<button
				type="button"
				class="px-4 py-2 rounded bg-blue-500 text-white disabled:opacity-50"
				disabled={submitting || jsonlText.trim().length === 0}
				onclick={importJsonl}
			>
				{submitting ? 'Importing…' : 'Import'}
			</button>
			<button
				type="button"
				class="px-3 py-2 rounded border border-slate-300 bg-white text-slate-700"
				onclick={() => { jsonlText = ''; result = null; error = null; }}
			>
				Clear
			</button>
		</div>
		{#if error}
			<p class="mt-2 text-sm text-red-700">{error}</p>
		{/if}
	</section>

	{#if result}
		<section class="bg-white border border-slate-300 rounded p-4 mt-4">
			<h2 class="text-lg font-semibold text-slate-800">Import summary</h2>
			<div class="grid grid-cols-4 gap-3 mt-3 text-center">
				<div class="rounded border border-slate-300 p-3">
					<div class="text-2xl font-bold text-green-700">{result.accepted}</div>
					<div class="text-xs text-slate-600">accepted</div>
				</div>
				<div class="rounded border border-slate-300 p-3">
					<div class="text-2xl font-bold text-red-700">{result.rejected.length}</div>
					<div class="text-xs text-slate-600">rejected</div>
				</div>
				<div class="rounded border border-slate-300 p-3">
					<div class="text-2xl font-bold text-slate-700">{result.skippedBlank}</div>
					<div class="text-xs text-slate-600">blank lines</div>
				</div>
				<div class="rounded border border-slate-300 p-3">
					<div class="text-2xl font-bold text-slate-700">{result.skippedComment}</div>
					<div class="text-xs text-slate-600">comments</div>
				</div>
			</div>
			<p class="mt-3 text-sm text-slate-600">
				Processed {result.totalLines} line{result.totalLines === 1 ? '' : 's'} total.
			</p>
		</section>

		{#if result.rejected.length > 0}
			<section class="bg-red-50 border border-red-200 rounded p-4 mt-4">
				<h2 class="text-lg font-semibold text-red-900">Rejected rows</h2>
				<ul class="mt-2 space-y-2 text-sm">
					{#each result.rejected as row (row.lineNumber)}
						<li>
							<strong>Line {row.lineNumber}</strong>: {row.error}
						</li>
					{/each}
				</ul>
			</section>
		{/if}

		{#if result.accepted > 0}
			<p class="mt-3 text-sm text-slate-700">
				<a href="/" class="text-blue-600 underline">View the dashboard</a>
				to see your imported rows alongside the seed data.
			</p>
		{/if}
	{/if}
</main>
