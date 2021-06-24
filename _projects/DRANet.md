---
title: "DRANet"
subtitle: "Dual Reverse Attention Network for Person Re-IDentification"
comments_id: 1
categories:
  - Reverse_Attention
tags: [Reverse Attention]

reference: "https://ieeexplore.ieee.org/document/8804419"
authors: "Shuangwei Liu; Lin Qi; Yunzhou Zhang; Weidong Shi"
comments: "2019 IEEE International Conference on Image Processing (ICIP)"
# featured_image: '/images/demo/demo-square.jpg'
---

## What ?

Person Re-ID using a dual reverse attention based module. Creates hard examples by transforming features using channel and spatial reverse attention process.

## Why ?

Inability to generalise on hard examples(occlusion, light variances etc.). Mining <i>/</i> synthetic data generation is expensive and suffers on convergence problem.

## How ?

The authors introduce <b>DRANet</b> (Dual Reverse Attention Networks) to generate hard examples in convolutional feature space.

<div align="center" class="img-container">

    <img src="/img/dranet/arch.png" width="512" height="256" border="1px" alt="arch" class="center">
    <!-- <figcaption>DRANet architecture</figcaption> -->
</div>


The input image is fed to ResNet50 and features maps are divided into three parts (<b>Why ?</b>). Each partial feature sequentially goes through CIC (Channel Information Capture) and SIC (Spatial Information Capture).

#### Dual Reverse Attention

<div align="center" class="img-container">
    <img src="/img/dranet/rcam.png" alt="rcam" width="512" height="256" >
    <figcaption>Channel based reverse Attention</figcaption>

    <img src="/img/dranet/rsam.png" alt="rsam" width="512" height="256" >
    <figcaption>Spatial based reverse Attention</figcaption>
</div>

CIC provides a mask 'm' to suppress informative features and generate channel based hard examples.
<!-- The authors use a squeeze function (FCL) to extract descriptive features for each channel and an excitation function to reflect relative importance of each channel (m) . Later they are combined using channel-wise multiplication for informative features.  <b> (B) </b> -->
Similarly, SIC provides a mask, but <b>'only for'</b> corresponding person identity <i>'n'</i> (Only available during training).

### Implementation

All <b>three</b> softmax losses are combined during training process. During testing, only B and SIC is possible (since person identity is available during training only for spatial reverse attention). Encodings from both features maps after GAP are concatenated (2048 - 1024*2) for predictions.

### Notes :

The model improves mAP on three dataset Market-150, DukeMTMC-reID, CUHK03 by 2, 3 & 5 %. But performs almost similar for rank 1, 5, and 10 accuracy.
For details check out the original paper [DRANET](https://ieeexplore.ieee.org/document/8804419).
