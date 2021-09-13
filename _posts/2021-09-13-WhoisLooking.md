---
title: "Who is Looking ?"
subtitle: "Joint Person Segmentation and Identification in Synchronized First- and Third-person Videos"
comments_id: 1
categories:
  - egocentric
tags: [egocentric]
published: True
reference: "https://openaccess.thecvf.com/content_ECCV_2018/html/Mingze_Xu_Joint_Person_Segmentation_ECCV_2018_paper.html"
authors: "Mingze Xu, Chenyou Fan, Yuchen Wang, Michael S. Ryoo, David J. Crandall"
comments: "2018 Proceedings of the European Conference on Computer Vision (ECCV)"
# featured_image: '/images/demo/demo-square.jpg'
---

## What ?

Identifying and segmenting the person  seen from multiple view, also the person whose first person view is available.

## Why ?

Combining multi camera views and having a reconstruct the events.  

## How ?
All the videos are egocentric in nature**

Establish a separate segmentation module to identify the segmentation mask given a pre-mask(prev. segmentation mask) for specific / target person, using RGB and optical flow.
A joint network is then created for the given task

***Given two 'third-third' person views:***
Identify the common person viewed from both the views. The joint network is constructed using two segmentation module and the mask is then fed to another set of CNN with shared weights to segment the common person.

***Given one third person (egocentric) view and one first person view:***
Identify the person whose first person view is available. The joint network is composed of one segmentation module for thirs person view and first person view is fed to VGG module. The mask from both module is then fed to another CNN. The weights are only shared for embedding space. The CNN features from VGG spatial is multiplied to soft attention of background and VGG temporal features with soft attention of foreground since person in FPV himself does not appear but background might reflect some similarities.

***Loss:***
Authors propose using two loss function : sigmoid cross entropy ( to correct the segmentation mask ) and constrastive loss ( to encourage less distances b/w positive samples and more for negative samples. )

### Limitations

Only performed for egocentric videos(IUShareView dataset). The model always assumes atleast one person in each frame hence does not perform well for no-person frames.


### TL/DR :
Evaluation protocol
