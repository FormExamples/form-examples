<script lang="ts">
    // ProductCard component
    //
    // A headless specialized card for displaying a product with image, title,
    // price, and additional content. Renders an `<article>` landmark with an
    // accessible name from `name` (or `label` override) and a header containing
    // the product name and pre-formatted price.
    //
    // Props:
    //   class — string, optional. CSS class appended to the base class.
    //   name — string, REQUIRED. Product name.
    //   price — string, REQUIRED. Pre-formatted price text (consumer formats currency).
    //   imageUrl — string, optional. Product image source.
    //   imageAlt — string, optional. Image alt text.
    //   label — string, optional. aria-label override (defaults to name).
    //   children — Snippet, optional. Additional content (description, actions).
    //   ...restProps — additional HTML attributes spread onto the <article>.
    //
    // Syntax:
    //   <ProductCard name="Pillow" price="$24.00" imageUrl="…" imageAlt="…" />
    //
    // Examples:
    //   <ProductCard name="Pillow" price="$24.00" imageUrl="/p.jpg" imageAlt="Linen pillow">
    //     <p>Soft and breathable linen pillow.</p>
    //     <Button>Add to cart</Button>
    //   </ProductCard>
    //
    // Keyboard:
    //   - None on the container; interactive children manage their own keyboard
    //
    // Accessibility:
    //   - <article> is a landmark, gets an accessible name from aria-label
    //   - Image must have alt text supplied by consumer
    //
    // Internationalization:
    //   - Name, price, alt come through props
    //
    // Claude rules:
    //   - Headless: no styles
    //   - Currency formatting is the consumer's responsibility
    //
    // References:
    //   - MDN <article>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/article

    import type { Snippet } from "svelte";

    let {
        class: className = "",
        name,
        price,
        imageUrl = undefined,
        imageAlt = undefined,
        label = undefined,
        children = undefined,
        ...restProps
    }: {
        /** Product name (required) */
        name: string;
        /** Pre-formatted price text (required) */
        price: string;
        /** Product image source */
        imageUrl?: string;
        /** Product image alt text */
        imageAlt?: string;
        /** aria-label override (defaults to name) */
        label?: string;
        /** Additional content (description, actions) */
        children?: Snippet;
        [key: string]: unknown;
    } = $props();
</script>

<!-- ProductCard.svelte -->
<article
    class={`product-card ${className}`}
    aria-label={label || name}
    {...restProps}
>
    {#if imageUrl}
        <img class="product-card-image" src={imageUrl} alt={imageAlt ?? ""} />
    {/if}
    <header class="product-card-header">
        <h3 class="product-card-name">{name}</h3>
        <p class="product-card-price">{price}</p>
    </header>
    {#if children}
        {@render children?.()}
    {/if}
</article>
