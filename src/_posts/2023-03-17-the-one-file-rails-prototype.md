---
layout: post
published: true
title: The one file Ruby on Rails prototype
date: 2023-03-17T14:30:00+01:00
summary: "Use a one file Ruby on Rails to prototype your domain model, attribute refactoring..."
image:
main_image_description:
---

This is the greatest untalked Ruby on Rails feature. 
Quickly validate your implementation ideas using a one file Ruby on Rails application.

Rails is know for its folder structure. This Structure is not required to prototype some ideas.

Sample of this kind of files can be found on the **Contribute to Ruby on Rails guide** under [Create an executable test case](https://guides.rubyonrails.org/contributing_to_ruby_on_rails.html#create-an-executable-test-case) chapter

### Here is the one I'm using a lot.
It uses sqlite. The database is not persisted.
The database connection can be changed to use your prefered database.

**The feedback loop is so fast, it's unbelievable.**

1. update the script, change an association, validation, database structure
2. execute the script

```ruby
# frozen_string_literal: true

require "bundler/inline"

gemfile(true) do
  source "https://rubygems.org"

  git_source(:github) { |repo| "https://github.com/#{repo}.git" }

  # Activate the gem you are reporting the issue against.
  gem "activerecord", "~> 7.0.0"
  gem "sqlite3"
end

require "active_record"
require "minitest/autorun"
require "logger"

# This connection will do for database-independent bug reports.
ActiveRecord::Base.establish_connection(adapter: "sqlite3", database: ":memory:")
ActiveRecord::Base.logger = Logger.new(STDOUT)

ActiveRecord::Schema.define do
  create_table :posts, force: true do |t|
  end

  create_table :comments, force: true do |t|
    t.integer :post_id
  end
end

class Post < ActiveRecord::Base
  has_many :comments
end

class Comment < ActiveRecord::Base
  belongs_to :post
end

class BugTest < Minitest::Test
  def test_association_stuff
    post = Post.create!
    post.comments << Comment.create!

    assert_equal 1, post.comments.count
    assert_equal 1, Comment.count
    assert_equal post.id, Comment.first.post.id
  end
end
```

Put this in a `ruby_on_rails_test.rb` file and run it with `ruby ruby_on_rails_test.rb` command

```txt
❯ ruby ruby_on_rails_test.rb
Fetching gem metadata from https://rubygems.org/........
Resolving dependencies...
Using minitest 5.18.0
Using bundler 2.4.2
Using concurrent-ruby 1.2.2
Using sqlite3 1.6.1 (arm64-darwin)
Using i18n 1.12.0
Using tzinfo 2.0.6
Using activesupport 7.0.4.3
Using activemodel 7.0.4.3
Using activerecord 7.0.4.3
-- create_table(:posts, {:force=>true})
D, [2023-03-17T14:40:50.834880 #76622] DEBUG -- :    (0.0ms)  DROP TABLE IF EXISTS "posts"
D, [2023-03-17T14:40:50.835074 #76622] DEBUG -- :    (0.1ms)  CREATE TABLE "posts" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL)
   -> 0.0028s
-- create_table(:comments, {:force=>true})
D, [2023-03-17T14:40:50.835176 #76622] DEBUG -- :    (0.0ms)  DROP TABLE IF EXISTS "comments"
D, [2023-03-17T14:40:50.835246 #76622] DEBUG -- :    (0.0ms)  CREATE TABLE "comments" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "post_id" integer)
   -> 0.0001s
D, [2023-03-17T14:40:50.845197 #76622] DEBUG -- :    (0.1ms)  CREATE TABLE "ar_internal_metadata" ("key" varchar NOT NULL PRIMARY KEY, "value" varchar, "created_at" datetime(6) NOT NULL, "updated_at" datetime(6) NOT NULL)
D, [2023-03-17T14:40:50.848454 #76622] DEBUG -- :   ActiveRecord::InternalMetadata Load (0.0ms)  SELECT "ar_internal_metadata".* FROM "ar_internal_metadata" WHERE "ar_internal_metadata"."key" = ? LIMIT ?  [["key", "environment"], ["LIMIT", 1]]
D, [2023-03-17T14:40:50.850314 #76622] DEBUG -- :   TRANSACTION (0.0ms)  begin transaction
D, [2023-03-17T14:40:50.850414 #76622] DEBUG -- :   ActiveRecord::InternalMetadata Create (0.0ms)  INSERT INTO "ar_internal_metadata" ("key", "value", "created_at", "updated_at") VALUES (?, ?, ?, ?)  [["key", "environment"], ["value", "default_env"], ["created_at", "2023-03-17 13:40:50.850146"], ["updated_at", "2023-03-17 13:40:50.850146"]]
D, [2023-03-17T14:40:50.850480 #76622] DEBUG -- :   TRANSACTION (0.0ms)  commit transaction
Run options: --seed 9760

# Running:

D, [2023-03-17T14:40:50.854486 #76622] DEBUG -- :   TRANSACTION (0.0ms)  begin transaction
D, [2023-03-17T14:40:50.854541 #76622] DEBUG -- :   Post Create (0.0ms)  INSERT INTO "posts" DEFAULT VALUES
D, [2023-03-17T14:40:50.854605 #76622] DEBUG -- :   TRANSACTION (0.0ms)  commit transaction
D, [2023-03-17T14:40:50.857410 #76622] DEBUG -- :   TRANSACTION (0.0ms)  begin transaction
D, [2023-03-17T14:40:50.857451 #76622] DEBUG -- :   Comment Create (0.0ms)  INSERT INTO "comments" DEFAULT VALUES
D, [2023-03-17T14:40:50.857495 #76622] DEBUG -- :   TRANSACTION (0.0ms)  commit transaction
D, [2023-03-17T14:40:50.859013 #76622] DEBUG -- :   TRANSACTION (0.0ms)  begin transaction
D, [2023-03-17T14:40:50.859068 #76622] DEBUG -- :   Comment Update (0.0ms)  UPDATE "comments" SET "post_id" = ? WHERE "comments"."id" = ?  [["post_id", 1], ["id", 1]]
D, [2023-03-17T14:40:50.859123 #76622] DEBUG -- :   TRANSACTION (0.0ms)  commit transaction
D, [2023-03-17T14:40:50.859367 #76622] DEBUG -- :   Comment Count (0.0ms)  SELECT COUNT(*) FROM "comments" WHERE "comments"."post_id" = ?  [["post_id", 1]]
D, [2023-03-17T14:40:50.859457 #76622] DEBUG -- :   Comment Count (0.0ms)  SELECT COUNT(*) FROM "comments"
D, [2023-03-17T14:40:50.859628 #76622] DEBUG -- :   Comment Load (0.0ms)  SELECT "comments".* FROM "comments" ORDER BY "comments"."id" ASC LIMIT ?  [["LIMIT", 1]]
D, [2023-03-17T14:40:50.859949 #76622] DEBUG -- :   Post Load (0.0ms)  SELECT "posts".* FROM "posts" WHERE "posts"."id" = ? LIMIT ?  [["id", 1], ["LIMIT", 1]]
.

Finished in 0.006944s, 144.0092 runs/s, 432.0276 assertions/s.

1 runs, 3 assertions, 0 failures, 0 errors, 0 skips
```

Please try it.

