import { LitElement as u, html as l, css as d, customElement as c } from "@umbraco-cms/backoffice/external/lit";
import { UmbElementMixin as p } from "@umbraco-cms/backoffice/element-api";
var m = Object.getOwnPropertyDescriptor, v = (a, t, s, o) => {
  for (var e = o > 1 ? void 0 : o ? m(t, s) : t, r = a.length - 1, n; r >= 0; r--)
    (n = a[r]) && (e = n(e) || e);
  return e;
};
let i = class extends p(u) {
  render() {
    return l`
      <div class="example-content">
        <h2>🎮 Example Hidden Content</h2>
        <p>
          This is an example of how third-party packages can register their own
          hidden content!
        </p>

        <div class="info-box">
          <h3>How to Use</h3>
          <p>Other packages can register their content by creating a manifest like this:</p>
          <pre><code>{
  type: "hiddenContent",
  alias: "YourPackage.HiddenFeature",
  name: "Your Hidden Feature",
  meta: {
    label: "Your Feature",
    description: "Description of your feature",
    icon: "icon-your-icon",
  },
  element: () => import("./your-element.js"),
}</code></pre>
        </div>

  

        <div class="features-box">
          <h3>What You Can Do</h3>
          <ul>
            <li>✅ Add developer tools</li>
            <li>✅ Create debug panels</li>
            <li>✅ Hide administrative features</li>
            <li>✅ Include easter eggs</li>
            <li>✅ Build secret utilities</li>
          </ul>
        </div>
      </div>
    `;
  }
};
i.styles = [
  d`
      .example-content {
        padding: var(--uui-size-space-4);
      }

      h2 {
        margin-top: 0;
        color: var(--uui-color-primary);
      }

      h3 {
        color: var(--uui-color-text);
        margin-top: var(--uui-size-space-4);
      }

      .info-box,
      .demo-section,
      .features-box {
        background: var(--uui-color-surface-alt);
        border-radius: var(--uui-border-radius);
        padding: var(--uui-size-space-4);
        margin: var(--uui-size-space-4) 0;
      }

      pre {
        background: var(--uui-color-surface);
        padding: var(--uui-size-space-3);
        border-radius: var(--uui-border-radius);
        overflow-x: auto;
      }

      code {
        font-family: 'Courier New', monospace;
        font-size: 0.9em;
      }

      ul {
        margin: var(--uui-size-space-2) 0;
        padding-left: var(--uui-size-space-5);
      }

      li {
        margin: var(--uui-size-space-2) 0;
      }

      .demo-section p {
        margin: var(--uui-size-space-2) 0;
      }
    `
];
i = v([
  c("oc-example-hidden-content")
], i);
const h = i;
export {
  i as ExampleHiddenContentElement,
  h as default
};
//# sourceMappingURL=example-hidden-content.element-DVMUEfti.js.map
