using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace phoneBookApi.Entities
{
    public class User
    {
        public int id { get; set; }
        [Required]
        public string name { get; set; }
        [Required]
        public string firstName { get; set; }
        public string lastName { get; set; }
        [Required]
        public int phone { get; set; }
        public string email { get; set; }
        [Required]
        public string address { get; set; }
    }
}
