<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the report wizard and the reports
	// dashboard.
</script>

<main class="mx-16 px-4 py-12">

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/colonoscopy-test-result/report"
			class="group rounded-lg border border-primary bg-primary p-6 text-white shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">New report</h2>
			<p class="mt-2 text-sm text-white/80">
				Step through the colonoscopy report wizard — procedure, findings, polyps and tissue, and
				impression — and get the computed four-axis grade and safety flags.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/colonoscopy-test-result/reports"
			class="group rounded-lg border border-gray-200 bg-white p-6 text-gray-900 shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Reports dashboard</h2>
			<p class="mt-2 text-sm text-gray-600">
				Browse graded colonoscopy reports and filter by Classification and Follow-up urgency to
				find the reports that need attention first.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold text-primary">Open the dashboard →</span>
		</a>
	</div>

	<section class="mt-12">
		<h2 class="text-lg font-semibold text-gray-900">About this work</h2>
		<dl class="mt-4 space-y-4 text-sm">
			<div>
				<dt class="font-semibold text-gray-900">Purpose</dt>
				<dd class="mt-1 text-gray-600">
					Capturing lower-GI endoscopy findings — including bowel-preparation quality, sedation,
					clinical history, polyp count, size, and the extent reached, and any biopsy or
					polypectomy performed — in a structured form and grading them consistently supports
					early recognition of critical findings such as an obstructing or suspicious mass, and
					helps gastroenterology and colorectal-surgery teams apply consistent, KPI-aligned
					surveillance and follow-up.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-gray-900">Specification</dt>
				<dd class="mt-1 text-gray-600">
					This form is spec-driven: the living domain spec defines the data model, the four-axis
					grading engine, and the flag rules, and the same engine grades both the report wizard
					and the reports dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-gray-900">Documentation</dt>
				<dd class="mt-1 text-gray-600">
					Aligned with the BSG / ACPGBI / JAG UK key performance indicators and quality assurance
					standards for colonoscopy, the BSG / ACPGBI / PHE post-polypectomy and
					post-colorectal-cancer-resection surveillance guidelines, and the BSG Endoscopy Quality
					Improvement Programme (EQIP).
				</dd>
			</div>
		</dl>
	</section>
</main>
