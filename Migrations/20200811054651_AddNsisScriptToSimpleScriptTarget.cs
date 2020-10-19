using Microsoft.EntityFrameworkCore.Migrations;

namespace ByodLauncher.Migrations
{
    public partial class AddNsisScriptToSimpleScriptTarget : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "NsisScript",
                table: "Targets",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NsisScript",
                table: "Targets");
        }
    }
}
