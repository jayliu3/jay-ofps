using System.ComponentModel.DataAnnotations;

namespace Ofps.Models
{
    public class Videos
    {
        public int Id { get; set; }

        [Required]
        public required string VideoName { get; set; }

        public string? Channel { get; set; }

        public string? Type { get; set; }

        public string? Year { get; set; }

        public string? Region { get; set; }

        public string? Language { get; set; }

        public string? Intro { get; set; }

        [Required]
        public DateTime CreateTime { get; set; }

        [Required]
        public required FileInfo FileInfo { get; set; }

    }
}