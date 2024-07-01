using System.ComponentModel.DataAnnotations;

namespace Ofps.Models
{
    public class FileInfo
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(2048)]
        public string? Name { get; set; }

        [Required]
        public string? LocalPath { get; set; }

        [Required]
        public ulong? Size { get; set; }

        [Required]
        public DateTime? CreateTime { get; set; }

        [Required]
        [MaxLength(255)]
        public string? FileType { get; set; }

    }
}