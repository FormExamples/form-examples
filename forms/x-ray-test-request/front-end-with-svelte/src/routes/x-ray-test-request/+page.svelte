<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the request form and the vetting
	// dashboard. The collection routes (`/x-ray-test-requests` and
	// `/x-ray-test-requests/new`) hold the actual functionality.
	const plural = 'x-ray-test-requests';
</script>

<main class="mx-16 px-4 py-12">

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/x-ray-test-request/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new request</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step request form. One continuous single-page wizard that grades the
				request as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/x-ray-test-request/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Vetting dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse incoming requests with their computed four-axis grades, and filter by triage tier and
				radiation-safety band.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold text-primary">Open the dashboard →</span>
		</a>
	</div>

	<section class="mt-12">
		<h2 class="text-lg font-semibold text-base-content">About this work</h2>
		<dl class="mt-4 space-y-4 text-sm">
			<div>
				<dt class="font-semibold text-base-content">Purpose</dt>
				<dd class="mt-1 text-base-content/70">
					Capture why a plain radiograph is requested and how urgently — the requested examination
					(body region, laterality, and indication), the specific clinical question, the
					radiation-safety context (pregnancy status, recent similar imaging, and the IR(ME)R
					justification), and triage details — justify the ionising-radiation exposure, and produce
					a vetting report the imaging team can triage and book from.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the four-axis grading engine,
					and the safety-critical flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Aligned with the ACR Appropriateness Criteria / RCR iRefer guidance and IR(ME)R 2017
					(justification of medical exposures, including the pregnancy procedure).
				</dd>
			</div>
		</dl>
	</section>
</main>
