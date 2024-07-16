using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ofps.Models;
using FileInfo = Ofps.Models.FileInfo;
using System.Linq.Dynamic.Core;

namespace Ofps.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly string _fileUploadPath;

        public FileController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _fileUploadPath = configuration["FileUpload:Path"] ?? throw new ArgumentNullException("FileUpload:Path configuration is missing.");
            if (string.IsNullOrWhiteSpace(_fileUploadPath)) throw new ArgumentException("File upload path is not configured properly.");
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<FileInfo>>> GetFiles(
            int pageNumber = 0,
            int pageSize = 10,
            string? sortField = null,
            string? sortOrder = null,
            string? name = null
            )
        {


            var query = _context.FileInfos.AsQueryable();
            if (!string.IsNullOrEmpty(name))
            {
                query = query.Where(v => !string.IsNullOrEmpty(v.Name) && v.Name.Contains(name));
            }

            var totalItems = await query.CountAsync();

            if (!string.IsNullOrEmpty(sortField) && !string.IsNullOrEmpty(sortOrder))
            {
                var sortExpression = $"{sortField} {(sortOrder.Equals("desc", StringComparison.CurrentCultureIgnoreCase) ? "descending" : "ascending")}";
                query = query.OrderBy(sortExpression);
            }

            var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            var files = await query
                .Skip(pageNumber * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var response = new
            {
                TotalItems = totalItems,
                TotalPages = totalPages,
                CurrentPage = pageNumber,
                PageSize = pageSize,
                Items = files
            };

            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<FileInfo>> GetFileInfo(int id)
        {
            var fileInfo = await _context.FileInfos.FindAsync(id);

            if (fileInfo == null)
            {
                return NotFound();
            }

            return fileInfo;
        }

        [HttpPost]
        public async Task<ActionResult<FileInfo>> PostFileInfo(FileInfo fileInfo)
        {
            _context.FileInfos.Add(fileInfo);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetFileInfo), new { id = fileInfo.Id }, fileInfo);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutFileInfo(int id, FileInfo fileInfo)
        {
            if (id != fileInfo.Id)
            {
                return BadRequest();
            }

            _context.Entry(fileInfo).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FileInfoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteFileInfo([FromBody] int[] ids)
        {
            var fileInfos = await _context.FileInfos.Where(fi => ids.Contains(fi.Id)).ToListAsync();
            if (fileInfos == null || fileInfos.Count == 0)
            {
                return NotFound();
            }

            // Check whether any records in the Video table refer to these FileInfo
            var referencedFileInfoIds = await _context.Videos
                .Where(v => ids.Contains(v.FileInfo.Id))
                .Select(v => v.FileInfo.Id)
                .ToListAsync();
            var fileInfosToDelete = fileInfos
                .Where(fi => !referencedFileInfoIds.Contains(fi.Id))
                .ToList();
            if (fileInfosToDelete.Count == 0)
            {
                return BadRequest("All requested FileInfo records are referenced by Videos and cannot be deleted.");
            }
            _context.FileInfos.RemoveRange(fileInfosToDelete);
            await _context.SaveChangesAsync();
            var response = new
            {
                DeletedIds = fileInfosToDelete.Select(fi => fi.Id).ToList(),
                NotDeletedIds = referencedFileInfoIds
            };
            return Ok(response);
        }

        private bool FileInfoExists(int id)
        {
            return _context.FileInfos.Any(e => e.Id == id);
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadFile(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            var uploadsPath = Path.Combine(_fileUploadPath, "uploads");
            if (!Directory.Exists(uploadsPath))
                Directory.CreateDirectory(uploadsPath);

            var filePath = Path.Combine(uploadsPath, file.FileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var fileInfo = new FileInfo
            {
                Name = file.FileName,
                LocalPath = filePath,
                Size = (ulong)file.Length,
                CreateTime = DateTime.Now,
                FileType = file.ContentType
            };

            _context.FileInfos.Add(fileInfo);
            await _context.SaveChangesAsync();

            return Ok(fileInfo);
        }
    }
}
