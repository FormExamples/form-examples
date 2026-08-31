<script lang="ts">
  import { page } from '$app/state';
  import { navLinks } from '$lib/site';

  type Props = { open?: boolean; onClose?: () => void };
  let { open = false, onClose }: Props = $props();

  function isActive(href: string): boolean {
    const current = page.url.pathname;
    if (href === '/') return current === '/';
    return current.startsWith(href);
  }
</script>

<!-- Mobile backdrop -->
{#if open}
  <div
    class="fixed inset-0 top-14 z-20 bg-base-content/40 md:hidden"
    role="presentation"
    aria-hidden="true"
    onclick={() => onClose?.()}
    onkeydown={(e) => e.key === 'Escape' && onClose?.()}
  ></div>
{/if}

<aside
  class="fixed left-0 top-14 z-20 h-[calc(100vh-3.5rem)] w-60 border-r border-base-300 bg-base-100 transition-transform md:sticky md:translate-x-0
    {open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}"
  aria-label="Section navigation"
>
  <nav class="p-4">
    <ul class="space-y-1">
      {#each navLinks as link}
        <li>
          <a
            href={link.href}
            class="block rounded-md px-3 py-2 text-sm hover:no-underline
              {isActive(link.href)
                ? 'bg-primary/10 font-medium text-primary'
                : 'text-base-content hover:bg-base-200'}"
            onclick={() => onClose?.()}
          >
            {link.label}
          </a>
        </li>
      {/each}
    </ul>
  </nav>
</aside>
