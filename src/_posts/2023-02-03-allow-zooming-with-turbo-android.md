---
layout: post
published: true
title: Allow zooming with Turbo Android
date: 2023-02-03T09:30:00+02:00
description: "Zooming is disabled by default on Turbo Android. It's possible to enable it."
summary: It took me some time to find out how to enable zooming on Turbo Android. Let's document the setup.
image:
main_image_description:
---

Allowing zooming on Android applications can be a bad idea. There are perfect use cases though.
For example you display some images and users may need to zoom to better view it.

HTML standard allow zooming by default, `user-scalable=yes`. To **allow** zooming on the HTML page you can use `user-scalable=yes` or omit the attribute.
```html
<meta content="width=device-width" name= "viewport">
<meta content="width=device-width, user-scalable=yes" name= "viewport">
```

To **prevent** zooming on the html page you can use `user-scalable=no`.
```html
<meta content="width=device-width, user-scalable=no" name= "viewport">
```


[Turbo Native for Android](https://github.com/hotwired/turbo-android) allows to reuse browser views to display them inside an android application.

> Build high-fidelity hybrid apps with native navigation and a single shared web view. Turbo Native for Android provides the tooling to wrap your Turbo 7-enabled web app in a native Android shell. It manages a single WebView instance across multiple Fragment destinations, giving you native navigation UI with all the client-side performance benefits of Turbo.

Though it doesn't allow zooming by default.

To enable zooming add the following settings.

```kotlin
webView.settings.builtInZoomControls = true
webView.settings.displayZoomControls = false
```
