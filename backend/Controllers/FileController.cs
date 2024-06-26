using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ofps.Models;
using FileInfo = Ofps.Models.FileInfo;

namespace Ofps.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private readonly AppDbContext _context;

        public FileController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<FileInfo>>> GetFiles()
        {
            return await _context.FileInfos.ToListAsync();
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

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFileInfo(int id)
        {
            var fileInfo = await _context.FileInfos.FindAsync(id);
            if (fileInfo == null)
            {
                return NotFound();
            }

            _context.FileInfos.Remove(fileInfo);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool FileInfoExists(int id)
        {
            return _context.FileInfos.Any(e => e.Id == id);
        }
    }
}
