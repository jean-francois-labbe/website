---
layout: post
published: true
title:  "How to describe a response containing an array with Rswag"
date: 2020-12-24
summary: Learn how to describe a response containing an array using Rswag with RubyOnRails
last_modified_at: 2020-12-24
image: 
main_image_description: 
keywords: RubyOnRails, development, associations, swagger, rswag
---

On a project I work on we use swagger to document api using the [rswag gem](https://github.com/rswag/rswag).
I noticed the responses were never described, in part because most of them return an array.

I poke around trying to find how to describe it using rswag.
After lots of trying and errors here is how to do it.

## Rspec code

```ruby
path '/api/v1/posts/{id}' do
  let(:post) { create :post }
  let(:id) { post.id }

  get 'show' do
    parameter name: :id, in: :path, type: :string, description: "post id", required: true
    response '200', 'show post with comments'do
      schema type: :object,
            properties: {
              title: { type: :string },
              content: { type: :string },
              comments: {
                type: :array,
                items: {
                  type: :object,
                  properties: {
                    content: { type: :string }
                  }
                }
              }
            }
      run_test!
    end
  end
end
```

## Produces this
<img src="/images/rswag_response_with_array/swagger_array_response.png" loading="lazy">
