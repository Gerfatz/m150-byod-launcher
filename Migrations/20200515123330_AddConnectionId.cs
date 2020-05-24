using Microsoft.EntityFrameworkCore.Migrations;

namespace ByodLauncher.Migrations
{
    public partial class AddConnectionId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ConnectionId",
                table: "Participants",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ConnectionId",
                table: "Directors",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ConnectionId",
                table: "Participants");

            migrationBuilder.DropColumn(
                name: "ConnectionId",
                table: "Directors");
        }
    }
}
