<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import BulgariaEdinenGrazhdanskiNomerView from './BulgariaEdinenGrazhdanskiNomerView.svelte';

  const { Story } = defineMeta({
    title: 'Headless/BulgariaEdinenGrazhdanskiNomerView',
    component: BulgariaEdinenGrazhdanskiNomerView,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Bulgaria Edinen Grazhdanski Nomer View'}}
/>
