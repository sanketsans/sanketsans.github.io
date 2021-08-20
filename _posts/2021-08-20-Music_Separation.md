---
title: "Music Separation"
subtitle: "Music Gesture for Visual Sound Separation"
comments_id: 1
categories:
  - sound_separation

reviewed_by:

tags: [sound_separation]

reference: "https://arxiv.org/abs/2004.09476"
authors: "Chuang Gan et al. "
comments: "2020 Proceedings of the International Conference on Computer Vision and Pattern Recognition (CVPR)"
# featured_image: '/images/demo/demo-square.jpg'
---

### What
Visual Sound separation for different music instruments.

### Why
Existing methods rely on appearance (also motion (optical flow)) based methods but do explore the relationship between audio and body keypoints.

### How
Compute keypoints for three video music datasets [ Music-21, URMP, AtinPiano ]. Main motivation is to associate body dynamics with audio signals for sound keypoints. Extracts global context features from video frames and merge with the outputs of context-aware GCNN on human keypoints. Each input to G-CNN is 2D keypoint coordinate.
For audio, mixture spectograms are fed to an encoder-decoder network, where are the (visual + GCNN) are fused with encoder features with a self-guided attention mechanism. The U-net is responsible to generate binary spectogram mask for individual audio which is compared with a ground truth mask for dominant component in input mixed audio.

```
visual features -> (2048, D_a x 1) D_a - dimensions
graph features -> (N x T x D_p)

v = visual network fusion -> N x T x (D_a + D_p) ~ V x D_v

a = audio features -> F x D_s

## Self-Guided Attention :

h_t = np.dot(SOFTMAX(np.dot(v, a)), v) + a

## Fused Features :

z = MLP(h_t) + h_t
```

The MLP is simply a two fully connected layer. The fused features are then fed to upsample layers of decoder part of the U-net. To create a binary mask, sigmoid operation is performed on the feature map.

The network is trained by minimising the per-pixel sigmoid cross-entropy loss.


***TL;DR*** Reconstruct waveforms from spectograms.

### Notes
Keypoint based representation only can perform better than RGB + Keypoints. 
