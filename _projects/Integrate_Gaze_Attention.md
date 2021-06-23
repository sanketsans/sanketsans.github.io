---
title: "Integrate Gaze Attention"
subtitle: "Integrating Human Gaze into Attention for Egocentric Activity Recognition"
comments_id: 1
categories:
  - Attention;
  - Action Recognition;
  - Sampling

reference: "https://openaccess.thecvf.com/content/WACV2021/html/Min_Integrating_Human_Gaze_Into_Attention_for_Egocentric_Activity_Recognition_WACV_2021_paper.html"
authors: "Kyle Min, Jason J. Corso"
comments: "2019 Proceedings of the IEEE/CVF Winter Conference on Applications of Computer Vision (WACV)"
# featured_image: '/images/demo/demo-square.jpg'
---

## What ?

Direct optimisation and sampling technique for better integrating gaze for FPV action recognition on EGTEA dataset.

## Why ?

Improvement to the paper [In The Eyes of Beholder](https://sanketsans.github.io/project/in-the-eyes-of-beholder).   
[Gumble-Softmax](https://www.youtube.com/watch?v=JFgXEbgcT7g) sampling used, introduces a significant bias to a gradient estimator, limiting its performance. Also a direct integration of sampled gaze map can cause confusion due to inaccurate gaze measurements.

## How ?

The authors use the same loss function as that of their competitors. Instead of curating an attention grid, they sample the gaze points through [Gumble-Max](https://www.youtube.com/watch?v=JFgXEbgcT7g) trick.
<div align="center" class="img-container" style="margin-top:2%">

    <img src="/img/integrate_gaze/gaze_sample.png" width="684" height="684" border="1px" alt="arch" class="center">
    <!-- <figcaption>DRANet architecture</figcaption> -->
</div>
Gamma is the random samples from a Gumble distribution.


Now, they propose to formulate log-likelihood using the class-wise log-probabilities as a function of x, image features and z, gaze sampled.

```
: log(pθ)
```
<div align="center" class="img-container" style="margin-top:2%">

    <img src="/img/integrate_gaze/log_prob.png" width="684" height="684" border="1px" alt="arch" class="center">
    <!-- <figcaption>DRANet architecture</figcaption> -->
</div>

The gradient will then be a sum of multiple expectation terms of the class- wise log-probabilities, each multiplied by an indicator function, where each class gradient estimator is computed using direct optimisation.

<div align="center" class="img-container" style="margin-top:2%">

    <img src="/img/integrate_gaze/gradient.png" width="684" height="684" border="1px" alt="arch" class="center">
    <!-- <figcaption>DRANet architecture</figcaption> -->
</div>

```
where,
: hφ(x, z) = log qφ(z|x)
```

The unbiased parameter is introduced using a perturbation parameter, which is set to high initially and then progressively lowered.
<div align="center" class="img-container" style="margin-top:2%">

    <img src="/img/integrate_gaze/unbias_param.png" width="684" height="684" border="1px" alt="arch" class="center">
    <!-- <figcaption>DRANet architecture</figcaption> -->
</div>

<div align="center" class="img-container" style="margin-top:5%">

    <img src="/img/integrate_gaze/arch.png" width="684" height="684" border="1px" alt="arch" class="center">
    <figcaption>Architecture</figcaption>
</div>

The sampled gaze distribution is fed to a FC layer followed a sigmoid to act as a soft-attention map.

## Notes :
Structured gaze modelling with direct optimisation performs better than other reparameterization technique such as Gumble-Softmax.
