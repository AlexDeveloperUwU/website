using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddProjectIndexes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Projects_Name",
                table: "Projects",
                column: "Name");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_Org",
                table: "Projects",
                column: "Org");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_Show",
                table: "Projects",
                column: "Show");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_ShowOnHomepage",
                table: "Projects",
                column: "ShowOnHomepage");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_Tech",
                table: "Projects",
                column: "Tech")
                .Annotation("Npgsql:IndexMethod", "gin");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Projects_Name",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_Projects_Org",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_Projects_Show",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_Projects_ShowOnHomepage",
                table: "Projects");

            migrationBuilder.DropIndex(
                name: "IX_Projects_Tech",
                table: "Projects");
        }
    }
}
