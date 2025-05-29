using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

class Program
{
  static void Main()
  {
    int port = 5000;

    var server = new Server(port);
    Console.WriteLine("The server is running");
    Console.WriteLine($"Main Page: http://localhost:{port}/website/pages/index.html");

    var database = new Database();

    while (true)
    {
      (var request, var response) = server.WaitForRequest();

      Console.WriteLine($"Received a request with the path: {request.Path}");

      if (File.Exists(request.Path))
      {
        var file = new File(request.Path);
        response.Send(file);
      }
      else if (request.ExpectsHtml())
      {
        var file = new File("website/pages/404.html");
        response.SetStatusCode(404);
        response.Send(file);
      }
      else
      {
        try
        {
          if (request.Path == "verifyUserId")
          {
            var userId = request.GetBody<string>();
            var exists = database.Users.Any(user => user.Id == userId);
            response.Send(exists);
          }
          else if (request.Path == "signUp")
          {
            var (username, password) = request.GetBody<(string, string)>();
            var exists = database.Users.Any(user => user.Username == username);

            string? userId = null;

            if (!exists)
            {
              userId = Guid.NewGuid().ToString();
              var user = new User(userId, username, password);
              database.Users.Add(user);
            }

            response.Send(userId);
          }
          else if (request.Path == "logIn")
          {
            var (username, password) = request.GetBody<(string, string)>();
            var user = database.Users.FirstOrDefault(u => u.Username == username && u.Password == password);
            response.Send(user?.Id);
          }
          else if (request.Path == "saveEntry")
          {
            var (userId, weeknum, weekday, text) = request.GetBody<(string, int, int, string)>();

            var existing = database.Entries
              .FirstOrDefault(e => e.UserId == userId && e.weeknum == weeknum && e.Weekday == weekday);

            if (existing != null)
              existing.text = text;
            else
              database.Entries.Add(new Entry { UserId = userId, weeknum = weeknum, Weekday = weekday, text = text });

            response.Send(true);
          }
          else if (request.Path == "loadWeek")
          {
            var (userId, weeknum) = request.GetBody<(string, int)>();
            var entries = database.Entries
              .Where(e => e.UserId == userId && e.weeknum == weeknum);
            response.Send(entries);
          }

          database.SaveChanges();
        }
        catch (Exception exception)
        {
          Log.WriteException(exception);
        }
      }

      response.Close();
    }
  }
}

class Database() : DbBase("database")
{
  public DbSet<User> Users { get; set; } = default!;
  public DbSet<Entry> Entries { get; set; } = default!;
}

class User(string id, string username, string password)
{
  [Key] public string Id { get; set; } = id;
  public string Username { get; set; } = username;
  public string Password { get; set; } = password;
}

class Entry
{
  [Key] public int Id { get; set; }
  [Required] public string UserId { get; set; } = "";
  public int Weekday { get; set; }
  public int weeknum { get; set; }
  public string text { get; set; } = "";
}
