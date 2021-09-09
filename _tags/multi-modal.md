---
tag: "multi-modal"
layout: default
title: Papers Breif
subtitle: /pap/
description: PhD candidate, Computer Vision. Gamer.
---
<section class="intro">

	<div class="wrap">

		<h1>{{ page.title }}</h1>
		<p>{{ page.subtitle }}</p>

	</div>

{% assign t = page.tag %}
<h2> #{{page.tag}} : </h2> <br>

{% for post in site.posts %}
  {% for tag in post.tags %}
      {% if tag contains t %}
        <li>
          <a href="{{ post.url }}">{{ post.title }}</a>
          <span class="date">{{ post.date | date: "%B %-d, %Y"  }}</span>
        </li>
    {% endif %}
  {% endfor %}

{% endfor %}
