using Microsoft.EntityFrameworkCore.Migrations;

namespace ByodLauncher.Migrations
{
    public partial class AddCurrentStageNumberToSession : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CurrentStage",
                table: "Sessions",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CurrentStage",
                table: "Sessions");
        }
    }
}
