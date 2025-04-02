using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;

class Program
{
    static void Main()
    {
        int port = 5000;
        var server = new Server(port);
        var database = new Database();

        Console.WriteLine("The server is running");
        Console.WriteLine($"Main Page: http://localhost:{port}/website/pages/index.html");

        while (true)
        {
            (var request, var response) = server.WaitForRequest();
            Console.WriteLine($"Received a request with the path: {request.Path}");

            if (request.Path == "/signup" && request.Method == "POST")
            {
                var username = request.GetParam("username");
                var password = request.GetParam("password");
                
                if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
                {
                    response.SetStatusCode(400);
                    response.Send("Missing username or password");
                    continue;
                }

                if (database.Users.Any(u => u.Username == username))
                {
                    response.SetStatusCode(409);
                    response.Send("Username already exists");
                    continue;
                }

                string hashedPassword = HashPassword(password);
                var user = new User(Guid.NewGuid().ToString(), username, hashedPassword);
                database.Users.Add(user);
                database.SaveChanges();

                response.SetStatusCode(201);
                response.Send("User created successfully");
            }
            else if (request.Path == "/login" && request.Method == "POST")
            {
                var username = request.GetParam("username");
                var password = request.GetParam("password");
                
                var user = database.Users.FirstOrDefault(u => u.Username == username);
                if (user == null || !VerifyPassword(password, user.Password))
                {
                    response.SetStatusCode(401);
                    response.Send("Invalid credentials");
                    continue;
                }

                response.SetStatusCode(200);
                response.Send("Login successful");
            }
            else if (File.Exists(request.Path))
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
                response.SetStatusCode(405);
            }

            response.Close();
        }
    }

    static string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(hashedBytes);
    }

    static bool VerifyPassword(string password, string hashedPassword)
    {
        return HashPassword(password) == hashedPassword;
    }
}

class Database : DbBase
{
    public Database() : base("database") { }
    public DbSet<User> Users { get; set; }
}

class User
{
    public string Id { get; set; }
    public string Username { get; set; }
    public string Password { get; set; }

    public User(string id, string username, string password)
    {
        Id = id;
        Username = username;
        Password = password;
    }
}