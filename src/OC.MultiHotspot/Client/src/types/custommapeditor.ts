export interface HotSpotsEditorValues {
    image: string | null;
    width: number | null;
    height: number | null;
    // Define the lat/lng bounds for the image
    bounds: {
        north: number;
        south: number;
        east: number;
        west: number;
    } | null;
    hotspots: HotSpotsEditorHotspot[];
}

export interface HotSpotsEditorHotspot {
    id: string;
    lat: number;  // Replace left/top with lat/lng
    lng: number;  // Replace percentX/Y with lat/lng
    description: string;
    title: string;
}