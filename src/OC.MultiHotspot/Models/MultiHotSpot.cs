namespace OC.MultiHotspot.Models
{
    public class MultiHotSpot
    {
        public string? Image { get; set; }
        public int? Width { get; set; }
        public int? Height { get; set; }
        public HotspotBounds? Bounds { get; set; }
        public List<MultiHotspotEditorHotSpots> Hotspots { get; set; } = new List<MultiHotspotEditorHotSpots>();

        public override string ToString()
        {
            return $"Image: {Image}, Hotspots: {Hotspots.Count}";
        }
    }

    public class HotspotBounds
    {
        public decimal North { get; set; }
        public decimal South { get; set; }
        public decimal East { get; set; }
        public decimal West { get; set; }
    }

    public class MultiHotspotEditorHotSpots
    {
        public string Id { get; set; } = string.Empty;
        public decimal Lat { get; set; }
        public decimal Lng { get; set; }
        public string Description { get; set; } = string.Empty;

        public string Title { get; set; } = string.Empty;
    }
}
