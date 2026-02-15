# <img src="../docs/logo.png" alt="OC.MultiHotspot logo" width="50" /> OC.MultiHotspot


OC.MultiHotspot is an Umbraco CMS package that adds a multi-hotspot image editor to the back office that supports [Leaflet JS](https://leafletjs.com/)

It is based on the package by Soren Kottal - [Image Hotspot Editor](https://marketplace.umbraco.com/package/umbraco.community.imagehotspot)

## Features
- Backoffice property editor for creating multiple hotspots on an image.


## Compatibility
- Umbraco 17
- .NET 10
- Razor Pages / Razor views

## Installation

From the project folder (web project that contains your Umbraco site):

- CLI:
  - `dotnet add package OC.MultiHotspot --version <version>`
- Visual Studio:
  - Manage NuGet Packages → Browse → `OC.MultiHotspot` → Install
- Package Manager Console:
  - `Install-Package OC.MultiHotspot -Version <version>`

After installing, rebuild your solution.

## Umbraco 17 setup

1. Add the package to your Umbraco web project (see Installation).
2. In the Umbraco backoffice:
   - Go to Settings → Data Types → Create → choose the `Multi Hotspot` editor.
   - Configure the editor (max hotspots, snapping options, etc.).
   - Assign the Data Type to a Document Type property (e.g. `multiHotspot`).

3. Save and edit content in Content section — editors can pick an image and add multiple hotspots with titles/links/custom data.

## Backoffice setup
	- Add an Image Media Picker to select the base image on your document type. Remember the alias of this property (e.g. `image`).
	- Add a property of type `Multi Hotspot` to store the hotspots data (JSON) to your document type.
	- On the Multi Hotport editor, add the alias of the Image Media Picker property (e.g. `image`) to the configuration so the editor knows which image to load for adding hotspots.
	- Once you select an image, refresh the backoffice for the Multi Hotspot editor to load the image and allow adding hotspots.


## Configuration

Setup Data Type configuration:
![Multi Hotspot editor configuration](../docs/configHotSpots.gif)

Demo of adding hotspots in the backoffice:
![Adding Hotspots to images](../docs/setupHotSpots.gif)

When viewed on the front end, the hotspots will be rendered as interactive elements (e.g. icons or tooltips) positioned according to the stored coordinates.

![Hotspots with leaflet on the front end](../docs/leafletHotSpot.png)

## Frontend rendering demo

The code below is an example of how to render the hotspots on the front end using Leaflet. It assumes you have the necessary data from the Multi Hotspot editor available in your Razor view.

`Model.Hotspot` is the alias of the property where the Multi Hotspot JSON data is stored, and `Model.Image` is the alias of the Image Media Picker property.

```
<link href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" rel="stylesheet" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
```

```
               <div id="map" style="width: 695px; height: 521px;"></div>

                <script>
                    var customIcon = L.icon({
                         iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEzNCIgdmlld0JveD0iMCAwIDEwMCAxMzQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+DQo8cGF0aCBkPSJNNDQuODgyNCAxMjguNzE4TDQ0LjkwOTUgMTI4Ljc1NUw0NC45MzgzIDEyOC43OTFDNDYuMTIxOCAxMzAuMjcgNDcuOTMwMyAxMzEuMjA4IDQ5LjgzMzMgMTMxLjIwOEM1MS43MzY0IDEzMS4yMDggNTMuNTQ0OSAxMzAuMjcgNTQuNzI4NCAxMjguNzkxTDU0Ljc1NzEgMTI4Ljc1NUw1NC43ODQyIDEyOC43MThDNTQuODg0NyAxMjguNTc5IDU1LjE1NjEgMTI4LjIyNyA1NS41NzU2IDEyNy42ODNDNTguMzU1OCAxMjQuMDc2IDY3LjYzNjggMTEyLjAzNCA3Ni43MjE1IDk3Ljk3NTlDODEuOTU0OCA4OS44NzczIDg3LjE2NDIgODEuMDQ5MyA5MS4wNzIgNzIuNjk1N0M5NC45NTA5IDY0LjQwNCA5Ny42NjY3IDU2LjMzNTcgOTcuNjY2NyA0OS44MzMzQzk3LjY2NjcgMjMuNTIwOCA3Ni4xNDU5IDIgNDkuODMzMyAyQzIzLjUyMDggMiAyIDIzLjUyMDggMiA0OS44MzMzQzIgNTYuMzM1NyA0LjcxNTc5IDY0LjQwNCA4LjU5NDY3IDcyLjY5NTdDMTIuNTAyNSA4MS4wNDkyIDE3LjcxMTggODkuODc3MyAyMi45NDUyIDk3Ljk3NThDMzIuMDI4OCAxMTIuMDMzIDQxLjMwOSAxMjQuMDczIDQ0LjA5MDIgMTI3LjY4MkM0NC41MTAxIDEyOC4yMjcgNDQuNzgxOSAxMjguNTc5IDQ0Ljg4MjQgMTI4LjcxOFoiIGZpbGw9IiNGNjAwN0IiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iNCIvPg0KPGNpcmNsZSBjeD0iNDkuNSIgY3k9IjUxLjUiIHI9IjE3LjUiIGZpbGw9ImJsYWNrIi8+DQo8L3N2Zz4NCg==',
                         iconSize: [30, 30],
                        popupAnchor: [0, 0]
                    });

                    @if (Model.Hotspot != null && !string.IsNullOrEmpty(Model.Hotspot.Image))
                    {
                                var imageWidth = Model.Hotspot.Width ?? 400;
                                var imageHeight = Model.Hotspot.Height ?? 300;
                                var imageUrl = Model.Hotspot.Image;

                                // Ensure the image URL has the same scaling parameters as the property editor
                                if (!imageUrl.Contains("?"))
                                {
                                            imageUrl += $"?width={imageWidth}&height={imageHeight}&rmode=min&quality=80";
                                }

                                <text>
                            var mapData = {
                                image: '@Html.Raw(imageUrl)',
                                width: @imageWidth,
                                height: @imageHeight,
                                bounds: @Html.Raw(Model.Hotspot.Bounds != null ?
                              $"{{north: {Model.Hotspot.Bounds.North.ToString("F15", System.Globalization.CultureInfo.InvariantCulture)}, south: {Model.Hotspot.Bounds.South.ToString("F15", System.Globalization.CultureInfo.InvariantCulture)}, east: {Model.Hotspot.Bounds.East.ToString("F15", System.Globalization.CultureInfo.InvariantCulture)}, west: {Model.Hotspot.Bounds.West.ToString("F15", System.Globalization.CultureInfo.InvariantCulture)}}}" :
                              "{north: 100, south: 0, east: 100, west: 0}"),
                        Hotspot: [
                            @for (int i = 0; i < Model.Hotspot.Hotspots.Count; i++)
                                    {
                                                var Hotspot = Model.Hotspot.Hotspots[i];
                                                <text>
                                                {
                                                    id: '@Html.Raw(Hotspot.Id)',
                                                    lat: @Hotspot.Lat.ToString("F15", System.Globalization.CultureInfo.InvariantCulture),
                                                    lng: @Hotspot.Lng.ToString("F15", System.Globalization.CultureInfo.InvariantCulture),
                                                    description: '@Html.Raw(Hotspot.Description)',
                                                    title: '@Html.Raw(Html.Encode(Hotspot.Title).Replace("'", "\\'"))'
                                                }@(i < Model.Hotspot.Hotspots.Count - 1 ? "," : "")
                                                </text>
                                    }
                                ]
                            };

                            if (mapData.image) {
                                var map = L.map('map', {
                                    crs: L.CRS.Simple,
                                    // Prevent shrinking below native scale by disallowing negative zoom
                                    minZoom: 0,
                                    maxZoom: 2,
                                }).setView([mapData.height / 2, mapData.width / 2], 0);

                                var markerLayer = L.layerGroup().addTo(map);

                                // Use coordinate system that matches the property editor configured dimensions
                                var bounds = [[0, 0], [mapData.height, mapData.width]];

                                var imageOverlay = L.imageOverlay(mapData.image, bounds).addTo(map);

                                // Convert stored lat/lng coordinates back to pixel coordinates
                                function convertLatLngToPixel(lat, lng) {
                                    var y = ((mapData.bounds.north - lat) / (mapData.bounds.north - mapData.bounds.south)) * mapData.height;
                                    var x = ((lng - mapData.bounds.west) / (mapData.bounds.east - mapData.bounds.west)) * mapData.width;
                                    return { x: x, y: y };
                                }

                                mapData.Hotspot.forEach(function(Hotspot, index) {
                                    if (typeof Hotspot.lat !== 'number' || typeof Hotspot.lng !== 'number' ||
                                        isNaN(Hotspot.lat) || isNaN(Hotspot.lng)) {
                                        return;
                                    }

                                    // Convert stored coordinates to pixel position
                                    var pixelPos = convertLatLngToPixel(Hotspot.lat, Hotspot.lng);

                                    // Invert Y coordinate for Leaflet's Simple CRS (which has origin at bottom-left)
                                    // Property editor uses DOM coords (origin at top-left), so we need to flip Y
                                    var leafletY = mapData.height - pixelPos.y;

                                    // In simple CRS, we use [y, x] format (row, column)
                                    var markerPosition = [leafletY, pixelPos.x];

                                    var marker = L.marker(markerPosition, { icon: customIcon })
                                        .bindPopup(`${Hotspot.title && Hotspot.title.trim() ? `<b>${Hotspot.title}</b><br>` : ''}${Hotspot.description}`, {
                                            closeButton: true,
                                            direction: 'auto'
                                        });

                                    markerLayer.addLayer(marker);
                                });

                                // Fit the map to show the entire image without padding (no animation to avoid transient scaling)
                                map.fitBounds(bounds, {
                                    animate: false
                                });
                            }
                                </text>
                    }
                </script>


```

## Contributing

- Create issues or PRs in the repository.

## License

This project is licensed under the MIT License - see the [LICENSE](../docs/License.md) file for details.

## Built by
Owain Williams - 
