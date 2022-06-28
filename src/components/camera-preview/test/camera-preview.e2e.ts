import { newE2EPage } from '@stencil/core/testing';

describe('camera-preview', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<camera-preview></camera-preview>');

    const element = await page.find('camera-preview');
    expect(element).toHaveClass('hydrated');
  });
});
