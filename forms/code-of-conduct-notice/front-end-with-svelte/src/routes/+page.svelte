<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the acknowledgement form and the
	// compliance dashboard. The collection routes (`/code-of-conduct-notices`
	// and `/code-of-conduct-notices/new`) hold the actual functionality.
	const plural = 'code-of-conduct-notices';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">Code of Conduct Notice</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">Read-and-acknowledge notice</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A read-and-acknowledge code of conduct notice presenting the twelve core principles that
			medical-service providers and supporting staff must uphold, completed as a single continuous
			wizard: recipient details, the code of conduct notice itself, and acknowledgement with
			signature capture. The shared engine validates completeness, derives a Complete / Incomplete
			status, and flags issues for the compliance officer.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new notice</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step notice. One continuous single-page wizard that records the
				recipient's acknowledgement and signature.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Compliance dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse recipients with their computed completeness status, and filter by status and
				acknowledgement.
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
					Present the twelve core code of conduct principles and capture a recipient's
					acknowledgement and signature, producing a validated Complete / Incomplete record to
					support compliance review.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the completeness validation
					engine, and the flag rules. The same engine validates both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Read-and-acknowledge notice for medical-service providers, employed staff, contractors,
					eligible family members, and re-employed annuitants.
				</dd>
			</div>
		</dl>
	</section>
</main>
