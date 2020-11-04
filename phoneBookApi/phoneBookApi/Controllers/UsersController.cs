using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using phoneBookApi.Context;
using phoneBookApi.Entities;

namespace phoneBookApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext context;

        public UsersController(ApplicationDbContext context)
        {
            this.context = context;
        }

        [HttpGet]
        public ActionResult<IEnumerable<User>> Get()
        {
            return context.users.ToList();
        }

        [HttpGet("{id}", Name = "ObtenerUser")]
        public ActionResult<User> Get(int id)
        {
            var user = context.users.FirstOrDefault(u => u.id == id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        [HttpPost]
        public ActionResult post([FromBody] User user)
        {
            context.users.Add(user);
            context.SaveChanges();

            return new CreatedAtRouteResult("ObtenerUser", new { id = user.id }, user);
        }

        [HttpPut("{id}")]
        public ActionResult put(int id, [FromBody] User user)
        {
            if (id != user.id)
            {
                return BadRequest();
            }

            context.Entry(user).State = EntityState.Modified;
            context.SaveChanges();
            return Ok();
        }

        [HttpDelete("{id}")]
        public ActionResult<User> delete(int id)
        {
            var user = context.users.FirstOrDefault(x => x.id == id);

            if (user == null)
            {
                return NotFound();
            }

            context.users.Remove(user);
            context.SaveChanges();

            return user;
        }
    }
}
