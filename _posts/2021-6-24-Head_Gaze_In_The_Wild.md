---
title: "Head for Gaze in the wild"
subtitle: "Learning to Detect Head Movement in Unconstrained Remote Gaze Estimation in the Wild"
comments_id: 1
categories:
  - gaze_prediction
  - head_pose_estimation

tags: [gaze_prediction, head_pose_estimation]

reference: "https://openaccess.thecvf.com/content_WACV_2020/html/Wang_Learning_to_Detect_Head_Movement_in_Unconstrained_Remote_Gaze_Estimation_WACV_2020_paper.html"
authors: "Zhecan Wang, Jian Zhao, Cheng Lu, Fan Yang, Han Huang, lianji li, Yandong Guo"
comments: "2020 Proceedings of the IEEE/CVF Winter Conference on Applications of Computer Vision (WACV)"
# featured_image: '/images/demo/demo-square.jpg'
---

## What ?

Gaze direction estimation by learning head pose information from facial images.

## Why ?

Appearance based method are considered an efficient method to learn facial information for gaze prediction. Other existing method have worked on similar problem for a controlled scenario(s) or using head pose information as brute-force to learn the mapping.

## How ?

The authors proposes two different method to learn mapping when head pose / facial image is present (HPGD), and when not available (HGD-noHP). The main intention is to find a relationship between eye deformation and head transformation.

Input images are fed to a facial key-point detector which is fed to two separate module responsible for learning head poses and gaze. The hidden 'learned' features from both the modules are then concatenated to feed to a regressor.

<div align="center" class="img-container" style="margin-top:2%">

    <img src="/img/head_gaze_wild/HPGD.png" width="80%" height="60%" border="1px" alt="arch" class="center">
    <figcaption>HPGD</figcaption>
</div>

```
if facial_image.is_available():
    ## HPGD
    Two different training methods are evaluated :
      1. Implicit training : Joint Learning.
      2. Explicit training: freezing the head pose estimator network after its indivisual training and use its inference to train gaze estimator.

else:
    ## HGD-noHP
    Joint learning
```

<div align="center" class="img-container" style="margin-top:2%">

    <img src="/img/head_gaze_wild/HGD-noHP.png" width="70%" height="60%" border="1px" alt="arch" class="center">
    <figcaption>HGD-noHP</figcaption>
</div>

The network outputs a 3D head-pose angle (pitch, yaw).

### Notes:
The ablation study was evaluated on three main dataset (for facial image) and two for eyes image learning and the network works best for all of them. Authors also suggest using BEC (Both Eyes concatenated on Channel) method for pre-processing of eye images, instead of handling them individually (CA - Component Analysis).
