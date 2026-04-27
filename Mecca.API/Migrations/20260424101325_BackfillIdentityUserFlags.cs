using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mecca.API.Migrations
{
    /// <inheritdoc />
    public partial class BackfillIdentityUserFlags : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                UPDATE ""AspNetUsers""
                SET ""LockoutEnabled"" = TRUE,
                    ""AccessFailedCount"" = 0,
                    ""LockoutEnd"" = NULL
                WHERE ""LockoutEnabled"" = FALSE;
            ");

            migrationBuilder.Sql(@"
                UPDATE ""AspNetUsers""
                SET ""EmailConfirmed"" = TRUE
                WHERE ""EmailConfirmed"" = FALSE;
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
