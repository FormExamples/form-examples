<script lang="ts">
  type Props = { title: string; href: string; description: string };
  let { title, href, description }: Props = $props();
</script>

<a
  {href}
  target="_blank"
  rel="noopener noreferrer"
  class="block rounded-lg border border-base-300 p-5 no-underline transition hover:border-primary hover:shadow-sm"
>
  <div class="font-semibold text-base-content">{title}</div>
  <p class="mt-2 text-sm text-muted">{description}</p>
</a>
