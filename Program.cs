using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
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

      Console.WriteLine($"Recieved a request with the path: {request.Path}");

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

            var user = database.Users
              .FirstOrDefault(user => user.Username == username && user.Password == password);

            response.Send(user?.Id);
          }
          response.SetStatusCode(405);

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
  public DbSet<CalendarEntry> CalendarEntries { get; set; } = default!;
}


class User(string id, string username, string password)
{
  [Key] public string Id { get; set; } = id;
  public string Username { get; set; } = username;
  public string Password { get; set; } = password;
}

class CalendarEntry
{
  [Key] public int Id { get; set; }

  [Required] public string UserId { get; set; } = "";
  public int WeekNumber { get; set; }

  public string Sunday { get; set; } = "";
  public string Monday { get; set; } = "";
  public string Tuesday { get; set; } = "";
  public string Wednesday { get; set; } = "";
  public string Thursday { get; set; } = "";
  public string Friday { get; set; } = "";
  public string Saturday { get; set; } = "";
}

