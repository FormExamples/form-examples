<script lang="ts">
	// The app root is a welcome page: it explains the work and offers prominent
	// links to the two working surfaces — the assessment form and the clinician
	// dashboard.
	const plural = 'recognition-of-stroke-in-the-emergency-rooms';
</script>

<main class="mx-auto max-w-4xl px-4 py-12">
	<header class="mb-10">
		<p class="text-sm font-semibold uppercase tracking-wide text-primary">
			Recognition Of Stroke In the Emergency Room
		</p>
		<h1 class="mt-2 text-3xl font-bold text-base-content">ROSIER bedside stroke-recognition screen</h1>
		<p class="mt-4 text-base leading-relaxed text-base-content/70">
			A bedside stroke-recognition screen for adults presenting acutely, completed as a single
			continuous wizard. Two mimic-exclusion criteria — loss of consciousness / syncope and seizure
			activity — subtract 1 point each; five acute-onset neurological signs — asymmetric facial, arm,
			and leg weakness, speech disturbance, and visual field defect — add 1 point each, for a signed
			total of &minus;2 to +5. Blood glucose is measured first to exclude the hypoglycaemia mimic.
			The shared engine sums the score, derives the band, and flags ROSIER &gt; 0 as a positive
			screen (stroke likely) that activates the acute stroke pathway.
		</p>
	</header>

	<div class="grid gap-4 sm:grid-cols-2">
		<a
			href="/recognition-of-stroke-in-the-emergency-room/{plural}/new"
			class="group rounded-lg border border-primary bg-primary p-6 text-primary-content shadow-sm transition hover:opacity-90"
		>
			<h2 class="text-lg font-semibold">Start a new assessment</h2>
			<p class="mt-2 text-sm text-primary-content/80">
				Open the step-by-step ROSIER screen. One continuous single-page wizard that scores the
				patient as you complete it.
			</p>
			<span class="mt-4 inline-block text-sm font-semibold">Open the form →</span>
		</a>
		<a
			href="/recognition-of-stroke-in-the-emergency-room/{plural}"
			class="group rounded-lg border border-base-300 bg-base-100 p-6 text-base-content shadow-sm transition hover:border-primary hover:shadow"
		>
			<h2 class="text-lg font-semibold">Clinician dashboard</h2>
			<p class="mt-2 text-sm text-base-content/70">
				Browse assessed patients with their computed ROSIER score and band, and filter by care
				setting and band.
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
					Capture the two mimic criteria and five neurological signs and produce a graded report —
					signed score &minus;2 to +5, band, and flagged issues — to support timely activation of the
					acute stroke pathway.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Specification</dt>
				<dd class="mt-1 text-base-content/70">
					Spec-driven: the living domain spec defines the data model, the signed additive scoring
					engine, and the flag rules. The same engine grades both the form and the dashboard.
				</dd>
			</div>
			<div>
				<dt class="font-semibold text-base-content">Documentation</dt>
				<dd class="mt-1 text-base-content/70">
					Drawn from Nor et al. (Lancet Neurology 2005), NICE NG128, and the RCP National Clinical
					Guideline for Stroke. A screening prompt, not a diagnosis.
				</dd>
			</div>
		</dl>
	</section>
</main>
