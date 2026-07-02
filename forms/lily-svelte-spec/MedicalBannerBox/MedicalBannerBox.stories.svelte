<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import MedicalBannerBox from './MedicalBannerBox.svelte';

  const { Story } = defineMeta({
    title: 'Headless/MedicalBannerBox',
    component: MedicalBannerBox,
  });
</script>

<Story
  name="Default"
  tags={['autodocs', '!dev']}
  args={{'label':'Medical Banner Box'}}
>
  <p>Banner message</p>
</Story>
