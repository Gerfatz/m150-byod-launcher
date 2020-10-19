﻿// <auto-generated />
using System;
using ByodLauncher.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace ByodLauncher.Migrations
{
    [DbContext(typeof(ByodLauncherContext))]
    [Migration("20200811054651_AddNsisScriptToSimpleScriptTarget")]
    partial class AddNsisScriptToSimpleScriptTarget
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "3.1.3")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("ByodLauncher.Models.Category", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("varchar(100) CHARACTER SET utf8mb4")
                        .HasMaxLength(100);

                    b.HasKey("Id");

                    b.ToTable("Categories");

                    b.HasData(
                        new
                        {
                            Id = new Guid("34917d2d-bd78-42d8-8424-d0ebb83486ef"),
                            Title = "Category A"
                        },
                        new
                        {
                            Id = new Guid("070b92f1-b9d8-4595-a2d2-84cec57f3d82"),
                            Title = "Category B"
                        });
                });

            modelBuilder.Entity("ByodLauncher.Models.Director", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<string>("ConnectionId")
                        .HasColumnType("longtext CHARACTER SET utf8mb4");

                    b.Property<string>("DisplayName")
                        .HasColumnType("longtext CHARACTER SET utf8mb4");

                    b.Property<string>("Email")
                        .HasColumnType("longtext CHARACTER SET utf8mb4");

                    b.HasKey("Id");

                    b.ToTable("Directors");
                });

            modelBuilder.Entity("ByodLauncher.Models.Participant", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<string>("ConnectionId")
                        .HasColumnType("longtext CHARACTER SET utf8mb4");

                    b.Property<string>("DisplayName")
                        .IsRequired()
                        .HasColumnType("varchar(100) CHARACTER SET utf8mb4")
                        .HasMaxLength(100);

                    b.Property<Guid>("SessionId")
                        .HasColumnType("char(36)");

                    b.HasKey("Id");

                    b.HasIndex("SessionId");

                    b.ToTable("Participants");
                });

            modelBuilder.Entity("ByodLauncher.Models.Session", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<string>("AccessCode")
                        .HasColumnType("longtext CHARACTER SET utf8mb4");

                    b.Property<int?>("CurrentStage")
                        .HasColumnType("int");

                    b.Property<Guid>("DirectorId")
                        .HasColumnType("char(36)");

                    b.Property<string>("EditCode")
                        .HasColumnType("longtext CHARACTER SET utf8mb4");

                    b.Property<string>("Title")
                        .HasColumnType("longtext CHARACTER SET utf8mb4");

                    b.HasKey("Id");

                    b.HasIndex("DirectorId");

                    b.ToTable("Sessions");
                });

            modelBuilder.Entity("ByodLauncher.Models.Stage", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<int>("SequenceNumber")
                        .HasColumnType("int");

                    b.Property<Guid>("SessionId")
                        .HasColumnType("char(36)");

                    b.Property<string>("Title")
                        .HasColumnType("longtext CHARACTER SET utf8mb4");

                    b.HasKey("Id");

                    b.HasIndex("SessionId");

                    b.ToTable("Stages");
                });

            modelBuilder.Entity("ByodLauncher.Models.StageTarget", b =>
                {
                    b.Property<Guid>("StageId")
                        .HasColumnType("char(36)");

                    b.Property<Guid>("TargetId")
                        .HasColumnType("char(36)");

                    b.HasKey("StageId", "TargetId");

                    b.HasIndex("TargetId");

                    b.ToTable("StageTargets");
                });

            modelBuilder.Entity("ByodLauncher.Models.Target", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<Guid?>("CategoryId")
                        .HasColumnType("char(36)");

                    b.Property<string>("Description")
                        .HasColumnType("longtext CHARACTER SET utf8mb4");

                    b.Property<string>("Discriminator")
                        .IsRequired()
                        .HasColumnType("longtext CHARACTER SET utf8mb4");

                    b.Property<bool>("RequiresCredentials")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("Title")
                        .HasColumnType("longtext CHARACTER SET utf8mb4");

                    b.HasKey("Id");

                    b.HasIndex("CategoryId");

                    b.ToTable("Targets");

                    b.HasDiscriminator<string>("Discriminator").HasValue("Target");
                });

            modelBuilder.Entity("ByodLauncher.Models.TargetDependency", b =>
                {
                    b.Property<Guid>("DependeeId")
                        .HasColumnType("char(36)");

                    b.Property<Guid>("DependerId")
                        .HasColumnType("char(36)");

                    b.HasKey("DependeeId", "DependerId");

                    b.HasIndex("DependerId");

                    b.ToTable("TargetDependencies");
                });

            modelBuilder.Entity("ByodLauncher.Models.TargetResult", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<string>("Details")
                        .HasColumnType("longtext CHARACTER SET utf8mb4");

                    b.Property<Guid>("ParticipantId")
                        .HasColumnType("char(36)");

                    b.Property<bool>("Success")
                        .HasColumnType("tinyint(1)");

                    b.Property<Guid>("TargetId")
                        .HasColumnType("char(36)");

                    b.Property<DateTime>("Timestamp")
                        .HasColumnType("datetime(6)");

                    b.HasKey("Id");

                    b.HasIndex("ParticipantId");

                    b.HasIndex("TargetId");

                    b.ToTable("TargetResults");
                });

            modelBuilder.Entity("ByodLauncher.Models.TutorialStep", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<string>("Instruction")
                        .HasColumnType("longtext CHARACTER SET utf8mb4");

                    b.Property<int>("SequenceNumber")
                        .HasColumnType("int");

                    b.Property<string>("Title")
                        .HasColumnType("longtext CHARACTER SET utf8mb4");

                    b.Property<Guid>("TutorialTargetId")
                        .HasColumnType("char(36)");

                    b.HasKey("Id");

                    b.HasIndex("TutorialTargetId");

                    b.ToTable("TutorialSteps");
                });

            modelBuilder.Entity("ByodLauncher.Models.SimpleScriptTarget", b =>
                {
                    b.HasBaseType("ByodLauncher.Models.Target");

                    b.Property<string>("NsisScript")
                        .HasColumnType("longtext CHARACTER SET utf8mb4");

                    b.Property<string>("Script")
                        .HasColumnType("longtext CHARACTER SET utf8mb4");

                    b.HasDiscriminator().HasValue("SimpleScriptTarget");

                    b.HasData(
                        new
                        {
                            Id = new Guid("a0309844-509f-4a70-b9f1-add178822346"),
                            CategoryId = new Guid("34917d2d-bd78-42d8-8424-d0ebb83486ef"),
                            RequiresCredentials = false,
                            Title = "SST 1",
                            Script = "..."
                        },
                        new
                        {
                            Id = new Guid("7ab4d632-f86f-4b23-bff0-7104266fa866"),
                            CategoryId = new Guid("34917d2d-bd78-42d8-8424-d0ebb83486ef"),
                            RequiresCredentials = false,
                            Title = "SST 2",
                            Script = "..."
                        });
                });

            modelBuilder.Entity("ByodLauncher.Models.TutorialTarget", b =>
                {
                    b.HasBaseType("ByodLauncher.Models.Target");

                    b.HasDiscriminator().HasValue("TutorialTarget");

                    b.HasData(
                        new
                        {
                            Id = new Guid("f611bbd1-f8d9-4265-a40f-1453e4bc8a2b"),
                            CategoryId = new Guid("070b92f1-b9d8-4595-a2d2-84cec57f3d82"),
                            RequiresCredentials = false,
                            Title = "TT 1"
                        },
                        new
                        {
                            Id = new Guid("e71b5088-2bcd-4e4a-982a-d36b1dcd3e6c"),
                            CategoryId = new Guid("070b92f1-b9d8-4595-a2d2-84cec57f3d82"),
                            RequiresCredentials = false,
                            Title = "TT 2"
                        });
                });

            modelBuilder.Entity("ByodLauncher.Models.Participant", b =>
                {
                    b.HasOne("ByodLauncher.Models.Session", "Session")
                        .WithMany("Participants")
                        .HasForeignKey("SessionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("ByodLauncher.Models.Session", b =>
                {
                    b.HasOne("ByodLauncher.Models.Director", "Director")
                        .WithMany("Sessions")
                        .HasForeignKey("DirectorId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("ByodLauncher.Models.Stage", b =>
                {
                    b.HasOne("ByodLauncher.Models.Session", "Session")
                        .WithMany("Stages")
                        .HasForeignKey("SessionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("ByodLauncher.Models.StageTarget", b =>
                {
                    b.HasOne("ByodLauncher.Models.Stage", "Stage")
                        .WithMany("StageTargets")
                        .HasForeignKey("StageId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ByodLauncher.Models.Target", "Target")
                        .WithMany("StageTargets")
                        .HasForeignKey("TargetId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("ByodLauncher.Models.Target", b =>
                {
                    b.HasOne("ByodLauncher.Models.Category", "Category")
                        .WithMany("Targets")
                        .HasForeignKey("CategoryId");
                });

            modelBuilder.Entity("ByodLauncher.Models.TargetDependency", b =>
                {
                    b.HasOne("ByodLauncher.Models.Target", "Dependee")
                        .WithMany("Dependees")
                        .HasForeignKey("DependeeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ByodLauncher.Models.Target", "Depender")
                        .WithMany("Dependers")
                        .HasForeignKey("DependerId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("ByodLauncher.Models.TargetResult", b =>
                {
                    b.HasOne("ByodLauncher.Models.Participant", "Participant")
                        .WithMany()
                        .HasForeignKey("ParticipantId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("ByodLauncher.Models.Target", "Type")
                        .WithMany("Results")
                        .HasForeignKey("TargetId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });

            modelBuilder.Entity("ByodLauncher.Models.TutorialStep", b =>
                {
                    b.HasOne("ByodLauncher.Models.TutorialTarget", "TutorialTarget")
                        .WithMany("Steps")
                        .HasForeignKey("TutorialTargetId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}
