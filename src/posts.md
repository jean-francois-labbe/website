---
layout: page
title: Posts
permalink: /posts/
---

<div class="mx-auto mb-24 prose prose-sm sm:prose lg:prose-lg xl:prose-xl">
<h1>Articles</h1>

{% for post in site.posts %}
<div class="mb-4">
<a href="{{ post.url }}" class="hover:text-red-500">{{ post.title }}</a>
<div>{{ post.summary }}</div>
<div class="text-base font-medium text-gray-500">{{ post.date | date_to_long_string }}</div>
</div>

{% endfor %}

</div>
