---
layout: page
title: Posts
permalink: /posts/
---

<div class="mx-auto prose prose-sm sm:prose lg:prose-lg xl:prose-xl mb-24">
<h1>Articles</h1>

{% for post in site.posts %}
<div class="mb-4">
<a href="{{ post.url }}" class="hover:text-red-500">{{ post.title }}</a>
<div>{{ post.summary }}</div>
</div>

{% endfor %}

</div>
