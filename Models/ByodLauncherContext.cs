using System;
using Microsoft.EntityFrameworkCore;
using ByodLauncher.Models.Dto;

namespace ByodLauncher.Models
{
    public class ByodLauncherContext : DbContext
    {
        public ByodLauncherContext(DbContextOptions<ByodLauncherContext> options)
            : base(options)
        {
        }

        public DbSet<Category> Categories { get; set; }
        public DbSet<Director> Directors { get; set; }
        public DbSet<Participant> Participants { get; set; }
        public DbSet<Session> Sessions { get; set; }
        public DbSet<SimpleScriptTarget> SimpleScriptTargets { get; set; }
        public DbSet<Stage> Stages { get; set; }
        public DbSet<StageTarget> StageTargets { get; set; }
        public DbSet<Target> Targets { get; set; }
        public DbSet<TargetDependency> TargetDependencies { get; set; }
        public DbSet<TargetResult> TargetResults { get; set; }
        public DbSet<TutorialStep> TutorialSteps { get; set; }
        public DbSet<TutorialTarget> TutorialTargets { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<StageTarget>()
                .HasKey(st => new {st.StageId, st.TargetId});
            modelBuilder.Entity<StageTarget>()
                .HasOne(st => st.Stage)
                .WithMany(s => s.StageTargets)
                .HasForeignKey(st => st.StageId);
            modelBuilder.Entity<StageTarget>()
                .HasOne(st => st.Target)
                .WithMany(t => t.StageTargets)
                .HasForeignKey(st => st.TargetId);

            modelBuilder.Entity<TargetDependency>()
                .HasKey(td => new {DependeeID = td.DependeeId, td.DependerId});
            modelBuilder.Entity<TargetDependency>()
                .HasOne(td => td.Dependee)
                .WithMany(d => d.Dependees)
                .HasForeignKey(td => td.DependeeId);
            modelBuilder.Entity<TargetDependency>()
                .HasOne(td => td.Depender)
                .WithMany(d => d.Dependers)
                .HasForeignKey(td => td.DependerId);

            // SEEDING


            // 6cb2683a-168f-4223-beca-d8c0a9a18d8c
            // 8235973b-4c43-41c1-bbb3-44c97a49ada6
            // 93f6fa47-16cc-4286-a9bb-4a56445ad55f
            // 98233434-9e7d-4a45-b0c8-7ce3d27fcfb4
            // f9491bd0-a4cc-4741-bdbb-8ce125a8e590
            // b91552ca-415f-4e4e-aa6f-de90d17e5e6a
            // 90b5cd0d-6a2c-47e3-9d31-50bf3eb5512d
            // 1f6b0b9f-9e1c-4b8b-b538-f07e7b84cf03
            // ec2ad31e-0423-45b8-9bb1-31de7a527f33
            // b95f4ca0-1ffa-48f8-8aba-77a183b64619
            // 15d23508-d5d8-4d5b-81a5-be44b6bf1106
            // 5c523812-a834-4e41-bfae-3fb2771d0347
            // ba23f349-ef07-4c6d-8949-2b613c9b6948
            // 685bb141-13b2-4e57-ba9d-cfdac01029d2

            // Category
            var categories = new Category[]
            {
                new Category
                {
                    Id = new Guid("34917d2d-bd78-42d8-8424-d0ebb83486ef"),
                    Title = "Category A"
                },
                new Category
                {
                    Id = new Guid("070b92f1-b9d8-4595-a2d2-84cec57f3d82"),
                    Title = "Category B"
                },
            };
            modelBuilder.Entity<Category>().HasData(categories);

            // SimpleScriptTarget
            var simpleScriptTargets = new SimpleScriptTarget[]
            {
                new SimpleScriptTarget
                {
                    Id = new Guid("a0309844-509f-4a70-b9f1-add178822346"),
                    Title = "SST 1",
                    CategoryId = categories[0].Id,
                    Script = "..."
                },
                new SimpleScriptTarget
                {
                    Id = new Guid("7ab4d632-f86f-4b23-bff0-7104266fa866"),
                    Title = "SST 2",
                    CategoryId = categories[0].Id,
                    Script = "..."
                },
            };
            modelBuilder.Entity<SimpleScriptTarget>().HasData(simpleScriptTargets);

            // TutorialTarget
            var tutorialTargets = new TutorialTarget[]
            {
                new TutorialTarget
                {
                    Id = new Guid("f611bbd1-f8d9-4265-a40f-1453e4bc8a2b"),
                    Title = "TT 1",
                    CategoryId = categories[1].Id
                },
                new TutorialTarget
                {
                    Id = new Guid("e71b5088-2bcd-4e4a-982a-d36b1dcd3e6c"),
                    Title = "TT 2",
                    CategoryId = categories[1].Id
                },
            };
            modelBuilder.Entity<TutorialTarget>().HasData(tutorialTargets);
            
            // Actually seed data
            // Database.EnsureCreated();
        }
    }
}