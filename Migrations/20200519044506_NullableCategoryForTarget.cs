using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace ByodLauncher.Migrations
{
    public partial class NullableCategoryForTarget : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Targets_Categories_CategoryId",
                table: "Targets");

            migrationBuilder.AlterColumn<Guid>(
                name: "CategoryId",
                table: "Targets",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "char(36)");

            migrationBuilder.AddForeignKey(
                name: "FK_Targets_Categories_CategoryId",
                table: "Targets",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Targets_Categories_CategoryId",
                table: "Targets");

            migrationBuilder.AlterColumn<Guid>(
                name: "CategoryId",
                table: "Targets",
                type: "char(36)",
                nullable: false,
                oldClrType: typeof(Guid),
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Targets_Categories_CategoryId",
                table: "Targets",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
