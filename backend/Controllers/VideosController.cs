using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Ofps.Models;
using System.Linq.Dynamic.Core;

namespace Ofps.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VideosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public VideosController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Videos>>> GetVideos(
            int pageNumber = 0,
            int pageSize = 10,
            string? sortField = null,
            string? sortOrder = null,
            [FromQuery] VideoFilter? filter = null
            )
        {
            var query = _context.Videos.AsQueryable();

            // Apply filters
            if (filter != null)
            {
                if (filter.Types != null && filter.Types.Any())
                {
                    query = query.Where(v => filter.Types.Contains(v.Type));
                }
                if (filter.Channels != null && filter.Channels.Any())
                {
                    query = query.Where(v => filter.Channels.Contains(v.Channel));
                }
                if (filter.Regions != null && filter.Regions.Any())
                {
                    query = query.Where(v => filter.Regions.Contains(v.Region));
                }
                if (filter.Languages != null && filter.Languages.Any())
                {
                    query = query.Where(v => filter.Languages.Contains(v.Language));
                }
                if (!string.IsNullOrEmpty(filter.VideoName))
                {
                    query = query.Where(v => v.VideoName.Contains(filter.VideoName));
                }
            }

            // Get the total count after filtering
            var totalItems = await query.CountAsync();

            // Apply sorting
            if (!string.IsNullOrEmpty(sortField) && !string.IsNullOrEmpty(sortOrder))
            {
                var sortExpression = $"{sortField} {(sortOrder.Equals("desc", StringComparison.CurrentCultureIgnoreCase) ? "descending" : "ascending")}";
                query = query.OrderBy(sortExpression);
            }

            // Apply pagination
            var totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);
            var result = await query
                            .Include(v => v.FileInfo)
                            .Skip(pageNumber * pageSize)
                            .Take(pageSize)
                            .ToListAsync();
            var response = new
            {
                TotalItems = totalItems,
                TotalPages = totalPages,
                CurrentPage = pageNumber,
                PageSize = pageSize,
                Items = result
            };

            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Videos>> GetVideo(int id)
        {
            var video = await _context.Videos.Include(v => v.FileInfo).FirstOrDefaultAsync(v => v.Id == id);

            if (video == null)
            {
                return NotFound();
            }

            return video;
        }

        [HttpPost]
        public async Task<ActionResult<Videos>> PostVideo(Videos video)
        {
            video.CreateTime = DateTime.Now;

            var fileInfo = new Models.FileInfo { Id = video.FileInfo.Id };
            _context.Entry(fileInfo).State = EntityState.Unchanged;
            video.FileInfo = fileInfo;

            _context.Videos.Add(video);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetVideo), new { id = video.Id }, video);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutVideo(int id, Videos video)
        {
            if (id != video.Id)
            {
                return BadRequest();
            }

            var fileInfo = new Models.FileInfo { Id = video.FileInfo.Id };
            _context.Entry(fileInfo).State = EntityState.Unchanged;
            video.FileInfo = fileInfo;

            _context.Entry(video).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VideoExists(id))
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
        public async Task<IActionResult> DeleteVideo([FromBody] int[] ids)
        {
            var findData = await _context.Videos.Where(fi => ids.Contains(fi.Id)).ToListAsync();
            if (findData == null || findData.Count == 0)
            {
                return NotFound();
            }

            _context.Videos.RemoveRange(findData);
            await _context.SaveChangesAsync();
            var response = new
            {
                DeletedIds = findData.Select(fi => fi.Id).ToList(),
            };
            return Ok(response);

        }

        private bool VideoExists(int id)
        {
            return _context.Videos.Any(e => e.Id == id);
        }
    }

    public class VideoFilter
    {
        public string[]? Types { get; set; }
        public string[]? Channels { get; set; }
        public string[]? Regions { get; set; }
        public string[]? Languages { get; set; }
        public string? VideoName { get; set; }
    }


}
