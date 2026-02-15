/**
 * Represents the bounds of a map image
 */
export interface ImageBounds {
    north: number;
    south: number;
    east: number;
    west: number;
}

/**
 * Represents a single hotspot on the map
 */
export interface HotSpotsEditorHotspot {
    id: string;
    lat: number;
    lng: number;
    description: string;
    title: string;
}

/**
 * Represents the complete editor value structure
 */
export interface HotSpotsEditorValues {
    image: string | null;
    width: number | null;
    height: number | null;
    bounds: ImageBounds | null;
    hotspots: HotSpotsEditorHotspot[];
}
