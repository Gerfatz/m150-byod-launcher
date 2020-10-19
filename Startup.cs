using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using ByodLauncher.Hubs;
using ByodLauncher.Models;
using ByodLauncher.Services;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Pomelo.EntityFrameworkCore.MySql.Infrastructure;

namespace ByodLauncher
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        private readonly string LocalhostCorsPolicy = "_localhostCorsPolicy";
        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddDistributedMemoryCache();

            services.AddSession(options =>
            {
                options.IdleTimeout = TimeSpan.FromMinutes(45);
                options.Cookie.HttpOnly = true;
                options.Cookie.IsEssential = true;
                options.Cookie.Name = "BYOD Laucher";
                options.Cookie.SameSite = SameSiteMode.Strict;
            });

            services.AddAuthentication(options =>
                {
                    options.DefaultChallengeScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                    options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                    options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
                })
                .AddCookie(options =>
                {
                    options.Cookie.HttpOnly = true;
                    options.Cookie.IsEssential = true;
                    options.Cookie.Name = "ByodLauncherAuth";
                    options.Cookie.SameSite = SameSiteMode.Strict;
                    options.LoginPath = "/Login";

                    options.Events.OnRedirectToAccessDenied =
                        options.Events.OnRedirectToLogin = ctx =>
                        {
                            if (ctx.Request.Path.StartsWithSegments("/api") &&
                                ctx.Response.StatusCode == StatusCodes.Status200OK)
                            {
                                ctx.Response.StatusCode = StatusCodes.Status401Unauthorized;
                            }
                            else
                            {
                                ctx.Response.Redirect(ctx.RedirectUri);
                            }

                            return Task.CompletedTask;
                        };
                });

            var connectionString = Configuration.GetConnectionString("MariaDb");
            services.AddDbContext<ByodLauncherContext>(options => options
                .UseMySql(connectionString, mySqlOptions => mySqlOptions
                    .ServerVersion(new Version(10, 4, 7), ServerType.MariaDb)
                    .EnableRetryOnFailure()
                )
            );

            services.AddScoped<SessionCodeService>();

            services.AddCors(options =>
            {
                options.AddPolicy(LocalhostCorsPolicy,
                    builder =>
                    {
                        builder.AllowAnyOrigin()
                            .AllowAnyHeader()
                            .AllowAnyMethod()
                            .AllowCredentials();
                    });
            });

            services.AddAutoMapper(typeof(Startup));
            services.AddSignalR();
            services.AddSpaStaticFiles(options => { options.RootPath = "wwwroot/dist"; });
            services.AddControllers();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
            });

            app.UseCors(LocalhostCorsPolicy);

            // app.UseHttpsRedirection();

            app.Use(async (context, next) =>
            {
                context.Response.Headers.Add("X-Frame-Options", "SAMEORIGIN");

                Dictionary<string, List<string>> sources = new Dictionary<string, List<string>>
                {
                    ["script-src"] = new List<string> {"'self'", "'nonce-QllPRCBMYXVuY2hlciB2b24gUGV0ZXIgR2lzbGVy'"},
                    ["style-src"] = new List<string>
                    {
                        "'self'", "https://fonts.googleapis.com/", "https://use.fontawesome.com/",
                        "'nonce-QllPRCBMYXVuY2hlciB2b24gUGV0ZXIgR2lzbGVy'"
                    },
                    ["font-src"] = new List<string>
                        {"'self'", "https://fonts.gstatic.com/ https://use.fontawesome.com/"},
                    ["img-src"] = new List<string> {"'self'"},
                    ["frame-ancestors"] = new List<string> {"'none'"},
                    ["connect-src"] = new List<string> {"'self'"},
                    ["default-src"] = new List<string> {"'self'"},
                };

                if (env.IsDevelopment())
                {
                    sources["script-src"].Add("'unsafe-eval'");
                    sources["style-src"].Add("'unsafe-inline'");

                    foreach (var keyValuePair in sources)
                    {
                        keyValuePair.Value.RemoveAll(source => source.StartsWith("'nonce-"));
                    }
                }

                StringBuilder sb = new StringBuilder();

                foreach (KeyValuePair<string, List<string>> entry in sources)
                {
                    sb.Append(entry.Key + " " + string.Join(' ', entry.Value) + "; ");
                }

                context.Response.Headers.Add("Content-Security-Policy", sb.ToString());
                await next();
            });

            app.UseRouting();
            app.UseAuthorization();
            app.UseSession();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapHub<SessionHub>("sessionHub");
            });

            app.UseFileServer(new FileServerOptions
            {
                FileProvider = new PhysicalFileProvider(Configuration["FileUpload:FilesystemAbsolutePath"]),
                RequestPath = Configuration["FileUpload:UriPathSegment"],
                EnableDirectoryBrowsing = false
            });

            app.UseSpaStaticFiles();
            app.UseSpa(builder =>
            {
                if (env.IsDevelopment())
                {
                    builder.UseProxyToSpaDevelopmentServer("http://localhost:8080");
                }
            });
        }
    }
}