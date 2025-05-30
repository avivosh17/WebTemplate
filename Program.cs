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
            var data = request.GetBody<EntryRequest>();
            var existing = database.Entries
              .FirstOrDefault(e => e.UserId == data.userId && e.weeknum == data.weeknum && e.Weekday == data.weekday);

            if (existing != null)
              existing.text = data.text;
            else
              database.Entries.Add(new Entry {
                UserId = data.userId,
                weeknum = data.weeknum,
                Weekday = data.weekday,
                text = data.text
              });

            response.Send(true);
          }
          else if (request.Path == "loadWeek")
          {
            var data = request.GetBody<WeekRequest>();
            var entries = database.Entries
              .Where(e => e.UserId == data.userId && e.weeknum == data.weeknum)
              .ToDictionary(e => e.Weekday, e => e.text);

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

class EntryRequest
{
  public string userId { get; set; } = "";
  public int weeknum { get; set; }
  public int weekday { get; set; }
  public string text { get; set; } = "";
}

class WeekRequest
{
  public string userId { get; set; } = "";
  public int weeknum { get; set; }
}
