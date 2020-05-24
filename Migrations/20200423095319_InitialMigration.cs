using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace ByodLauncher.Migrations
{
    public partial class InitialMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Categories",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Title = table.Column<string>(maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Categories", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Directors",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    DisplayName = table.Column<string>(nullable: true),
                    Email = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Directors", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Targets",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Title = table.Column<string>(nullable: true),
                    Description = table.Column<string>(nullable: true),
                    CategoryId = table.Column<Guid>(nullable: false),
                    Discriminator = table.Column<string>(nullable: false),
                    Script = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Targets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Targets_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Sessions",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Title = table.Column<string>(nullable: true),
                    AccessCode = table.Column<string>(nullable: true),
                    EditCode = table.Column<string>(nullable: true),
                    DirectorId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sessions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Sessions_Directors_DirectorId",
                        column: x => x.DirectorId,
                        principalTable: "Directors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TargetDependencies",
                columns: table => new
                {
                    DependerId = table.Column<Guid>(nullable: false),
                    DependeeId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TargetDependencies", x => new { x.DependeeId, x.DependerId });
                    table.ForeignKey(
                        name: "FK_TargetDependencies_Targets_DependeeId",
                        column: x => x.DependeeId,
                        principalTable: "Targets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TargetDependencies_Targets_DependerId",
                        column: x => x.DependerId,
                        principalTable: "Targets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TutorialSteps",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    SequenceNumber = table.Column<int>(nullable: false),
                    Title = table.Column<string>(nullable: true),
                    Instruction = table.Column<string>(nullable: true),
                    TutorialTargetId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TutorialSteps", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TutorialSteps_Targets_TutorialTargetId",
                        column: x => x.TutorialTargetId,
                        principalTable: "Targets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Participants",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    DisplayName = table.Column<string>(maxLength: 100, nullable: false),
                    SessionId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Participants", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Participants_Sessions_SessionId",
                        column: x => x.SessionId,
                        principalTable: "Sessions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Stages",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    SequenceNumber = table.Column<int>(nullable: false),
                    Title = table.Column<string>(nullable: true),
                    SessionId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Stages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Stages_Sessions_SessionId",
                        column: x => x.SessionId,
                        principalTable: "Sessions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TargetResults",
                columns: table => new
                {
                    Id = table.Column<Guid>(nullable: false),
                    Success = table.Column<bool>(nullable: false),
                    Details = table.Column<string>(nullable: true),
                    ParticipantId = table.Column<Guid>(nullable: false),
                    TargetId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TargetResults", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TargetResults_Participants_ParticipantId",
                        column: x => x.ParticipantId,
                        principalTable: "Participants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TargetResults_Targets_TargetId",
                        column: x => x.TargetId,
                        principalTable: "Targets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "StageTargets",
                columns: table => new
                {
                    StageId = table.Column<Guid>(nullable: false),
                    TargetId = table.Column<Guid>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StageTargets", x => new { x.StageId, x.TargetId });
                    table.ForeignKey(
                        name: "FK_StageTargets_Stages_StageId",
                        column: x => x.StageId,
                        principalTable: "Stages",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StageTargets_Targets_TargetId",
                        column: x => x.TargetId,
                        principalTable: "Targets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "Title" },
                values: new object[] { new Guid("34917d2d-bd78-42d8-8424-d0ebb83486ef"), "Category A" });

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "Title" },
                values: new object[] { new Guid("070b92f1-b9d8-4595-a2d2-84cec57f3d82"), "Category B" });

            migrationBuilder.InsertData(
                table: "Targets",
                columns: new[] { "Id", "CategoryId", "Description", "Discriminator", "Title", "Script" },
                values: new object[,]
                {
                    { new Guid("a0309844-509f-4a70-b9f1-add178822346"), new Guid("34917d2d-bd78-42d8-8424-d0ebb83486ef"), null, "SimpleScriptTarget", "SST 1", "..." },
                    { new Guid("7ab4d632-f86f-4b23-bff0-7104266fa866"), new Guid("34917d2d-bd78-42d8-8424-d0ebb83486ef"), null, "SimpleScriptTarget", "SST 2", "..." }
                });

            migrationBuilder.InsertData(
                table: "Targets",
                columns: new[] { "Id", "CategoryId", "Description", "Discriminator", "Title" },
                values: new object[,]
                {
                    { new Guid("f611bbd1-f8d9-4265-a40f-1453e4bc8a2b"), new Guid("070b92f1-b9d8-4595-a2d2-84cec57f3d82"), null, "TutorialTarget", "TT 1" },
                    { new Guid("e71b5088-2bcd-4e4a-982a-d36b1dcd3e6c"), new Guid("070b92f1-b9d8-4595-a2d2-84cec57f3d82"), null, "TutorialTarget", "TT 2" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Participants_SessionId",
                table: "Participants",
                column: "SessionId");

            migrationBuilder.CreateIndex(
                name: "IX_Sessions_DirectorId",
                table: "Sessions",
                column: "DirectorId");

            migrationBuilder.CreateIndex(
                name: "IX_Stages_SessionId",
                table: "Stages",
                column: "SessionId");

            migrationBuilder.CreateIndex(
                name: "IX_StageTargets_TargetId",
                table: "StageTargets",
                column: "TargetId");

            migrationBuilder.CreateIndex(
                name: "IX_TargetDependencies_DependerId",
                table: "TargetDependencies",
                column: "DependerId");

            migrationBuilder.CreateIndex(
                name: "IX_TargetResults_ParticipantId",
                table: "TargetResults",
                column: "ParticipantId");

            migrationBuilder.CreateIndex(
                name: "IX_TargetResults_TargetId",
                table: "TargetResults",
                column: "TargetId");

            migrationBuilder.CreateIndex(
                name: "IX_Targets_CategoryId",
                table: "Targets",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_TutorialSteps_TutorialTargetId",
                table: "TutorialSteps",
                column: "TutorialTargetId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StageTargets");

            migrationBuilder.DropTable(
                name: "TargetDependencies");

            migrationBuilder.DropTable(
                name: "TargetResults");

            migrationBuilder.DropTable(
                name: "TutorialSteps");

            migrationBuilder.DropTable(
                name: "Stages");

            migrationBuilder.DropTable(
                name: "Participants");

            migrationBuilder.DropTable(
                name: "Targets");

            migrationBuilder.DropTable(
                name: "Sessions");

            migrationBuilder.DropTable(
                name: "Categories");

            migrationBuilder.DropTable(
                name: "Directors");
        }
    }
}
