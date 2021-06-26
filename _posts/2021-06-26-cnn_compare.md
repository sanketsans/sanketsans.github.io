---
title: "3D vs 2D CNN"
subtitle: "A Close Look at Spatiotemporal Convolutions for Action recognition"
comments_id: 1
categories:
  - action_recognition
  - cnn_models
reviewed_by: 

tags: [action_recognition, cnn_models]

reference: "https://openaccess.thecvf.com/content_cvpr_2018/papers/Tran_A_Closer_Look_CVPR_2018_paper.pdf"
authors: "Du Tran, Heng Wang, Lorenzo Torresani, Jamie Ray, Yann LeCun, Manohar Paluri"
comments: "2020 Proceedings of the International Conference on Computer Vision and Pattern Recognition (CVPR)"
# featured_image: '/images/demo/demo-square.jpg'
---

### What 
Comparing different Spatiotemporal CNN model for action recognition task and proposes a new spatiotemporal CNN block : R(2+1)D CNN

### Why 
2D CNN applied to individual frames in a video gives appreciable results even after discarding temporal features. 

### How 
The authors proposes multiple 3D CNN (reversed, mixed) and CNN with similar dimensions and validate with different clip size for accuracy performance comparison. 

They also argue that since 3D CNN store the temporal information for the clip length, it tends to perform better than 2D CNN . 

It is also proved that since R(2+1)D has more non-linearity (due to additional ReLU with 2D and 1d convolutional block), it has the best performance compared to other CNN models. 

***TL;DR*** Action recognition with a 34- layer R(2+1)D net

### Notes 
Training on longer clips yields better results on clip-level models, as the filter learn long-term temporal dimensions, 
