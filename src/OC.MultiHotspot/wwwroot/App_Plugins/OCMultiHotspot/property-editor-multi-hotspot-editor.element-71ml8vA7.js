import { html as d, unsafeHTML as L, css as rt, state as p, property as N, customElement as lt } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement as ht } from "@umbraco-cms/backoffice/lit-element";
import { UmbChangeEvent as R } from "@umbraco-cms/backoffice/event";
import { UmbDocumentDetailRepository as dt, UmbDocumentItemRepository as pt, UMB_DOCUMENT_WORKSPACE_CONTEXT as ct } from "@umbraco-cms/backoffice/document";
import { UmbMediaDetailRepository as gt } from "@umbraco-cms/backoffice/media";
import { UmbTextStyles as ut } from "@umbraco-cms/backoffice/style";
import { UmbPropertyEditorConfigCollection as mt } from "@umbraco-cms/backoffice/property-editor";
var ft = Object.defineProperty, _t = Object.getOwnPropertyDescriptor, F = (t) => {
  throw TypeError(t);
}, h = (t, i, e, n) => {
  for (var a = n > 1 ? void 0 : n ? _t(i, e) : i, r = t.length - 1, c; r >= 0; r--)
    (c = t[r]) && (a = (n ? c(i, e, a) : c(a)) || a);
  return n && a && ft(i, e, a), a;
}, $ = (t, i, e) => i.has(t) || F("Cannot " + e), u = (t, i, e) => ($(t, i, "read from private field"), e ? e.call(t) : i.get(t)), m = (t, i, e) => i.has(t) ? F("Cannot add the same private member more than once") : i instanceof WeakSet ? i.add(t) : i.set(t, e), bt = (t, i, e, n) => ($(t, i, "write to private field"), i.set(t, e), e), s = (t, i, e) => ($(t, i, "access private method"), e), o, O, _, k, A, E, x, M, f, V, G, v, S, D, X, T, Y, j, I, w, U, H, K, J, Q, Z, y, tt, C, b, it, et, ot, st, nt;
const W = 400, P = 0.75, z = 6, q = 200, vt = 2e3, Ht = 100, yt = 2e3, xt = {
  north: 100,
  south: 0,
  east: 100,
  west: 0
}, Tt = {
  Red: 1,
  Green: 2,
  Blue: 3,
  Orange: 4
  /* Orange */
};
let l = class extends ht {
  /**
   * Constructor - initializes the element
   */
  constructor() {
    super(), m(this, o), this._configCollection = new mt([
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
    ]), this._imgWidth = W, this._imgHeight = 0, this._imgTheme = 1, this._isAddingHotspot = !1, this._mapBounds = { ...xt }, this._hasUnsavedChanges = !1, this._value = {
      image: null,
      width: null,
      height: null,
      bounds: null,
      hotspots: []
    }, m(this, _), m(this, k, new dt(this)), m(this, A, new pt(this)), m(this, E, new gt(this)), this.coordinateConverter = {
      /**
       * Converts pixel coordinates to geographic coordinates based on configured map bounds
       * @param x - Pixel X coordinate
       * @param y - Pixel Y coordinate  
       * @returns Geographic coordinates
       * @throws Error if image dimensions are invalid
       */
      pixelToLatLng: (t, i) => {
        if (!s(this, o, v).call(this))
          throw new Error("Invalid image dimensions for coordinate conversion");
        const e = this._mapBounds.north - i / this._imgHeight * (this._mapBounds.north - this._mapBounds.south), n = this._mapBounds.west + t / this._imgWidth * (this._mapBounds.east - this._mapBounds.west);
        return { lat: e, lng: n };
      },
      /**
       * Converts geographic coordinates to pixel coordinates for display
       * @param lat - Latitude
       * @param lng - Longitude
       * @returns Pixel coordinates
       * @throws Error if image dimensions are invalid
       */
      latLngToPixel: (t, i) => {
        if (!s(this, o, v).call(this))
          throw new Error("Invalid image dimensions for coordinate conversion");
        const e = (this._mapBounds.north - t) / (this._mapBounds.north - this._mapBounds.south) * this._imgHeight;
        return { x: (i - this._mapBounds.west) / (this._mapBounds.east - this._mapBounds.west) * this._imgWidth, y: e };
      }
    }, this.eventHandlers = {
      /**
       * Handles clicks on the image area for adding new hotspots
       */
      imageClick: (t) => {
        this._isAddingHotspot && (s(this, o, V).call(this, t.offsetX, t.offsetY), this._isAddingHotspot = !1);
      },
      /**
       * Handles clicks on hotspot markers
       */
      hotspotClick: (t, i) => {
        t.stopPropagation(), s(this, o, M).call(this, i);
      },
      /**
       * Handles drag end events for hotspot repositioning
       */
      hotspotDragEnd: (t, i) => {
        const e = s(this, o, Y).call(this, t);
        e && s(this, o, G).call(this, i, e);
      },
      /**
       * Handles title input changes - updates editing state only
       */
      titleInput: (t) => {
        const i = t.target, e = s(this, o, T).call(this, i.value, q);
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
          const i = t.target.value, e = s(this, o, T).call(this, i || "", vt);
          this._editingHotspot = {
            ...this._editingHotspot,
            description: e
          }, this._hasUnsavedChanges = !0, this.requestUpdate();
        }
      }
    }, m(this, w, () => {
      const t = this.value.hotspots.length;
      if (t === 0)
        return;
      confirm(
        `Are you sure you want to delete all ${t} hotspot${t > 1 ? "s" : ""}? This action cannot be undone.`
      ) && (s(this, o, x).call(this, { hotspots: [] }), this._selectedHotspot = void 0, this._editingHotspot = void 0, this._hasUnsavedChanges = !1);
    }), m(this, U, () => {
      this._hasUnsavedChanges && this._editingHotspot && s(this, o, f).call(this), this._isAddingHotspot = !this._isAddingHotspot, this._selectedHotspot = void 0, this._editingHotspot = void 0, this._hasUnsavedChanges = !1, this.requestUpdate();
    });
  }
  set config(t) {
    this._config = t, s(this, o, H).call(this);
  }
  get config() {
    return this._config;
  }
  set value(t) {
    this._value = s(this, o, O).call(this, t), this.requestUpdate();
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
    super.connectedCallback(), this.consumeContext(ct, (t) => {
      bt(this, _, t), s(this, o, H).call(this);
    }), this._config && s(this, o, H).call(this);
  }
  /**
   * Component disconnection lifecycle method - saves any pending changes
   */
  disconnectedCallback() {
    this._hasUnsavedChanges && this._editingHotspot && s(this, o, f).call(this), super.disconnectedCallback();
  }
  /**
   * Main render method - orchestrates the rendering of all UI components
   * @returns Lit template result for the custom map editor
   */
  render() {
    const t = this.value?.hotspots || [];
    return d`
      <div class="imagehotspot-editor theme${this._imgTheme}">
        <div class="imagehotspot-controls">
          <div class="controls-left">
            <button 
              type="button" 
              class="imagehotspot-btn ${this._isAddingHotspot ? "active" : ""}" 
              @click="${u(this, U)}">
              ${this._isAddingHotspot ? "Cancel Adding" : "Add Hotspot"}
            </button>
            ${t.length > 0 ? d`
              <button 
                type="button" 
                class="imagehotspot-btn-danger" 
                @click="${u(this, w)}"
                title="Delete all hotspots">
                Delete All
              </button>
            ` : ""}
          </div>
          <span class="imagehotspot-count">${t.length} hotspot${t.length !== 1 ? "s" : ""}</span>
        </div>

        <div class="imagehotspot-image ${this._isAddingHotspot ? "adding-mode" : ""}" @click="${this.eventHandlers.imageClick}">
          ${this._imgSrc ? d`
              <img src="${this._imgSrc}" width="${this._imgWidth}" height="${this._imgHeight}" style="display: block;" />
            ` : d`
              <div class="imagehotspot-placeholder-image">
                <div style="padding: 20px; text-align: center; color: #666;">
                  No image configured<br/>
                  <small>Check the imageSrc property configuration</small>
                </div>
              </div>
            `}

           ${s(this, o, it).call(this)}
        </div>

        ${this._selectedHotspot ? d`
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
                  maxlength="${q}">
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

              ${this._hasUnsavedChanges ? d`
                <div style="margin-bottom: 16px;">
                  <button 
                    type="button" 
                    class="imagehotspot-btn" 
                    @click="${() => s(this, o, f).call(this)}">
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

        ${t.length > 0 ? d`
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
                ${s(this, o, ot).call(this)}
              </tbody>
            </table>
          </div>
        ` : ""}
      </div>
    `;
  }
};
o = /* @__PURE__ */ new WeakSet();
O = function(t) {
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
_ = /* @__PURE__ */ new WeakMap();
k = /* @__PURE__ */ new WeakMap();
A = /* @__PURE__ */ new WeakMap();
E = /* @__PURE__ */ new WeakMap();
x = function(t) {
  this.value = { ...this.value, ...t }, this.dispatchEvent(new R()), this.requestUpdate();
};
M = function(t) {
  if (this._hasUnsavedChanges && this._editingHotspot && s(this, o, f).call(this), this._selectedHotspot === t)
    this._selectedHotspot = void 0, this._editingHotspot = void 0;
  else {
    this._selectedHotspot = t;
    const i = this.value.hotspots.find((e) => e.id === t);
    i && (this._editingHotspot = { ...i });
  }
  this._hasUnsavedChanges = !1, this.requestUpdate();
};
f = function() {
  if (!this._editingHotspot || !this._selectedHotspot) return;
  const t = this.value.hotspots.map(
    (i) => i.id === this._selectedHotspot ? { ...this._editingHotspot } : i
  );
  s(this, o, x).call(this, { hotspots: t }), this._hasUnsavedChanges = !1;
};
V = function(t, i) {
  if (!s(this, o, v).call(this)) {
    console.warn("Cannot add hotspot: invalid image dimensions");
    return;
  }
  try {
    if (!this.value || !Array.isArray(this.value.hotspots)) {
      console.error("Cannot add hotspot: value or hotspots array is invalid");
      return;
    }
    const e = s(this, o, X).call(this), { lat: n, lng: a } = this.coordinateConverter.pixelToLatLng(t, i), r = {
      id: e,
      lat: n,
      lng: a,
      description: "",
      title: ""
    }, c = {
      ...this.value,
      width: this._imgWidth,
      height: this._imgHeight,
      image: this._imgSrc || null,
      bounds: this._mapBounds,
      hotspots: [...this.value.hotspots, r]
    };
    this.value = c, this._selectedHotspot = e, this._editingHotspot = { ...r }, this._hasUnsavedChanges = !1, this.dispatchEvent(new R()), this.requestUpdate();
  } catch (e) {
    console.error("Failed to add hotspot:", e);
  }
};
G = function(t, i) {
  if (!s(this, o, v).call(this)) {
    console.warn("Cannot move hotspot: invalid image dimensions");
    return;
  }
  try {
    const { lat: e, lng: n } = this.coordinateConverter.pixelToLatLng(i.x, i.y);
    if (this._selectedHotspot !== t) {
      this._hasUnsavedChanges && this._editingHotspot && s(this, o, f).call(this), this._selectedHotspot = t;
      const a = this.value.hotspots.find((r) => r.id === t);
      a && (this._editingHotspot = { ...a });
    }
    this._editingHotspot && (this._editingHotspot = {
      ...this._editingHotspot,
      lat: e,
      lng: n
    }, this._hasUnsavedChanges = !0, this.requestUpdate());
  } catch (e) {
    console.error("Failed to move hotspot:", e);
  }
};
v = function() {
  return this._imgWidth > 0 && this._imgHeight > 0;
};
S = function(t) {
  return typeof t.lat == "number" && typeof t.lng == "number" && !isNaN(t.lat) && !isNaN(t.lng);
};
D = function(t) {
  const i = t ? parseInt(t, 10) : W;
  return Math.max(Ht, Math.min(yt, i));
};
X = function() {
  return `hotspot_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};
T = function(t, i) {
  return t.trim().substring(0, i);
};
Y = function(t) {
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
j = function(t, i) {
  if (t.title) {
    const e = t.description ? `: ${t.description}` : "";
    return `${t.title}${e}`;
  }
  return t.description || `Hotspot ${i}`;
};
I = function(t) {
  const i = this.value.hotspots.filter((e) => e.id !== t);
  s(this, o, x).call(this, { hotspots: i }), this._selectedHotspot === t && (this._selectedHotspot = void 0, this._editingHotspot = void 0, this._hasUnsavedChanges = !1);
};
w = /* @__PURE__ */ new WeakMap();
U = /* @__PURE__ */ new WeakMap();
H = async function() {
  try {
    if (!this._config || !u(this, _))
      return;
    const t = this._config.getValueByAlias("imageSrc")?.toString();
    if (!t) {
      console.warn("No imageSrc property configured for custom map editor"), s(this, o, y).call(this);
      return;
    }
    await s(this, o, K).call(this, t), s(this, o, Z).call(this), this.requestUpdate();
  } catch (t) {
    console.error("Failed to configure custom map editor:", t), s(this, o, y).call(this);
  }
};
K = async function(t) {
  let i = u(this, _)?.getPropertyValue(t);
  if (i || (i = await s(this, o, C).call(this, u(this, _)?.getUnique(), t) || void 0), i && typeof i == "object") {
    const e = Array.isArray(i) ? i[0] : i, n = e?.mediaKey || e?.key || e?.udi;
    !n && e?.src ? s(this, o, J).call(this, e.src) : n && await s(this, o, Q).call(this, n);
  }
};
J = function(t) {
  const i = this._config?.getValueByAlias("width");
  this._imgWidth = s(this, o, D).call(this, i?.toString()), this._imgHeight = Math.round(this._imgWidth * P), this._imgSrc = `${t}?width=${this._imgWidth}&height=${this._imgHeight}&rmode=min&quality=80`;
};
Q = async function(t) {
  try {
    const i = await u(this, E).requestByUnique(t);
    if (i?.data) {
      const e = s(this, o, b).call(this, "umbracoWidth", i.data) || 0, n = s(this, o, b).call(this, "umbracoHeight", i.data) || 0, a = this._config?.getValueByAlias("width");
      this._imgWidth = s(this, o, D).call(this, a?.toString()), e > 0 && n > 0 ? this._imgHeight = Math.round(this._imgWidth * n / e) : this._imgHeight = Math.round(this._imgWidth * P);
      const r = s(this, o, b).call(this, "umbracoFile", i.data);
      r?.src && (this._imgSrc = `${r.src}?width=${this._imgWidth}&height=${this._imgHeight}&rmode=min&quality=80`);
    }
  } catch (i) {
    console.warn("Failed to load media image:", i), s(this, o, y).call(this);
  }
};
Z = function() {
  const t = this._config?.getValueByAlias("theme") || "Red";
  this._imgTheme = Tt[t] || 1;
};
y = function() {
  this._imgWidth = W, this._imgHeight = Math.round(this._imgWidth * P), this._imgSrc = void 0;
};
tt = async function(t) {
  if (t)
    try {
      return (await u(this, A).requestItems([t]))?.data?.[0]?.parent?.unique;
    } catch (i) {
      console.warn("Failed to get parent from unique:", i);
      return;
    }
};
C = async function(t, i) {
  if (!t)
    return null;
  try {
    const e = await u(this, k).requestByUnique(t), n = s(this, o, b).call(this, i, e?.data);
    if (n)
      return n;
    const a = await s(this, o, tt).call(this, t);
    return await s(this, o, C).call(this, a, i);
  } catch (e) {
    return console.warn("Failed to get value from unique:", e), null;
  }
};
b = function(t, i) {
  return i?.values && i.values.find((n) => n.alias === t)?.value || null;
};
it = function() {
  return this.value?.hotspots ? this.value.hotspots.filter(s(this, o, S).bind(this)).map((i, e) => {
    try {
      const { x: n, y: a } = this.coordinateConverter.latLngToPixel(i.lat, i.lng);
      return s(this, o, et).call(this, i, e + 1, n, a);
    } catch (n) {
      return console.warn("Failed to render hotspot marker:", n), d``;
    }
  }) : [];
};
et = function(t, i, e, n) {
  const a = this._selectedHotspot === t.id, r = a && this._hasUnsavedChanges && this._editingHotspot && (this._editingHotspot.lat !== t.lat || this._editingHotspot.lng !== t.lng);
  let c = e, B = n;
  if (r && this._editingHotspot)
    try {
      const g = this.coordinateConverter.latLngToPixel(
        this._editingHotspot.lat,
        this._editingHotspot.lng
      );
      c = g.x, B = g.y;
    } catch (g) {
      console.warn("Failed to convert editing coordinates:", g);
    }
  const at = s(this, o, j).call(this, t, i);
  return d`
            <div 
                class="imagehotspot-hotspot ${a ? "selected" : ""} ${r ? "moved" : ""}" 
                draggable="true" 
                @dragend="${(g) => this.eventHandlers.hotspotDragEnd(g, t.id)}"
                @click="${(g) => this.eventHandlers.hotspotClick(g, t.id)}"
                style="left:${c}px;top:${B}px;"
                title="${at}${r ? " (moved - unsaved)" : ""}">
                <span class="hotspot-number">${i}</span>
            </div>
        `;
};
ot = function() {
  return this.value?.hotspots ? this.value.hotspots.map((t, i) => {
    const e = this._selectedHotspot === t.id;
    return s(this, o, S).call(this, t) ? s(this, o, nt).call(this, t, i, e) : s(this, o, st).call(this, t, i, e);
  }) : [];
};
st = function(t, i, e) {
  return d`
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
                        @click="${() => s(this, o, I).call(this, t.id)}"
                        title="Delete this hotspot">
                        Delete
                    </button>
                </td>
            </tr>
        `;
};
nt = function(t, i, e) {
  const n = () => {
    s(this, o, M).call(this, t.id);
  }, a = (r) => {
    r.stopPropagation(), s(this, o, I).call(this, t.id);
  };
  return d`
            <tr class="${e ? "selected-row" : ""}"
                @click="${n}"
                style="cursor: pointer;">
                <td class="hotspot-index">${i + 1}</td>
                <td class="hotspot-description">
                    ${t.title ? d`<strong>${t.title}</strong><br/>${L(t.description) || "<em>No description</em>"}` : L(t.description) || "<em>No description</em>"}
                </td>
                <td class="hotspot-coordinates">
                    ${t.lat.toFixed(z)}
                </td>
                <td class="hotspot-coordinates">
                    ${t.lng.toFixed(z)}
                </td>
                <td class="hotspot-actions">
                    <button 
                        type="button" 
                        class="imagehotspot-btn-small imagehotspot-btn-danger" 
                        @click="${a}"
                        title="Delete this hotspot">
                        Delete
                    </button>
                </td>
            </tr>
        `;
};
l.styles = [
  ut,
  rt`
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
h([
  p()
], l.prototype, "_config", 2);
h([
  p()
], l.prototype, "_imgSrc", 2);
h([
  p()
], l.prototype, "_imgWidth", 2);
h([
  p()
], l.prototype, "_imgHeight", 2);
h([
  p()
], l.prototype, "_imgTheme", 2);
h([
  p()
], l.prototype, "_selectedHotspot", 2);
h([
  p()
], l.prototype, "_isAddingHotspot", 2);
h([
  p()
], l.prototype, "_mapBounds", 2);
h([
  p()
], l.prototype, "_editingHotspot", 2);
h([
  p()
], l.prototype, "_hasUnsavedChanges", 2);
h([
  N({ attribute: !1 })
], l.prototype, "config", 1);
h([
  N({ attribute: !1 })
], l.prototype, "value", 1);
l = h([
  lt("property-editor-multi-hotspot-editor")
], l);
const Mt = l;
export {
  l as PropertyEditorHotSpotsEditorElement,
  Mt as default
};
//# sourceMappingURL=property-editor-multi-hotspot-editor.element-71ml8vA7.js.map
