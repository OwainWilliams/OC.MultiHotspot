export const manifests: Array<UmbExtensionManifest> = [
    {
        name: "OC Multi Hotspot Property Editor UI",
        alias: "OC.MultiHotspot.PropertyEditorUi",
        type: "propertyEditorUi",
        elementName: "property-editor-multi-hotspot-editor",
        element: () => import("./property-editor-multi-hotspot-editor.element.js"),
        meta: {
            group: "common",
            icon: "icon-crosshair",
            label: "Multi Hotspot",
            propertyEditorSchemaAlias: "Umbraco.Plain.Json",
            settings: {
                properties: [
                    {
                        alias: "imageSrc",
                        label: "Image",
                        description: "The alias of the property (recursive lookup) that holds the image to place a hotspot on",
                        propertyEditorUiAlias: "Umb.PropertyEditorUi.TextBox"
                    },
                    {
                        alias: "width",
                        label: "Width",
                        description: "Set the desired display width of the image (in pixels)",
                        propertyEditorUiAlias: "Umb.PropertyEditorUi.Integer"
                    },
                    {
                        alias: "theme",
                        label: "Color",
                        description: "Choose a color for the hotspot",
                        propertyEditorUiAlias: "Umb.PropertyEditorUi.RadioButtonList",
                        config: [
                            {
                                alias: "items",
                                value: [
                                    "Red", "Green", "Blue", "Orange"
                                ],
                            }
                        ],
                    },
                ],
                defaultData: [
                    {
                        alias: "imageSrc",
                        value: "image"
                    },
                    {
                        alias: "width",
                        value: 400
                    },
                    {
                        alias: "theme",
                        value: "Red"
                    }
                ]
            }
        }
    },
];
