<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import ProductCard from './ProductCard.svelte';

  const { Story } = defineMeta({
    title: 'Headless/ProductCard',
    component: ProductCard,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{
    name: 'Linen Pillow',
    price: '$24.00',
  }}
>
  <p>Soft and breathable linen pillow.</p>
</Story>
