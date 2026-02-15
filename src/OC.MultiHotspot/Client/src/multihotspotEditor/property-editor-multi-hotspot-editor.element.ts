import { customElement, html, property, state, css, unsafeHTML } from "@umbraco-cms/backoffice/external/lit";
import { UmbLitElement } from "@umbraco-cms/backoffice/lit-element";
import { UmbChangeEvent } from '@umbraco-cms/backoffice/event';
import type { HotSpotsEditorValues, HotSpotsEditorHotspot } from "../types/HotSpotseditor";
import type { UmbPropertyEditorUiElement } from '@umbraco-cms/backoffice/property-editor';
import { UMB_DOCUMENT_WORKSPACE_CONTEXT, UmbDocumentWorkspaceContext } from "@umbraco-cms/backoffice/document";
import { UmbDocumentDetailRepository } from "@umbraco-cms/backoffice/document";
import { UmbDocumentItemRepository } from "@umbraco-cms/backoffice/document";
import { UmbMediaDetailRepository } from "@umbraco-cms/backoffice/media";
import { UmbEntityUnique } from "@umbraco-cms/backoffice/entity";
import { UmbElementDetailModel } from "@umbraco-cms/backoffice/content";
import { UmbTextStyles } from '@umbraco-cms/backoffice/style';
import { UmbPropertyEditorConfigCollection } from "@umbraco-cms/backoffice/property-editor";
import type { UmbInputTiptapElement } from '@umbraco-cms/backoffice/tiptap';

/* 
    The original code was from https://github.com/skttl/umbraco-image-hotspot/tree/main/src 
    Modified for Umbraco 17 and customised to allow for multiple hotspots and text descriptions with titles.
*/

// Constants
const DEFAULT_IMAGE_WIDTH = 400;
const DEFAULT_ASPECT_RATIO = 0.75;
const HOTSPOT_COORDINATE_PRECISION = 6;
const MAX_TITLE_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 2000;
const MIN_IMAGE_WIDTH = 100;
const MAX_IMAGE_WIDTH = 2000;

const DEFAULT_MAP_BOUNDS = {
    north: 100,
    south: 0,
    east: 100,
    west: 0
} as const;

// Enums
enum Theme {
    Red = 1,
    Green = 2,
    Blue = 3,
    Orange = 4
}

const THEME_MAPPING = {
    Red: Theme.Red,
    Green: Theme.Green,
    Blue: Theme.Blue,
    Orange: Theme.Orange
} as const;

// Type definitions
interface ImageBounds {
    north: number;
    south: number;
    east: number;
    west: number;
}

interface PixelCoordinate {
    x: number;
    y: number;
}

interface LatLngCoordinate {
    lat: number;
    lng: number;
}

/**
 * Custom Map Editor Element for Umbraco
 * Allows users to place interactive hotspots on map images with lat/lng coordinates.
 * Supports multiple hotspots with rich text descriptions and titles.
 */
@customElement('property-editor-multi-hotspot-editor')
export class PropertyEditorHotSpotsEditorElement extends UmbLitElement implements UmbPropertyEditorUiElement {
    
    private _configCollection = new UmbPropertyEditorConfigCollection([
        {
            alias: 'hideLabel',
            value: true,
        },
        { alias: 'dimensions', value: { height: 300 } },
        { alias: 'maxImageSize', value: 500 },
        { alias: 'ignoreUserStartNodes', value: false },
        {
            alias: 'toolbar',
            value: [
                [
                    ['Umb.Tiptap.Toolbar.SourceEditor'],
                    ['Umb.Tiptap.Toolbar.Bold', 'Umb.Tiptap.Toolbar.Italic', 'Umb.Tiptap.Toolbar.Underline'],
                    ['Umb.Tiptap.Toolbar.TextAlignLeft', 'Umb.Tiptap.Toolbar.TextAlignCenter', 'Umb.Tiptap.Toolbar.TextAlignRight'],
                    ['Umb.Tiptap.Toolbar.BulletList', 'Umb.Tiptap.Toolbar.OrderedList'],
                    ['Umb.Tiptap.Toolbar.Blockquote', 'Umb.Tiptap.Toolbar.HorizontalRule'],
                    ['Umb.Tiptap.Toolbar.Link', 'Umb.Tiptap.Toolbar.Unlink'],
                    ['Umb.Tiptap.Toolbar.MediaPicker', 'Umb.Tiptap.Toolbar.EmbeddedMedia'],
                ],
            ],
        },
        {
            alias: 'extensions',
            value: [
                'Umb.Tiptap.RichTextEssentials', 'Umb.Tiptap.Blockquote', 'Umb.Tiptap.Bold', 'Umb.Tiptap.BulletList', 'Umb.Tiptap.Embed', 'Umb.Tiptap.Figure', 'Umb.Tiptap.HorizontalRule', 'Umb.Tiptap.Image', 'Umb.Tiptap.Italic', 'Umb.Tiptap.Link', 'Umb.Tiptap.MediaUpload', 'Umb.Tiptap.OrderedList', 'Umb.Tiptap.Subscript', 'Umb.Tiptap.Superscript', 'Umb.Tiptap.TextAlign', 'Umb.Tiptap.Underline',
            ],
        },
    ]);

    @state()
    private _config?: UmbPropertyEditorConfigCollection;

    @state()
    private _imgSrc?: string;

    @state()
    private _imgWidth: number = DEFAULT_IMAGE_WIDTH;

    @state()
    private _imgHeight: number = 0;

    @state()
    private _imgTheme: Theme = Theme.Red;

    @state()
    private _selectedHotspot?: string;

    @state()
    private _isAddingHotspot: boolean = false;

    @state()
    private _mapBounds: ImageBounds = { ...DEFAULT_MAP_BOUNDS };

    @state()
    private _editingHotspot?: HotSpotsEditorHotspot;

    @state()
    private _hasUnsavedChanges: boolean = false;

    @property({ attribute: false })
    public set config(config: UmbPropertyEditorConfigCollection | undefined) {
        this._config = config;
        this.#setConfig();
    }

    public get config(): UmbPropertyEditorConfigCollection | undefined {
        return this._config;
    }

    private _value: HotSpotsEditorValues = {
        image: null,
        width: null,
        height: null,
        bounds: null,
        hotspots: []
    };

    @property({ attribute: false })
    public set value(val: HotSpotsEditorValues | undefined | null) {
        // Ensure we always have a valid value with proper defaults
        this._value = this.#normalizeValue(val);
        this.requestUpdate();
    }

    public get value(): HotSpotsEditorValues {
        return this._value;
    }

    /**
     * Normalizes incoming value to ensure it has all required properties
     */
    #normalizeValue(val: HotSpotsEditorValues | undefined | null): HotSpotsEditorValues {
        if (!val || typeof val !== 'object') {
            return {
                image: null,
                width: null,
                height: null,
                bounds: null,
                hotspots: []
            };
        }

        return {
            image: val.image || null,
            width: val.width || null,
            height: val.height || null,
            bounds: val.bounds || null,
            hotspots: Array.isArray(val.hotspots) ? val.hotspots : []
        };
    }

    #documentWorkspaceContext?: UmbDocumentWorkspaceContext;
    #documentDetailRepository = new UmbDocumentDetailRepository(this);
    #documentItemRepository = new UmbDocumentItemRepository(this);
    #mediaDetailRepository = new UmbMediaDetailRepository(this);

    // Coordinate conversion utilities
    private readonly coordinateConverter = {
        /**
         * Converts pixel coordinates to geographic coordinates based on configured map bounds
         * @param x - Pixel X coordinate
         * @param y - Pixel Y coordinate  
         * @returns Geographic coordinates
         * @throws Error if image dimensions are invalid
         */
        pixelToLatLng: (x: number, y: number): LatLngCoordinate => {
            if (!this.#validateImageDimensions()) {
                throw new Error('Invalid image dimensions for coordinate conversion');
            }
            
            const lat = this._mapBounds.north - 
                ((y / this._imgHeight) * (this._mapBounds.north - this._mapBounds.south));
            const lng = this._mapBounds.west + 
                ((x / this._imgWidth) * (this._mapBounds.east - this._mapBounds.west));
            
            return { lat, lng };
        },

        /**
         * Converts geographic coordinates to pixel coordinates for display
         * @param lat - Latitude
         * @param lng - Longitude
         * @returns Pixel coordinates
         * @throws Error if image dimensions are invalid
         */
        latLngToPixel: (lat: number, lng: number): PixelCoordinate => {
            if (!this.#validateImageDimensions()) {
                throw new Error('Invalid image dimensions for coordinate conversion');
            }
            
            const y = ((this._mapBounds.north - lat) / 
                (this._mapBounds.north - this._mapBounds.south)) * this._imgHeight;
            const x = ((lng - this._mapBounds.west) / 
                (this._mapBounds.east - this._mapBounds.west)) * this._imgWidth;
            
            return { x, y };
        }
    };
  
    // Event handlers organized for better maintainability
    private readonly eventHandlers = {
        /**
         * Handles clicks on the image area for adding new hotspots
         */
        imageClick: (event: MouseEvent): void => {
            if (this._isAddingHotspot) {
                this.#addHotspotAtPosition(event.offsetX, event.offsetY);
                this._isAddingHotspot = false;
            }
        },

        /**
         * Handles clicks on hotspot markers
         */
        hotspotClick: (event: MouseEvent, hotspotId: string): void => {
            event.stopPropagation();
            this.#selectHotspot(hotspotId);
        },

        /**
         * Handles drag end events for hotspot repositioning
         */
        hotspotDragEnd: (event: DragEvent, hotspotId: string): void => {
            const position = this.#getMousePositionFromDragEvent(event);
            if (position) {
                this.#moveHotspotToPosition(hotspotId, position);
            }
        },

        /**
         * Handles title input changes - updates editing state only
         */
        titleInput: (event: Event): void => {
            const target = event.target as HTMLInputElement;
            const sanitizedTitle = this.#sanitizeInput(target.value, MAX_TITLE_LENGTH);

            if (!this._selectedHotspot) return;
            
            // Update editing state instead of main value
            this._editingHotspot = {
                ...this._editingHotspot!,
                title: sanitizedTitle
            };
            this._hasUnsavedChanges = true;
            this.requestUpdate();
        },

        /**
         * Handles rich text editor changes for descriptions - updates editing state only
         */
        descriptionChange: (event: CustomEvent & { target: UmbInputTiptapElement }): void => {
            if (this._selectedHotspot && this._editingHotspot) {
                const markup = event.target.value;
                const sanitizedMarkup = this.#sanitizeInput(markup || '', MAX_DESCRIPTION_LENGTH);
                
                // Update editing state instead of main value
                this._editingHotspot = {
                    ...this._editingHotspot,
                    description: sanitizedMarkup
                };
                this._hasUnsavedChanges = true;
                this.requestUpdate();
            }
        }
    };

    // Consolidated state update methods
    /**
     * Updates the value and notifies of changes in a single operation
     */
    #updateValueAndNotify(updates: Partial<HotSpotsEditorValues>): void {
        this.value = { ...this.value, ...updates };
        this.dispatchEvent(new UmbChangeEvent());
        this.requestUpdate();
    }

   
    /**
     * Selects or deselects a hotspot and initializes editing state
     */
    #selectHotspot(hotspotId: string): void {
        // Save any pending changes before switching hotspots
        if (this._hasUnsavedChanges && this._editingHotspot) {
            this.#saveHotspotChanges();
        }

        if (this._selectedHotspot === hotspotId) {
            // Deselecting
            this._selectedHotspot = undefined;
            this._editingHotspot = undefined;
        } else {
            // Selecting new hotspot
            this._selectedHotspot = hotspotId;
            const hotspot = this.value.hotspots.find((h: HotSpotsEditorHotspot) => h.id === hotspotId);
            if (hotspot) {
                // Create a copy for editing
                this._editingHotspot = { ...hotspot };
            }
        }
        
        this._hasUnsavedChanges = false;
        this.requestUpdate();
    }

    /**
     * Saves changes from editing state to main value
     */
    #saveHotspotChanges(): void {
        if (!this._editingHotspot || !this._selectedHotspot) return;

        const updatedHotspots = this.value.hotspots.map((hotspot: HotSpotsEditorHotspot) =>
            hotspot.id === this._selectedHotspot ? { ...this._editingHotspot! } : hotspot
        );

        this.#updateValueAndNotify({ hotspots: updatedHotspots });
        this._hasUnsavedChanges = false;
    }

    /**
     * Adds a hotspot at the specified position
     */
    #addHotspotAtPosition(x: number, y: number): void {
        if (!this.#validateImageDimensions()) {
            console.warn('Cannot add hotspot: invalid image dimensions');
            return;
        }

        try {
            // Ensure we have a valid value before proceeding
            if (!this.value || !Array.isArray(this.value.hotspots)) {
                console.error('Cannot add hotspot: value or hotspots array is invalid');
                return;
            }

            const id = this.#generateHotspotId();
            const { lat, lng } = this.coordinateConverter.pixelToLatLng(x, y);

            const newHotspot: HotSpotsEditorHotspot = {
                id,
                lat,
                lng,
                description: '',
                title: ''
            };

            const updatedValue: HotSpotsEditorValues = {
                ...this.value,
                width: this._imgWidth,
                height: this._imgHeight,
                image: this._imgSrc || null,
                bounds: this._mapBounds,
                hotspots: [...this.value.hotspots, newHotspot]
            };

            this.value = updatedValue;
            this._selectedHotspot = id;
            this._editingHotspot = { ...newHotspot };
            this._hasUnsavedChanges = false;
            this.dispatchEvent(new UmbChangeEvent());
            this.requestUpdate();
        } catch (error) {
            console.error('Failed to add hotspot:', error);
        }
    }

    /**
     * Moves a hotspot to a new position
     */
    #moveHotspotToPosition(hotspotId: string, position: PixelCoordinate): void {
        if (!this.#validateImageDimensions()) {
            console.warn('Cannot move hotspot: invalid image dimensions');
            return;
        }

        try {
            const { lat, lng } = this.coordinateConverter.pixelToLatLng(position.x, position.y);
            
            // If the moved hotspot is not currently selected, select it first
            if (this._selectedHotspot !== hotspotId) {
                // Save any existing unsaved changes first
                if (this._hasUnsavedChanges && this._editingHotspot) {
                    this.#saveHotspotChanges();
                }
                
                // Select the moved hotspot
                this._selectedHotspot = hotspotId;
                const hotspot = this.value.hotspots.find((h: HotSpotsEditorHotspot) => h.id === hotspotId);
                if (hotspot) {
                    this._editingHotspot = { ...hotspot };
                }
            }
            
            // Update the editing state with new coordinates
            if (this._editingHotspot) {
                this._editingHotspot = {
                    ...this._editingHotspot,
                    lat,
                    lng
                };
                this._hasUnsavedChanges = true;
                this.requestUpdate();
            }
        } catch (error) {
            console.error('Failed to move hotspot:', error);
        }
    }

    // Validation methods
    /**
     * Validates if image dimensions are valid for coordinate operations
     */
    #validateImageDimensions(): boolean {
        return this._imgWidth > 0 && this._imgHeight > 0;
    }

    /**
     * Validates if hotspot coordinates are valid numbers
     */
    #validateHotspotCoordinates(hotspot: HotSpotsEditorHotspot): boolean {
        return typeof hotspot.lat === 'number' && 
               typeof hotspot.lng === 'number' && 
               !isNaN(hotspot.lat) && 
               !isNaN(hotspot.lng);
    }

    /**
     * Validates and clamps configured width to reasonable bounds
     */
    #validateConfiguredWidth(configuredWidth: string | undefined): number {
        const width = configuredWidth ? parseInt(configuredWidth, 10) : DEFAULT_IMAGE_WIDTH;
        return Math.max(MIN_IMAGE_WIDTH, Math.min(MAX_IMAGE_WIDTH, width));
    }

    // Utility methods
    /**
     * Generates a unique ID for hotspots
     */
    #generateHotspotId(): string {
        return `hotspot_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }

    /**
     * Sanitizes input to prevent excessive length and harmful content
     */
    #sanitizeInput(input: string, maxLength: number): string {
        return input.trim().substring(0, maxLength);
    }

    /**
     * Gets mouse position from drag event relative to image container
     */
    #getMousePositionFromDragEvent(event: DragEvent): PixelCoordinate | null {
        if (event.dataTransfer && event.target instanceof HTMLElement) {
            const imageContainer = event.target.closest('.imagehotspot-image') as HTMLElement;
            if (imageContainer) {
                const rect = imageContainer.getBoundingClientRect();
                return {
                    x: event.clientX - rect.left,
                    y: event.clientY - rect.top
                };
            }
        }
        return null;
    }

    /**
     * Generates tooltip text for hotspots
     */
    #getHotspotTooltip(hotspot: HotSpotsEditorHotspot, number: number): string {
        if (hotspot.title) {
            const description = hotspot.description ? `: ${hotspot.description}` : '';
            return `${hotspot.title}${description}`;
        }
        return hotspot.description || `Hotspot ${number}`;
    }

    /**
     * Removes a specific hotspot
     */
    #removeHotspot(hotspotId: string): void {
        const filteredHotspots = this.value.hotspots.filter((h: HotSpotsEditorHotspot) => h.id !== hotspotId);
        
        this.#updateValueAndNotify({ hotspots: filteredHotspots });

        if (this._selectedHotspot === hotspotId) {
            this._selectedHotspot = undefined;
            this._editingHotspot = undefined;
            this._hasUnsavedChanges = false;
        }
    }
    /**
     * Removes all hotspots with confirmation
     */
    #removeAllHotspots = (): void => {
        const hotspotsCount = this.value.hotspots.length;

        if (hotspotsCount === 0) {
            return;
        }

        const confirmed = confirm(
            `Are you sure you want to delete all ${hotspotsCount} hotspot${hotspotsCount > 1 ? 's' : ''}? This action cannot be undone.`
        );

        if (confirmed) {
            this.#updateValueAndNotify({ hotspots: [] });
            this._selectedHotspot = undefined;
            this._editingHotspot = undefined;
            this._hasUnsavedChanges = false;
        }
    }

    /**
     * Toggles hotspot addition mode
     */
    #toggleAddMode = (): void => {
        // Save any pending changes before toggling add mode
        if (this._hasUnsavedChanges && this._editingHotspot) {
            this.#saveHotspotChanges();
        }

        this._isAddingHotspot = !this._isAddingHotspot;
        this._selectedHotspot = undefined;
        this._editingHotspot = undefined;
        this._hasUnsavedChanges = false;
        this.requestUpdate();
    }

    // Configuration and image handling methods
    /**
     * Main configuration setup method with improved error handling
     */
    async #setConfig(): Promise<void> {
        try {
            if (!this._config || !this.#documentWorkspaceContext) {
                return;
            }

            const imagePropertyAlias = this._config.getValueByAlias("imageSrc")?.toString();
            if (!imagePropertyAlias) {
                console.warn('No imageSrc property configured for custom map editor');
                this.#setPlaceholderImage();
                return;
            }

            await this.#configureImageFromProperty(imagePropertyAlias);
            this.#configureTheme();
            this.requestUpdate();
            
        } catch (error) {
            console.error('Failed to configure custom map editor:', error);
            this.#setPlaceholderImage();
        }
    }

    /**
     * Configures image from property with error handling
     */
    async #configureImageFromProperty(imagePropertyAlias: string): Promise<void> {
        let imageValue = this.#documentWorkspaceContext?.getPropertyValue<Array<any>>(imagePropertyAlias);

        if (!imageValue) {
            const retrievedValue = await this.#getValueFromUnique(
                this.#documentWorkspaceContext?.getUnique(), 
                imagePropertyAlias
            );
            imageValue = retrievedValue || undefined;
        }

        if (imageValue && typeof imageValue === 'object') {
            const firstImageValue = Array.isArray(imageValue) ? imageValue[0] : imageValue;
            const mediaKey = firstImageValue?.mediaKey || firstImageValue?.key || firstImageValue?.udi;

            if (!mediaKey && firstImageValue?.src) {
                this.#configureDirectImageSrc(firstImageValue.src);
            } else if (mediaKey) {
                await this.#configureMediaImage(mediaKey);
            }
        }
    }

    /**
     * Configures image from direct src
     */
    #configureDirectImageSrc(src: string): void {
        const configuredWidth = this._config?.getValueByAlias("width");
        this._imgWidth = this.#validateConfiguredWidth(configuredWidth?.toString());
        this._imgHeight = Math.round(this._imgWidth * DEFAULT_ASPECT_RATIO);
        this._imgSrc = `${src}?width=${this._imgWidth}&height=${this._imgHeight}&rmode=min&quality=80`;
    }

    /**
     * Configures image from media repository
     */
    async #configureMediaImage(mediaKey: string): Promise<void> {
        try {
            const media = await this.#mediaDetailRepository.requestByUnique(mediaKey);

            if (media?.data) {
                const mediaWidth = this.#getPropertyValue("umbracoWidth", media.data) || 0;
                const mediaHeight = this.#getPropertyValue("umbracoHeight", media.data) || 0;

                const configuredWidth = this._config?.getValueByAlias("width");
                this._imgWidth = this.#validateConfiguredWidth(configuredWidth?.toString());

                if (mediaWidth > 0 && mediaHeight > 0) {
                    this._imgHeight = Math.round(this._imgWidth * mediaHeight / mediaWidth);
                } else {
                    this._imgHeight = Math.round(this._imgWidth * DEFAULT_ASPECT_RATIO);
                }

                const umbracoFile = this.#getPropertyValue("umbracoFile", media.data);

                if (umbracoFile?.src) {
                    this._imgSrc = `${umbracoFile.src}?width=${this._imgWidth}&height=${this._imgHeight}&rmode=min&quality=80`;
                }
            }
        } catch (error) {
            console.warn('Failed to load media image:', error);
            this.#setPlaceholderImage();
        }
    }

    /**
     * Configures theme based on configuration
     */
    #configureTheme(): void {
        const theme = this._config?.getValueByAlias("theme") || "Red";
        this._imgTheme = THEME_MAPPING[theme as keyof typeof THEME_MAPPING] || Theme.Red;
    }

    /**
     * Sets placeholder image when configuration fails
     */
    #setPlaceholderImage(): void {
        this._imgWidth = DEFAULT_IMAGE_WIDTH;
        this._imgHeight = Math.round(this._imgWidth * DEFAULT_ASPECT_RATIO);
        this._imgSrc = undefined;
    }

    // Helper methods for parent traversal and property access
    /**
     * Gets parent entity from unique identifier with error handling
     */
    async #getParentFromUnique(unique: string | undefined | null): Promise<UmbEntityUnique | undefined> {
        if (!unique) {
            return undefined;
        }

        try {
            const parent = await this.#documentItemRepository.requestItems([unique]);
            return parent?.data?.[0]?.parent?.unique;
        } catch (error) {
            console.warn('Failed to get parent from unique:', error);
            return undefined;
        }
    }

    /**
     * Recursively gets property value from document hierarchy
     */
    async #getValueFromUnique(unique: UmbEntityUnique | undefined | null, alias: string): Promise<Array<any> | null> {
        if (!unique) {
            return null;
        }

        try {
            const item = await this.#documentDetailRepository.requestByUnique(unique);
            const value = this.#getPropertyValue(alias, item?.data);
            
            if (value) {
                return value as Array<any>;
            }
            
            // Recursively check parent if not found
            const parentUnique = await this.#getParentFromUnique(unique);
            return await this.#getValueFromUnique(parentUnique, alias);
        } catch (error) {
            console.warn('Failed to get value from unique:', error);
            return null;
        }
    }

    /**
     * Safely extracts property value from element model
     */
    #getPropertyValue(alias: string, item: UmbElementDetailModel | undefined): any {
        if (!item?.values) {
            return null;
        }

        const property = item.values.find((prop) => prop.alias === alias);
        return property?.value || null;
    }

    // Rendering helper methods
    /**
     * Renders hotspot markers with validation
     */
    #renderHotspotMarkers() {
        // Add null check for this.value
        if (!this.value?.hotspots) {
            return [];
        }
        
        const validHotspots = this.value.hotspots.filter(this.#validateHotspotCoordinates.bind(this));
        
        return validHotspots.map((hotspot: HotSpotsEditorHotspot, index: number) => {
            try {
                const { x, y } = this.coordinateConverter.latLngToPixel(hotspot.lat, hotspot.lng);
                return this.#renderHotspotMarker(hotspot, index + 1, x, y);
            } catch (error) {
                console.warn('Failed to render hotspot marker:', error);
                return html``;
            }
        });
    }

    /**
     * Renders individual hotspot marker
     */
    #renderHotspotMarker(hotspot: HotSpotsEditorHotspot, number: number, x: number, y: number) {
        const isSelected = this._selectedHotspot === hotspot.id;
        const hasUnsavedPosition = isSelected && this._hasUnsavedChanges && this._editingHotspot && 
            (this._editingHotspot.lat !== hotspot.lat || this._editingHotspot.lng !== hotspot.lng);
        
        // Use editing coordinates if this hotspot is being edited and has moved
        let displayX = x;
        let displayY = y;
        
        if (hasUnsavedPosition && this._editingHotspot) {
            try {
                const editingPixel = this.coordinateConverter.latLngToPixel(
                    this._editingHotspot.lat, 
                    this._editingHotspot.lng
                );
                displayX = editingPixel.x;
                displayY = editingPixel.y;
            } catch (error) {
                console.warn('Failed to convert editing coordinates:', error);
            }
        }
        
        const title = this.#getHotspotTooltip(hotspot, number);
        
        return html`
            <div 
                class="imagehotspot-hotspot ${isSelected ? 'selected' : ''} ${hasUnsavedPosition ? 'moved' : ''}" 
                draggable="true" 
                @dragend="${(e: DragEvent) => this.eventHandlers.hotspotDragEnd(e, hotspot.id)}"
                @click="${(e: MouseEvent) => this.eventHandlers.hotspotClick(e, hotspot.id)}"
                style="left:${displayX}px;top:${displayY}px;"
                title="${title}${hasUnsavedPosition ? ' (moved - unsaved)' : ''}">
                <span class="hotspot-number">${number}</span>
            </div>
        `;
    }

    /**
     * Renders hotspot table rows with validation and error handling
     */
    #renderHotspotTableRows() {
        // Add null check for this.value
        if (!this.value?.hotspots) {
            return [];
        }
        
        return this.value.hotspots.map((hotspot: HotSpotsEditorHotspot, index: number) => {
            const isSelected = this._selectedHotspot === hotspot.id;
            
            if (!this.#validateHotspotCoordinates(hotspot)) {
                return this.#renderInvalidHotspotRow(hotspot, index, isSelected);
            }

            return this.#renderValidHotspotRow(hotspot, index, isSelected);
        });
    }

    /**
     * Renders table row for invalid hotspot coordinates
     */
    #renderInvalidHotspotRow(hotspot: HotSpotsEditorHotspot, index: number, isSelected: boolean) {
        return html`
            <tr class="${isSelected ? 'selected-row' : ''}">
                <td class="hotspot-index">${index + 1}</td>
                <td class="hotspot-description">
                    ${hotspot.description || '<em>No description</em>'}
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
                        @click="${() => this.#removeHotspot(hotspot.id)}"
                        title="Delete this hotspot">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    }

    /**
     * Renders table row for valid hotspot
     */
    #renderValidHotspotRow(hotspot: HotSpotsEditorHotspot, index: number, isSelected: boolean) {
        const selectHotspot = () => {
            this.#selectHotspot(hotspot.id);
        };

        const deleteHotspot = (e: Event) => {
            e.stopPropagation();
            this.#removeHotspot(hotspot.id);
        };

        return html`
            <tr class="${isSelected ? 'selected-row' : ''}"
                @click="${selectHotspot}"
                style="cursor: pointer;">
                <td class="hotspot-index">${index + 1}</td>
                <td class="hotspot-description">
                    ${hotspot.title 
                        ? html`<strong>${hotspot.title}</strong><br/>${unsafeHTML(hotspot.description) || '<em>No description</em>'}` 
                        : unsafeHTML(hotspot.description) || '<em>No description</em>'}
                </td>
                <td class="hotspot-coordinates">
                    ${hotspot.lat.toFixed(HOTSPOT_COORDINATE_PRECISION)}
                </td>
                <td class="hotspot-coordinates">
                    ${hotspot.lng.toFixed(HOTSPOT_COORDINATE_PRECISION)}
                </td>
                <td class="hotspot-actions">
                    <button 
                        type="button" 
                        class="imagehotspot-btn-small imagehotspot-btn-danger" 
                        @click="${deleteHotspot}"
                        title="Delete this hotspot">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    }

    // Lifecycle methods
    /**
     * Component connection lifecycle method
     * Sets up document workspace context and initial configuration
     */
    connectedCallback(): void {
        super.connectedCallback();

        this.consumeContext(UMB_DOCUMENT_WORKSPACE_CONTEXT, (context) => {
            this.#documentWorkspaceContext = context;
            this.#setConfig();
        });

        // Also try to set config immediately if we already have it
        if (this._config) {
            this.#setConfig();
        }
    }

    /**
     * Component disconnection lifecycle method - saves any pending changes
     */
    disconnectedCallback(): void {
        // Save any unsaved changes before component is destroyed
        if (this._hasUnsavedChanges && this._editingHotspot) {
            this.#saveHotspotChanges();
        }
        super.disconnectedCallback();
    }

    /**
     * Constructor - initializes the element
     */
    constructor() {
        super();
    }

    /**
     * Main render method - orchestrates the rendering of all UI components
     * @returns Lit template result for the custom map editor
     */
    render() {
        // Ensure hotspots array exists before rendering
        const hotspots = this.value?.hotspots || [];

        return html`
      <div class="imagehotspot-editor theme${this._imgTheme}">
        <div class="imagehotspot-controls">
          <div class="controls-left">
            <button 
              type="button" 
              class="imagehotspot-btn ${this._isAddingHotspot ? 'active' : ''}" 
              @click="${this.#toggleAddMode}">
              ${this._isAddingHotspot ? 'Cancel Adding' : 'Add Hotspot'}
            </button>
            ${hotspots.length > 0 ? html`
              <button 
                type="button" 
                class="imagehotspot-btn-danger" 
                @click="${this.#removeAllHotspots}"
                title="Delete all hotspots">
                Delete All
              </button>
            ` : ''}
          </div>
          <span class="imagehotspot-count">${hotspots.length} hotspot${hotspots.length !== 1 ? 's' : ''}</span>
        </div>

        <div class="imagehotspot-image ${this._isAddingHotspot ? 'adding-mode' : ''}" @click="${this.eventHandlers.imageClick}">
          ${this._imgSrc
                ? html`
              <img src="${this._imgSrc}" width="${this._imgWidth}" height="${this._imgHeight}" style="display: block;" />
            `
                : html`
              <div class="imagehotspot-placeholder-image">
                <div style="padding: 20px; text-align: center; color: #666;">
                  No image configured<br/>
                  <small>Check the imageSrc property configuration</small>
                </div>
              </div>
            `
            }

           ${this.#renderHotspotMarkers()}
        </div>

        ${this._selectedHotspot ? html`
          <div class="imagehotspot-panel">
            <div class="panel-content">
              <div style="margin-bottom: 16px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 500;">Hotspot Title</label>
                <p style="font-size: 12px; color: #666; margin-bottom: 8px;">Optional title shown above the description</p>
                <input 
                  type="text" 
                  .value=${this._editingHotspot?.title || ''}
                  @input=${this.eventHandlers.titleInput}
                  placeholder="Enter hotspot title"
                  style="width: 100%; padding: 8px; border: 1px solid #d8d7d9; border-radius: 3px; font-size: 13px;"
                  maxlength="${MAX_TITLE_LENGTH}">
              </div>
         
              <div style="margin-bottom: 16px;">
                <label style="display: block; margin-bottom: 8px; font-weight: 500;">Hotspot Details</label>
                <p style="font-size: 12px; color: #666; margin-bottom: 8px;">Details about this specific hotspot</p>
        
                <umb-input-tiptap
                    .configuration=${this._configCollection}
                    .value=${this._editingHotspot?.description || ''}
                    @change=${this.eventHandlers.descriptionChange}>
                 </umb-input-tiptap>
              </div>

              ${this._hasUnsavedChanges ? html`
                <div style="margin-bottom: 16px;">
                  <button 
                    type="button" 
                    class="imagehotspot-btn" 
                    @click="${() => this.#saveHotspotChanges()}">
                    Save Changes
                  </button>
                  <span style="margin-left: 8px; font-size: 12px; color: #666;">
                    You have unsaved changes${this._editingHotspot && this.value.hotspots.find((h: HotSpotsEditorHotspot) => h.id === this._selectedHotspot) && 
        (this._editingHotspot.lat !== this.value.hotspots.find((h: HotSpotsEditorHotspot) => h.id === this._selectedHotspot)?.lat || 
         this._editingHotspot.lng !== this.value.hotspots.find((h: HotSpotsEditorHotspot) => h.id === this._selectedHotspot)?.lng) 
        ? ' (includes position changes)' : ''}
                  </span>
                </div>
              ` : ''}
            </div>
          </div>
        ` : ''}

        ${hotspots.length > 0 ? html`
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
                ${this.#renderHotspotTableRows()}
              </tbody>
            </table>
          </div>
        ` : ''}
      </div>
    `;
    }
    static override styles = [
        UmbTextStyles,
        css`
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
		`,
    ];
}

export default PropertyEditorHotSpotsEditorElement;

declare global {
    interface HTMLElementTagNameMap {
        'property-editor-multi-hotspot-editor': PropertyEditorHotSpotsEditorElement;
    }
}
