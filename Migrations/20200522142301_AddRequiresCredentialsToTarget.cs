using Microsoft.EntityFrameworkCore.Migrations;

namespace ByodLauncher.Migrations
{
    public partial class AddRequiresCredentialsToTarget : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "RequiresCredentials",
                table: "Targets",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RequiresCredentials",
                table: "Targets");
        }
    }
}
