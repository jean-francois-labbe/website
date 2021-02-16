---
layout: post
published: false
title:  "Create a dashboard with Hotwire"
date: 2020-12-24
summary: Hotwire allows use to decouple our application and easily display data from different models in the same page
image: 
main_image_description: 
---

## Dashboard
Displaying data from different models could be challenging if you aim to keep small controllers and quick responses.

One simple way to simplify dashboard creation would be to have one specific endpoint per widget

## Hotwire
[Hotwire](https://hotwire.dev), a nice present was released on 22 dec 2020.

An alternative approach to building modern web applications without using much JavaScript by sending HTML instead of JSON over the wire. This includes our brand-new Turbo framework and pairs with Stimulus 2.0

That Turbo framework is a set of complimentary techniques for speeding up page changes and form submissions, dividing complex pages into components, and stream partial page updates over WebSocket. All without writing any JavaScript at all.


## Let's build a simple dashboard
```ruby
rails new dashboard
```

Install [hotwire](https://github.com/hotwired/hotwire-rails)
```ruby
Add the hotwire-rails gem to your Gemfile: gem 'hotwire-rails'
Run ./bin/bundle install.
Run ./bin/rails hotwire:install
```

Generate some boilerplate
```ruby
rails g scaffold import name

rails d scaffold artists name genre
```
