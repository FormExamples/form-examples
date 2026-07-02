<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the screening form and the clinician
	// dashboard.
	const plural = 'fit-screenings';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			Bowel Cancer Screening with FIT
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">
			NHS Bowel Cancer Screening Programme result classification
		</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			Record a home faecal immunochemical test (FIT) kit outcome in a single continuous wizard —
			eligibility, kit return and adequacy, and the measured faecal haemoglobin concentration
			(&micro;g Hb/g). The shared engine classifies the result against the programme threshold
			(&ge; 120 &micro;g Hb/g positive) and sets a management action: negative &rarr; routine
			two-yearly recall, positive &rarr; refer for colonoscopy, spoilt or not returned &rarr; repeat
			kit. Red-flag symptoms route to the urgent suspected-cancer pathway regardless of the FIT
			result.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new screening record</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step form. One continuous single-page wizard that classifies the FIT result
				as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form &rarr;</span>
		</a>
		<a
			href="/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse screening episodes with their computed result class and management action, and filter
				by hub and result.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold text-primary">Open the dashboard &rarr;</span>
		</a>
	</div>

	<section class="mt-12">
		<h2 class="text-lg font-semibold text-base-content">About this work</h2>
		<dl class="mt-4 space-y-4 text-sm">
			<div>
				<dt class="font-semibold text-base-content">Purpose</dt>
				<dd class="mt-1 text-base-content/70">
					Document and classify a home FIT screening result — result class, management action, and
					flagged issues — to support the screening episode. It documents and classifies a screening
					result; it is not a diagnostic test.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the priority-ordered
					classification algorithm, and the flag rules. The same engine grades both the form and the
					dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Drawn from NHS Bowel Cancer Screening Programme operational standards (screening threshold
					&ge; 120 &micro;g Hb/g), NICE DG56 (symptomatic threshold &ge; 10 &micro;g Hb/g), and NICE
					NG151. An aid for information only; interpret in the clinical context.
				</dd>
			</div>
		</dl>
	</section>
</main>
