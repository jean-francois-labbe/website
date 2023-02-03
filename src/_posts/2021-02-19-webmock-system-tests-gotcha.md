---
layout: post
published: true
title: Webmock stubbed request not matched when running Rails system test
date: 2021-02-19T09:30:00+02:00
description: "Webmock stubbed request not matched when running Rails system test"
summary: When writing a new system test I was puzzled by Webmock behavior. A stubbed request was not matched when running rails test:system.
image:
main_image_description:
---

Today I was fighting with Webmock and Rails system testing.
I stubbed an external request using Webmock, it was correctly setup but never matched when running tests.

The test was looking like this, can you spot the issue?

```ruby
test "Can delete an article" do
  visit article_path(@article)
  stub_request(:get, "http://other.localhost:3001/api/v1/articles")
  page.accept_confirm do
    click_on "Delete article"
  end
end
```

It will fire an error looking like this
```ruby
WebMock::NetConnectNotAllowedError - Real HTTP connections are disabled. Unregistered request: GET http://other.localhost:3001/api/v1/articles with headers {'Accept'=>'*/*', 'Accept-Encoding'=>'gzip;q=1.0,deflate;q=0.6,identity;q=0.3', 'Host'=>'other.localhost:3001', 'User-Agent'=>'rest-client/2.1.0 (linux-gnu x86_64) ruby/2.7.1p83'}
You can stub this request with the following snippet:
stub_request(:get, "http://localhost:3001/api/v1/articles").
  with(
    headers: {
	  'Accept'=>'*/*',
	  'Accept-Encoding'=>'gzip;q=1.0,deflate;q=0.6,identity;q=0.3',
	  'Host'=>'localhost:3001',
	  'User-Agent'=>'rest-client/2.1.0 (linux-gnu x86_64) ruby/2.7.1p83',
    }).
  to_return(status: 200, body: "", headers: {})
============================================================:
```

## What is going on here?

There is a race condition between the System under test (the application) and the test bed (Capybara).
After the `page.accept_confirm` block has been executed there is nothing more to do in the test.

The next step for the test suite is to execute the teadown. Webmock by default is part of the teardown and it removes all the stubbed requests.
Don't forget that the system under test is running in parallel of Capybara.
When the application is finally executing the action related to the `click_on "Delete article"` action the stubbed request has already been
removed by the teardown.

Webmock then raises an error.

## How to fix this ?

To fix this you just need to add an assert or a find after the `click_on` in order for Capybara to wait.


```ruby
test "Can delete an article" do
  visit article_path(@article)
  stub_request(:get, "http://other.localhost:3001/api/v1/articles")
  page.accept_confirm do
    click_on "Delete article"
  end
  assert_selector "div.notifications", text: "Article deleted"
end
```

I noticed that using and headless browser fixed this issue, I don't know how safe it is, has the race condition is theoretically present.


## Conclusion

This may never happen to you as a test should assert something.

But you may hit this issue when writing your tests.
