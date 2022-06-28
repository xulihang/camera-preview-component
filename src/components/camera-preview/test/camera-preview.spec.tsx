import { newSpecPage } from '@stencil/core/testing';
import { CameraPreview } from '../camera-preview';

describe('camera-preview', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [CameraPreview],
      html: `<camera-preview></camera-preview>`,
    });
    expect(page.root).toEqualHtml(`
      <camera-preview>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </camera-preview>
    `);
  });
});
