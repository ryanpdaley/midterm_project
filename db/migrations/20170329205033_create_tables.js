exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable("google_user", function (table) {
      table.string("google_id").primary();
      table.string("name");
      table.string("email");
    }),
    knex.schema.createTable("point", function (table) {
      table.increments("id");
      table.integer("list_id").references("list.id");
      table.string("user_id").references("google_user.google_id");
      table.string("title");
      table.text("address");
      table.string("long");
      table.string("lat");
      table.text("desc");
      table.string("img_url");
    }),
    knex.schema.createTable("list", function (table) {
      table.increments("id");
      table.string("name");
      table.string("user_id").references("google_user.google_id");
    }),
    knex.schema.createTable("favourite", function (table) {
      table.increments("id");
      table.integer("list_id").references("list.id");
      table.string("user_id").references("google_user.google_id");
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTableIfExists("favourite"),
    knex.schema.dropTableIfExists("list"),
    knex.schema.dropTableIfExists("point"),
    knex.schema.dropTableIfExists("user")
  ]);
};
