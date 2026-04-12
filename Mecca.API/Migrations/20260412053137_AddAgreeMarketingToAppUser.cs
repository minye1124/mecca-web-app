using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mecca.API.Migrations
{
    /// <inheritdoc />
    public partial class AddAgreeMarketingToAppUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "AgreeMarketing",
                table: "AspNetUsers",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AgreeMarketing",
                table: "AspNetUsers");
        }
    }
}
