import { html as c, unsafeHTML as V, css as ft, state as u, property as Y, customElement as _t } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as bt } from "@umbraco-cms/backoffice/lit-element";
import { UmbChangeEvent as K } from "@umbraco-cms/backoffice/event";
import { UmbDocumentDetailRepository as vt, UmbDocumentItemRepository as yt, UMB_DOCUMENT_WORKSPACE_CONTEXT as Ht } from "@umbraco-cms/backoffice/document";
import { UMB_PROPERTY_DATASET_CONTEXT as xt } from "@umbraco-cms/backoffice/property";
import { UmbMediaDetailRepository as Tt } from "@umbraco-cms/backoffice/media";
import { UmbTextStyles as wt } from "@umbraco-cms/backoffice/style";
import { UmbPropertyEditorConfigCollection as Ut } from "@umbraco-cms/backoffice/property-editor";
var Ct = Object.defineProperty, kt = Object.getOwnPropertyDescriptor, j = (t) => {
  throw TypeError(t);
}, p = (t, i, e, a) => {
  for (var n = a > 1 ? void 0 : a ? kt(i, e) : i, l = t.length - 1, g; l >= 0; l--)
    (g = t[l]) && (n = (a ? g(i, e, n) : g(n)) || n);
  return a && n && Ct(i, e, n), n;
}, W = (t, i, e) => i.has(t) || j("Cannot " + e), r = (t, i, e) => (W(t, i, "read from private field"), e ? e.call(t) : i.get(t)), d = (t, i, e) => i.has(t) ? j("Cannot add the same private member more than once") : i instanceof WeakSet ? i.add(t) : i.set(t, e), m = (t, i, e, a) => (W(t, i, "write to private field"), i.set(t, e), e), o = (t, i, e) => (W(t, i, "access private method"), e), $t = (t, i, e, a) => ({
  set _(n) {
    m(t, i, n);
  },
  get _() {
    return r(t, i, a);
  }
}), s, J, x, w, $, b, U, y, _, D, P, B, A, L, H, Q, Z, C, z, R, tt, E, it, et, N, M, I, v, st, ot, at, nt, rt, lt, k, ht, S, T, dt, pt, ct, gt, ut;
const O = 400, q = 0.75, G = 6, X = 200, At = 2e3, Et = 100, Mt = 2e3, It = {
  north: 100,
  south: 0,
  east: 100,
  west: 0
}, St = {
  Red: 1,
  Green: 2,
  Blue: 3,
  Orange: 4
  /* Orange */
};
let h = class extends bt {
  /**
   * Constructor - initializes the element
   */
  constructor() {
    super(), d(this, s), this._configCollection = new Ut([
      {
        alias: "hideLabel",
        value: !0
      },
      { alias: "dimensions", value: { height: 300 } },
      { alias: "maxImageSize", value: 500 },
      { alias: "ignoreUserStartNodes", value: !1 },
      {
        alias: "toolbar",
        value: [
          [
            ["Umb.Tiptap.Toolbar.SourceEditor"],
            ["Umb.Tiptap.Toolbar.Bold", "Umb.Tiptap.Toolbar.Italic", "Umb.Tiptap.Toolbar.Underline"],
            ["Umb.Tiptap.Toolbar.TextAlignLeft", "Umb.Tiptap.Toolbar.TextAlignCenter", "Umb.Tiptap.Toolbar.TextAlignRight"],
            ["Umb.Tiptap.Toolbar.BulletList", "Umb.Tiptap.Toolbar.OrderedList"],
            ["Umb.Tiptap.Toolbar.Blockquote", "Umb.Tiptap.Toolbar.HorizontalRule"],
            ["Umb.Tiptap.Toolbar.Link", "Umb.Tiptap.Toolbar.Unlink"],
            ["Umb.Tiptap.Toolbar.MediaPicker", "Umb.Tiptap.Toolbar.EmbeddedMedia"]
          ]
        ]
      },
      {
        alias: "extensions",
        value: [
          "Umb.Tiptap.RichTextEssentials",
          "Umb.Tiptap.Blockquote",
          "Umb.Tiptap.Bold",
          "Umb.Tiptap.BulletList",
          "Umb.Tiptap.Embed",
          "Umb.Tiptap.Figure",
          "Umb.Tiptap.HorizontalRule",
          "Umb.Tiptap.Image",
          "Umb.Tiptap.Italic",
          "Umb.Tiptap.Link",
          "Umb.Tiptap.MediaUpload",
          "Umb.Tiptap.OrderedList",
          "Umb.Tiptap.Subscript",
          "Umb.Tiptap.Superscript",
          "Umb.Tiptap.TextAlign",
          "Umb.Tiptap.Underline"
        ]
      }
    ]), this._imgWidth = O, this._imgHeight = 0, this._imgTheme = 1, this._isAddingHotspot = !1, this._mapBounds = { ...It }, this._hasUnsavedChanges = !1, this._value = {
      image: null,
      width: null,
      height: null,
      bounds: null,
      hotspots: []
    }, d(this, x), d(this, w), d(this, $), d(this, b, !1), d(this, U), d(this, y), d(this, _, 0), d(this, D, new vt(this)), d(this, P, new yt(this)), d(this, B, new Tt(this)), this.coordinateConverter = {
      /**
       * Converts pixel coordinates to geographic coordinates based on configured map bounds
       * @param x - Pixel X coordinate
       * @param y - Pixel Y coordinate  
       * @returns Geographic coordinates
       * @throws Error if image dimensions are invalid
       */
      pixelToLatLng: (t, i) => {
        if (!o(this, s, C).call(this))
          throw new Error("Invalid image dimensions for coordinate conversion");
        const e = this._mapBounds.north - i / this._imgHeight * (this._mapBounds.north - this._mapBounds.south), a = this._mapBounds.west + t / this._imgWidth * (this._mapBounds.east - this._mapBounds.west);
        return { lat: e, lng: a };
      },
      /**
       * Converts geographic coordinates to pixel coordinates for display
       * @param lat - Latitude
       * @param lng - Longitude
       * @returns Pixel coordinates
       * @throws Error if image dimensions are invalid
       */
      latLngToPixel: (t, i) => {
        if (!o(this, s, C).call(this))
          throw new Error("Invalid image dimensions for coordinate conversion");
        const e = (this._mapBounds.north - t) / (this._mapBounds.north - this._mapBounds.south) * this._imgHeight;
        return { x: (i - this._mapBounds.west) / (this._mapBounds.east - this._mapBounds.west) * this._imgWidth, y: e };
      }
    }, this.eventHandlers = {
      /**
       * Handles clicks on the image area for adding new hotspots
       */
      imageClick: (t) => {
        this._isAddingHotspot && (o(this, s, Q).call(this, t.offsetX, t.offsetY), this._isAddingHotspot = !1);
      },
      /**
       * Handles clicks on hotspot markers
       */
      hotspotClick: (t, i) => {
        t.stopPropagation(), o(this, s, L).call(this, i);
      },
      /**
       * Handles drag end events for hotspot repositioning
       */
      hotspotDragEnd: (t, i) => {
        const e = o(this, s, it).call(this, t);
        e && o(this, s, Z).call(this, i, e);
      },
      /**
       * Handles title input changes - updates editing state only
       */
      titleInput: (t) => {
        const i = t.target, e = o(this, s, E).call(this, i.value, X);
        this._selectedHotspot && (this._editingHotspot = {
          ...this._editingHotspot,
          title: e
        }, this._hasUnsavedChanges = !0, this.requestUpdate());
      },
      /**
       * Handles rich text editor changes for descriptions - updates editing state only
       */
      descriptionChange: (t) => {
        if (this._selectedHotspot && this._editingHotspot) {
          const i = t.target.value, e = o(this, s, E).call(this, i || "", At);
          this._editingHotspot = {
            ...this._editingHotspot,
            description: e
          }, this._hasUnsavedChanges = !0, this.requestUpdate();
        }
      }
    }, d(this, M, () => {
      const t = this.value.hotspots.length;
      if (t === 0)
        return;
      confirm(
        `Are you sure you want to delete all ${t} hotspot${t > 1 ? "s" : ""}? This action cannot be undone.`
      ) && (o(this, s, A).call(this, { hotspots: [] }), this._selectedHotspot = void 0, this._editingHotspot = void 0, this._hasUnsavedChanges = !1);
    }), d(this, I, () => {
      this._hasUnsavedChanges && this._editingHotspot && o(this, s, H).call(this), this._isAddingHotspot = !this._isAddingHotspot, this._selectedHotspot = void 0, this._editingHotspot = void 0, this._hasUnsavedChanges = !1, this.requestUpdate();
    });
  }
  set config(t) {
    this._config = t, o(this, s, v).call(this);
  }
  get config() {
    return this._config;
  }
  set value(t) {
    this._value = o(this, s, J).call(this, t), this.requestUpdate();
  }
  get value() {
    return this._value;
  }
  // Lifecycle methods
  /**
   * Component connection lifecycle method
   * Sets up document workspace context and initial configuration
   */
  connectedCallback() {
    super.connectedCallback(), this.consumeContext(Ht, (t) => {
      m(this, x, t), o(this, s, v).call(this);
    }), this.consumeContext(xt, (t) => {
      m(this, w, t), m(this, y, void 0), m(this, b, !1), o(this, s, v).call(this);
    }), this._config && o(this, s, v).call(this);
  }
  /**
   * Component disconnection lifecycle method - saves any pending changes
   */
  disconnectedCallback() {
    this._hasUnsavedChanges && this._editingHotspot && o(this, s, H).call(this), super.disconnectedCallback();
  }
  /**
   * Main render method - orchestrates the rendering of all UI components
   * @returns Lit template result for the custom map editor
   */
  render() {
    const t = this.value?.hotspots || [];
    return c`
      <div class="imagehotspot-editor theme${this._imgTheme}">
        <div class="imagehotspot-controls">
          <div class="controls-left">
            <button 
              type="button" 
              class="imagehotspot-btn ${this._isAddingHotspot ? "active" : ""}" 
              @click="${r(this, I)}">
              ${this._isAddingHotspot ? "Cancel Adding" : "Add Hotspot"}
            </button>
            ${t.length > 0 ? c`
              <button 
                type="button" 
                class="imagehotspot-btn-danger" 
                @click="${r(this, M)}"
                title="Delete all hotspots">
                Delete All
              </button>
            ` : ""}
          </div>
          <span class="imagehotspot-count">${t.length} hotspot${t.length !== 1 ? "s" : ""}</span>
        </div>

        <div class="imagehotspot-image ${this._isAddingHotspot ? "adding-mode" : ""}" @click="${this.eventHandlers.imageClick}">
          ${this._imgSrc ? c`
              <img src="${this._imgSrc}" width="${this._imgWidth}" height="${this._imgHeight}" style="display: block;" />
            ` : c`
              <div class="imagehotspot-placeholder-image">
                <div style="padding: 20px; text-align: center; color: #666;">
                  No image configured<br/>
                  <small>Check the imageSrc property configuration</small>
                </div>
              </div>
            `}

           ${o(this, s, dt).call(this)}
        </div>

        ${this._selectedHotspot ? c`
          <div class="imagehotspot-panel">
            <div class="panel-content">
              <div style="margin-bottom: 16px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 500;">Hotspot Title</label>
                <p style="font-size: 12px; color: #666; margin-bottom: 8px;">Optional title shown above the description</p>
                <input 
                  type="text" 
                  .value=${this._editingHotspot?.title || ""}
                  @input=${this.eventHandlers.titleInput}
                  placeholder="Enter hotspot title"
                  style="width: 100%; padding: 8px; border: 1px solid #d8d7d9; border-radius: 3px; font-size: 13px;"
                  maxlength="${X}">
              </div>
         
              <div style="margin-bottom: 16px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 500;">Hotspot Details</label>
                <p style="font-size: 12px; color: #666; margin-bottom: 8px;">Details about this specific hotspot</p>
        
                <umb-input-tiptap
                    .configuration=${this._configCollection}
                    .value=${this._editingHotspot?.description || ""}
                    @change=${this.eventHandlers.descriptionChange}>
                 </umb-input-tiptap>
              </div>

              ${this._hasUnsavedChanges ? c`
                <div style="margin-bottom: 16px;">
                  <button 
                    type="button" 
                    class="imagehotspot-btn" 
                    @click="${() => o(this, s, H).call(this)}">
                    Save Changes
                  </button>
                  <span style="margin-left: 8px; font-size: 12px; color: #666;">
                    You have unsaved changes${this._editingHotspot && this.value.hotspots.find((i) => i.id === this._selectedHotspot) && (this._editingHotspot.lat !== this.value.hotspots.find((i) => i.id === this._selectedHotspot)?.lat || this._editingHotspot.lng !== this.value.hotspots.find((i) => i.id === this._selectedHotspot)?.lng) ? " (includes position changes)" : ""}
                  </span>
                </div>
              ` : ""}
            </div>
          </div>
        ` : ""}

        ${t.length > 0 ? c`
          <div class="hotspots-table-container">
            <h4>Hotspots Summary</h4>
            <table class="hotspots-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title and Details</th>
                  <th>Latitude</th>
                  <th>Longitude</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${o(this, s, ct).call(this)}
              </tbody>
            </table>
          </div>
        ` : ""}
      </div>
    `;
  }
};
s = /* @__PURE__ */ new WeakSet();
J = function(t) {
  return !t || typeof t != "object" ? {
    image: null,
    width: null,
    height: null,
    bounds: null,
    hotspots: []
  } : {
    image: t.image || null,
    width: t.width || null,
    height: t.height || null,
    bounds: t.bounds || null,
    hotspots: Array.isArray(t.hotspots) ? t.hotspots : []
  };
};
x = /* @__PURE__ */ new WeakMap();
w = /* @__PURE__ */ new WeakMap();
$ = /* @__PURE__ */ new WeakMap();
b = /* @__PURE__ */ new WeakMap();
U = /* @__PURE__ */ new WeakMap();
y = /* @__PURE__ */ new WeakMap();
_ = /* @__PURE__ */ new WeakMap();
D = /* @__PURE__ */ new WeakMap();
P = /* @__PURE__ */ new WeakMap();
B = /* @__PURE__ */ new WeakMap();
A = function(t) {
  this.value = { ...this.value, ...t }, this.dispatchEvent(new K()), this.requestUpdate();
};
L = function(t) {
  if (this._hasUnsavedChanges && this._editingHotspot && o(this, s, H).call(this), this._selectedHotspot === t)
    this._selectedHotspot = void 0, this._editingHotspot = void 0;
  else {
    this._selectedHotspot = t;
    const i = this.value.hotspots.find((e) => e.id === t);
    i && (this._editingHotspot = { ...i });
  }
  this._hasUnsavedChanges = !1, this.requestUpdate();
};
H = function() {
  if (!this._editingHotspot || !this._selectedHotspot) return;
  const t = this.value.hotspots.map(
    (i) => i.id === this._selectedHotspot ? { ...this._editingHotspot } : i
  );
  o(this, s, A).call(this, { hotspots: t }), this._hasUnsavedChanges = !1;
};
Q = function(t, i) {
  if (!o(this, s, C).call(this)) {
    console.warn("Cannot add hotspot: invalid image dimensions");
    return;
  }
  try {
    if (!this.value || !Array.isArray(this.value.hotspots)) {
      console.error("Cannot add hotspot: value or hotspots array is invalid");
      return;
    }
    const e = o(this, s, tt).call(this), { lat: a, lng: n } = this.coordinateConverter.pixelToLatLng(t, i), l = {
      id: e,
      lat: a,
      lng: n,
      description: "",
      title: ""
    }, g = {
      ...this.value,
      width: this._imgWidth,
      height: this._imgHeight,
      image: this._imgSrc || null,
      bounds: this._mapBounds,
      hotspots: [...this.value.hotspots, l]
    };
    this.value = g, this._selectedHotspot = e, this._editingHotspot = { ...l }, this._hasUnsavedChanges = !1, this.dispatchEvent(new K()), this.requestUpdate();
  } catch (e) {
    console.error("Failed to add hotspot:", e);
  }
};
Z = function(t, i) {
  if (!o(this, s, C).call(this)) {
    console.warn("Cannot move hotspot: invalid image dimensions");
    return;
  }
  try {
    const { lat: e, lng: a } = this.coordinateConverter.pixelToLatLng(i.x, i.y);
    if (this._selectedHotspot !== t) {
      this._hasUnsavedChanges && this._editingHotspot && o(this, s, H).call(this), this._selectedHotspot = t;
      const n = this.value.hotspots.find((l) => l.id === t);
      n && (this._editingHotspot = { ...n });
    }
    this._editingHotspot && (this._editingHotspot = {
      ...this._editingHotspot,
      lat: e,
      lng: a
    }, this._hasUnsavedChanges = !0, this.requestUpdate());
  } catch (e) {
    console.error("Failed to move hotspot:", e);
  }
};
C = function() {
  return this._imgWidth > 0 && this._imgHeight > 0;
};
z = function(t) {
  return typeof t.lat == "number" && typeof t.lng == "number" && !isNaN(t.lat) && !isNaN(t.lng);
};
R = function(t) {
  const i = t ? parseInt(t, 10) : O;
  return Math.max(Et, Math.min(Mt, i));
};
tt = function() {
  return `hotspot_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};
E = function(t, i) {
  return t.trim().substring(0, i);
};
it = function(t) {
  if (t.dataTransfer && t.target instanceof HTMLElement) {
    const i = t.target.closest(".imagehotspot-image");
    if (i) {
      const e = i.getBoundingClientRect();
      return {
        x: t.clientX - e.left,
        y: t.clientY - e.top
      };
    }
  }
  return null;
};
et = function(t, i) {
  if (t.title) {
    const e = t.description ? `: ${t.description}` : "";
    return `${t.title}${e}`;
  }
  return t.description || `Hotspot ${i}`;
};
N = function(t) {
  const i = this.value.hotspots.filter((e) => e.id !== t);
  o(this, s, A).call(this, { hotspots: i }), this._selectedHotspot === t && (this._selectedHotspot = void 0, this._editingHotspot = void 0, this._hasUnsavedChanges = !1);
};
M = /* @__PURE__ */ new WeakMap();
I = /* @__PURE__ */ new WeakMap();
v = async function() {
  const t = ++$t(this, _)._;
  try {
    if (await o(this, s, st).call(this), t !== r(this, _) || !this._config || !r(this, x) && !r(this, b))
      return;
    const i = this._config.getValueByAlias("imageSrc")?.toString();
    if (!i) {
      console.warn("No imageSrc property configured for custom map editor"), o(this, s, k).call(this);
      return;
    }
    await o(this, s, at).call(this, i, t), o(this, s, lt).call(this), this.requestUpdate();
  } catch (i) {
    console.error("Failed to configure custom map editor:", i), t === r(this, _) && o(this, s, k).call(this);
  }
};
st = function() {
  const t = this._config?.getValueByAlias("imageSrc")?.toString();
  return !r(this, w) || !t ? Promise.resolve() : ((t !== r(this, $) || !r(this, y)) && (m(this, $, t), m(this, y, o(this, s, ot).call(this, r(this, w), t))), r(this, y));
};
ot = async function(t, i) {
  const e = await t.propertyValueByAlias(i);
  e && (m(this, b, !0), this.observe(e, (a) => {
    const n = a !== r(this, U);
    m(this, U, a ?? void 0), n && o(this, s, v).call(this);
  }, "_observeDatasetImage"));
};
at = async function(t, i) {
  let e = r(this, b) ? r(this, U) : r(this, x)?.getPropertyValue(t);
  if (!e && !r(this, b) && (e = await o(this, s, S).call(this, r(this, x)?.getUnique(), t) || void 0), i === r(this, _))
    if (e && typeof e == "object") {
      const a = Array.isArray(e) ? e[0] : e, n = a?.mediaKey || a?.key || a?.udi;
      !n && a?.src ? o(this, s, nt).call(this, a.src) : n && await o(this, s, rt).call(this, n, i);
    } else
      o(this, s, k).call(this);
};
nt = function(t) {
  const i = this._config?.getValueByAlias("width");
  this._imgWidth = o(this, s, R).call(this, i?.toString()), this._imgHeight = Math.round(this._imgWidth * q), this._imgSrc = t;
};
rt = async function(t, i) {
  try {
    const e = await r(this, B).requestByUnique(t);
    if (i !== r(this, _))
      return;
    if (e?.data) {
      const a = o(this, s, T).call(this, "umbracoWidth", e.data) || 0, n = o(this, s, T).call(this, "umbracoHeight", e.data) || 0, l = this._config?.getValueByAlias("width");
      this._imgWidth = o(this, s, R).call(this, l?.toString()), a > 0 && n > 0 ? this._imgHeight = Math.round(this._imgWidth * n / a) : this._imgHeight = Math.round(this._imgWidth * q);
      const g = o(this, s, T).call(this, "umbracoFile", e.data);
      g?.src && (this._imgSrc = g.src);
    }
  } catch (e) {
    console.warn("Failed to load media image:", e), o(this, s, k).call(this);
  }
};
lt = function() {
  const t = this._config?.getValueByAlias("theme") || "Red";
  this._imgTheme = St[t] || 1;
};
k = function() {
  this._imgWidth = O, this._imgHeight = Math.round(this._imgWidth * q), this._imgSrc = void 0;
};
ht = async function(t) {
  if (t)
    try {
      return (await r(this, P).requestItems([t]))?.data?.[0]?.parent?.unique;
    } catch (i) {
      console.warn("Failed to get parent from unique:", i);
      return;
    }
};
S = async function(t, i) {
  if (!t)
    return null;
  try {
    const e = await r(this, D).requestByUnique(t), a = o(this, s, T).call(this, i, e?.data);
    if (a)
      return a;
    const n = await o(this, s, ht).call(this, t);
    return await o(this, s, S).call(this, n, i);
  } catch (e) {
    return console.warn("Failed to get value from unique:", e), null;
  }
};
T = function(t, i) {
  return i?.values && i.values.find((a) => a.alias === t)?.value || null;
};
dt = function() {
  return this.value?.hotspots ? this.value.hotspots.filter(o(this, s, z).bind(this)).map((i, e) => {
    try {
      const { x: a, y: n } = this.coordinateConverter.latLngToPixel(i.lat, i.lng);
      return o(this, s, pt).call(this, i, e + 1, a, n);
    } catch (a) {
      return console.warn("Failed to render hotspot marker:", a), c``;
    }
  }) : [];
};
pt = function(t, i, e, a) {
  const n = this._selectedHotspot === t.id, l = n && this._hasUnsavedChanges && this._editingHotspot && (this._editingHotspot.lat !== t.lat || this._editingHotspot.lng !== t.lng);
  let g = e, F = a;
  if (l && this._editingHotspot)
    try {
      const f = this.coordinateConverter.latLngToPixel(
        this._editingHotspot.lat,
        this._editingHotspot.lng
      );
      g = f.x, F = f.y;
    } catch (f) {
      console.warn("Failed to convert editing coordinates:", f);
    }
  const mt = o(this, s, et).call(this, t, i);
  return c`
            <div 
                class="imagehotspot-hotspot ${n ? "selected" : ""} ${l ? "moved" : ""}" 
                draggable="true" 
                @dragend="${(f) => this.eventHandlers.hotspotDragEnd(f, t.id)}"
                @click="${(f) => this.eventHandlers.hotspotClick(f, t.id)}"
                style="left:${g}px;top:${F}px;"
                title="${mt}${l ? " (moved - unsaved)" : ""}">
                <span class="hotspot-number">${i}</span>
            </div>
        `;
};
ct = function() {
  return this.value?.hotspots ? this.value.hotspots.map((t, i) => {
    const e = this._selectedHotspot === t.id;
    return o(this, s, z).call(this, t) ? o(this, s, ut).call(this, t, i, e) : o(this, s, gt).call(this, t, i, e);
  }) : [];
};
gt = function(t, i, e) {
  return c`
            <tr class="${e ? "selected-row" : ""}">
                <td class="hotspot-index">${i + 1}</td>
                <td class="hotspot-description">
                    ${t.description || "<em>No description</em>"}
                </td>
                <td class="hotspot-coordinates">
                    <em>Invalid coordinates</em>
                </td>
                <td class="hotspot-coordinates">
                    <em>Invalid coordinates</em>
                </td>
                <td class="hotspot-actions">
                    <button 
                        type="button" 
                        class="imagehotspot-btn-small imagehotspot-btn-danger" 
                        @click="${() => o(this, s, N).call(this, t.id)}"
                        title="Delete this hotspot">
                        Delete
                    </button>
                </td>
            </tr>
        `;
};
ut = function(t, i, e) {
  const a = () => {
    o(this, s, L).call(this, t.id);
  }, n = (l) => {
    l.stopPropagation(), o(this, s, N).call(this, t.id);
  };
  return c`
            <tr class="${e ? "selected-row" : ""}"
                @click="${a}"
                style="cursor: pointer;">
                <td class="hotspot-index">${i + 1}</td>
                <td class="hotspot-description">
                    ${t.title ? c`<strong>${t.title}</strong><br/>${V(t.description) || "<em>No description</em>"}` : V(t.description) || "<em>No description</em>"}
                </td>
                <td class="hotspot-coordinates">
                    ${t.lat.toFixed(G)}
                </td>
                <td class="hotspot-coordinates">
                    ${t.lng.toFixed(G)}
                </td>
                <td class="hotspot-actions">
                    <button 
                        type="button" 
                        class="imagehotspot-btn-small imagehotspot-btn-danger" 
                        @click="${n}"
                        title="Delete this hotspot">
                        Delete
                    </button>
                </td>
            </tr>
        `;
};
h.styles = [
  wt,
  ft`
			:host {
				display: block;
				padding: var(--uui-size-layout-1);
			}

			.imagehotspot-editor {
			  border: 1px solid #d8d7d9;
			  background: #fff;
			  position: relative;
			}

			.imagehotspot-controls {
			  display: flex;
			  justify-content: space-between;
			  align-items: center;
			  padding: 10px;
			  background: #f8f8f8;
			  border-bottom: 1px solid #d8d7d9;
			}

			.controls-left {
			  display: flex;
			  gap: 10px;
			}

			.imagehotspot-btn {
			  background: #1976d2;
			  color: white;
			  border: none;
			  padding: 8px 16px;
			  border-radius: 3px;
			  cursor: pointer;
			  font-size: 13px;
			}

			.imagehotspot-btn:hover {
			  background: #1565c0;
			}

			.imagehotspot-btn.active {
			  background: #ff9800;
			}

			.imagehotspot-btn-danger {
			  background: #f44336;
			  color: white;
			  border: none;
			  padding: 8px 16px;
			  border-radius: 3px;
			  cursor: pointer;
			  font-size: 13px;
			}

			.imagehotspot-btn-danger:hover {
			  background: #d32f2f;
			}

			.imagehotspot-btn-small {
			  padding: 4px 8px;
			  font-size: 11px;
			}

			.imagehotspot-count {
			  font-size: 12px;
			  color: #666;
			  font-weight: 500;
			}

			.imagehotspot-image {
			  position: relative;
			  display: inline-block;
			  max-width: 100%;
			  overflow: auto;
			  background: #f0f0f0;
			  border: 1px solid #ddd;
			}

			.imagehotspot-image.adding-mode {
			  cursor: crosshair;
			}

			.imagehotspot-image img {
			  display: block;
			}

			.imagehotspot-placeholder-image {
			  width: 400px;
			  height: 300px;
			  background: #f5f5f5;
			  border: 2px dashed #ccc;
			  display: flex;
			  align-items: center;
			  justify-content: center;
			}

			.imagehotspot-hotspot {
			  position: absolute;
			  width: 24px;
			  height: 24px;
			  background: var(--hotspot-color, #f60078);
			  border: 2px solid white;
			  border-radius: 50%;
			  cursor: pointer;
			  transform: translate(-50%, -50%);
			  display: flex;
			  align-items: center;
			  justify-content: center;
			  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
			  z-index: 10;
			}

			.imagehotspot-hotspot:hover {
			  transform: translate(-50%, -50%) scale(1.1);
			}

			.imagehotspot-hotspot.selected {
			  background: #ff9800;
			  transform: translate(-50%, -50%) scale(1.2);
			}

			.imagehotspot-hotspot.moved {
			  border: 2px solid #ffeb3b;
			  box-shadow: 0 2px 8px rgba(255, 235, 59, 0.5), 0 0 0 2px rgba(255, 235, 59, 0.3);
			}

			.hotspot-number {
			  color: white;
			  font-size: 10px;
			  font-weight: bold;
			  line-height: 1;
			}

			.imagehotspot-panel {
			  border-top: 1px solid #d8d7d9;
			  background: #fafafa;
			}

			.panel-header {
			  display: flex;
			  justify-content: space-between;
			  align-items: center;
			  padding: 10px;
			  border-bottom: 1px solid #d8d7d9;
			}

			.panel-header h4 {
			  margin: 0;
			  font-size: 14px;
			}

			.panel-content {
			  padding: 10px;
			}

			.panel-content label {
			  display: block;
			  margin-bottom: 5px;
			  font-size: 13px;
			  font-weight: 500;
			}

			.imagehotspot-textarea {
			  width: 100%;
			  border: 1px solid #d8d7d9;
			  border-radius: 3px;
			  padding: 8px;
			  font-family: inherit;
			  font-size: 13px;
			  resize: vertical;
			  min-height: 60px;
			}

			.hotspots-table-container {
			  border-top: 1px solid #d8d7d9;
			  background: #fafafa;
			}

			.hotspots-table-container h4 {
			  margin: 0;
			  padding: 10px;
			  font-size: 14px;
			  border-bottom: 1px solid #d8d7d9;
			}

			.hotspots-table {
			  width: 100%;
			  border-collapse: collapse;
			  font-size: 12px;
			}

			.hotspots-table th,
			.hotspots-table td {
			  padding: 8px;
			  text-align: left;
			  border-bottom: 1px solid #e0e0e0;
			}

			.hotspots-table th {
			  background: #f0f0f0;
			  font-weight: 600;
			}

			.hotspots-table tr:hover {
			  background: #f8f8f8;
			}

			.hotspots-table tr.selected-row {
			  background: #e3f2fd;
			}

			.hotspot-index {
			  width: 40px;
			  text-align: center;
			  font-weight: bold;
			}

			.hotspot-coordinates {
			  font-family: monospace;
			  font-size: 11px;
			}

			.hotspot-actions {
			  width: 80px;
			}

			/* Theme colors */
			.theme1 {
			  --hotspot-color: #f60078;
			}

			.theme2 {
			  --hotspot-color: #4caf50;
			}

			.theme3 {
			  --hotspot-color: #2196f3;
			}

			.theme4 {
			  --hotspot-color: #ff9800;
			}
		`
];
p([
  u()
], h.prototype, "_config", 2);
p([
  u()
], h.prototype, "_imgSrc", 2);
p([
  u()
], h.prototype, "_imgWidth", 2);
p([
  u()
], h.prototype, "_imgHeight", 2);
p([
  u()
], h.prototype, "_imgTheme", 2);
p([
  u()
], h.prototype, "_selectedHotspot", 2);
p([
  u()
], h.prototype, "_isAddingHotspot", 2);
p([
  u()
], h.prototype, "_mapBounds", 2);
p([
  u()
], h.prototype, "_editingHotspot", 2);
p([
  u()
], h.prototype, "_hasUnsavedChanges", 2);
p([
  Y({ attribute: !1 })
], h.prototype, "config", 1);
p([
  Y({ attribute: !1 })
], h.prototype, "value", 1);
h = p([
  _t("property-editor-multi-hotspot-editor")
], h);
const Ot = h;
export {
  h as PropertyEditorHotSpotsEditorElement,
  Ot as default
};
//# sourceMappingURL=property-editor-multi-hotspot-editor.element-D5Tnw8Ku.js.map
