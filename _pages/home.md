---
layout: splash
permalink: /
title: "Computer Science Notes"
header:
  overlay_color: "#B3C8CF"  # משתמשים בצבע האקסנט שהגדרנו
  overlay_filter: "0.3"     # שקיפות חלקית
excerpt: "Lecture notes and course materials for Computer Science degree at Bar-Ilan University"

feature_row:
  - title: "First Year"
    excerpt: "Fundamental courses including:"
    list_group:
      - "Linear Algebra"
      - "Calculus"
      - "Introduction to Computer Science"
      - "Discrete Mathematics"
    url: "/year1/"
    btn_label: "View Notes"
    btn_class: "btn--primary"
    image: "/assets/images/placeholder-year1.jpg"  # נצטרך להוסיף תמונה
  
  - title: "Second Year"
    excerpt: "Advanced courses including:"
    list_group:
      - "Data Structures"
      - "Algorithms"
      - "Operating Systems"
      - "Computer Architecture"
    url: "/year2/"
    btn_label: "View Notes"
    btn_class: "btn--primary"
    image: "/assets/images/placeholder-year2.jpg"  # נצטרך להוסיף תמונה
---

## Welcome to My Study Notes

Here you'll find a comprehensive collection of lecture notes and study materials from my Computer Science degree at Bar-Ilan University. All materials are organized by year and semester for easy navigation.

{% include feature_row %}

## Recent Updates
<div class="recent-updates">
{% for post in site.posts limit:3 %}
  <div class="update-item">
    <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
    <p class="update-date">{{ post.date | date: "%B %d, %Y" }}</p>
    <p class="update-excerpt">{{ post.excerpt | truncate: 160 }}</p>
  </div>
{% endfor %}
</div>
