---
title: "My experience as a ML fellow for fellowship.ai"
published: true
tags: internship blog GAN deep-learning
comments_id: 2
date: 25 Dec 2021
categories:
  - GAN
  - Internship
tags: [internship, GAN]
---

<a href="https://fellowship.ai"><b>Fellowship.Ai</b></a> is a four months long <b>"unpaid"</b> fellowship on various machine learning topics. The program is 100 % remote,
and anyone can apply for it. (PS: Keep reading, if you should or not!). You can apply directly by submitting your resume, but if you complete one of the challenges mentioned on the website - you tend to increase your chances for getting to the interviews.
The challenges are focused on different machine learning topics such as image segmentation, Natural Language Processing (NLP),
One-Shot learning etc.

I applied for the second cohort of 2020 (Sept - Dec '20). I worked on the challenge problem of Image segmentation using a U-net
model. You can read more about the project here - <a href="https://github.com/sanketsans/Image-Matting-U-Net"> <b> Image Matting with U-Net </b></a>. On submitting the project, I got an interview call within next 2 days.
The interview was fairly easily and mostly focused on basic of ML knowledge like F1 score, Confusion matrix, etc. and some
intermediate python programming.

The program started with an orientation of all the accepted fellows for the cohort. You are free to choose a project based on your
choice. Most of the projects during my term was either done in partnership with other companies such as Levis or GE or very new
projects ( you will be the first to contribute to it ). Each project has about 5-6 fellows working on it. There are no mentors as such.

## Rolling with my crew

I was initially working on an <b><i> 'Emotion Detection' </i></b> project - where based on the video frames you have to classify if the person
in the zoom meeting is engaged, non-engaged, animated or distracted. For the first month, we spent collecting the dataset from
various internet scrapes. We were also provided with screenshot of internal zoom meeting. But the manual labelling has to be done
on our own - which was indeed very boring task. If you are interested in such kind of project, you can start with some of the good
dataset provided by kaggle - <a href="https://www.kaggle.com/c/mp18-eye-gaze-estimation/data"><b>Eye Gaze Estimation</b></a>, <a href="https://www.kaggle.com/kmader/biwi-kinect-head-pose-database"><b>BIWI Kinect head pose</b></a>.

<div align="center" class="img-container">
    <img src="/img/fellow_exp/emotion_classes.png" width="512" height="512" border="1px" alt="emotion_classes" class="center">
    <figcaption>Emotion Classes</figcaption>
</div>

I worked on creating a pipeline for the system. The input images were resized to 128x128 pixels.

## Two stage pipeline :

<li>The input is passed through first stage of the pipeline – where it identifies external entities such as phone, dog etc in the frame. The selected identities helps to understand other objects in the frame. It uses transfer learning method with pre trained model ie. No Learning happens at this stage of the pipeline.</li>

<li>After the first stage, when the identities are identified. The input image is simplified down the pipeline by cropping the face in the frame.
Then the cropped portion is sent to the classifier to be classified into 3 classes : Engaged, Non-engaged and Animated.</li>

If other entities are found from the first stage of the pipeline and is classified as non-engaged by the classifier – then it is regarded as Distracted.

<b>- - - -</b>


I was moved to an another project since most of team member expressed interest to work on other projects. Later, I was working
on identifying <b><i> 'Fridge Food Type Detection' </i></b>. The project sounds easy but is very difficult to model.
First, you don't have a good pool of images to generate a high quality dataset. Second, identifying identifying individual food
items is a daunting task, since objects are placed so close to each other in a fridge - it is hard to distinguish each of them.
Here, our major work was to generate synthetic dataset using Generative Adversarial Networks(GANs).
GANs have been pretty good lately is generating real-life like images of human faces. <show some of the results.

But, it turns out they are not so good at generating other objects. Before joining the group, other have already worked on using StyleGAN-2 by NVIDIA<link> to generate synthetic in-domain images. The initial dataset was built using a member's fridge's
in-built camera images and web scraping. Now, directly using GANs on the preliminary dataset was not successful since there were not many images. So, instead synthetic images were generated to transform them to in-domain images.
To do so, a blender script was used to randomly place 3D-objects such as bottles, veggies etc. in a fridge 3D model(3D scene generation) and jpg images were produced form the front. Reference - <a href="https://openaccess.thecvf.com/content_ICCVW_2019/papers/ACVR/Koporec_Deep_Learning_Performance_in_the_Presence_of_Significant_Occlusions_-_ICCVW_2019_paper.pdf"><b>Gregor et. al ICCV '19 ()</b></a>.

<div align="center" class="img-container">
    <img src="/img/fellow_exp/blender_image_0.jpg" alt="synthetic" width="256" height="256" >
    <figcaption>synthetic images</figcaption>
</div>


I implemented a Pix2Pix GAN method to create a mapping of synthetic images(from Blender) to generate in-domain images. Though Pix2Pix GAN<link> is a paired GAN approach and we did not have pair of synthetic and in-domain fridge images. Instead, I created
random pairs and fed it to a Pix2Pix GAN. After 200 epochs on about 1200 image pairs, results are still not convincing. You can
check out the project here - <a href="https://github.com/sanketsans/Pix-2-Pix-GAN"><b>Pix2Pix GAN</b></a>.

<figure>
<img src="/img/fellow_exp/my_pix2pix_result.png" alt="results" style="width:100%">
<figcaption align="centre">My results with Pix2Pix</figcaption>
</figure>

Meanwhile, I started my Phd in November '20, and due to hectic schedule I had to focus more time to my PhD from December.
But, there are appreciable results using CycleGAN.
why so ? -
  <li>cyclic loss of the images might lead to a better mapping.</li>
  <li>unpaired approach </li>

 You can read the entire paper here: <a href="https://www.launchpad.ai/blog/the-usage-of-cyclegan-for-image-translation-to-increase-the-size-of-fridge-food-types-dataset"><b>The Usage of CycleGAN for Image Translation to Increase the Size of Fridge Food Types Dataset</b></a>


## The Good, the Bad and Neutral:

### The Good :

<li>There are "mostly" regular reading session, where someone from the fellowship presents a paper which can help to stay updated
with current ML research.</li>
<li> You will working on real-world projects with an inter-disciplinary team from around the world.</li>
<li> Also, the fellowship provide an opportunity to regular performers to join them full-time or get a job at one of the partner companies. Did I mention one of my team member got an internship at Nike ML group and few others at Levis.</li>

### The Bad :

<li>There are too many meeting. Group meeting, meeting with the co-founder, demos, etc. etc.</li>
<li>The program is UNPAID - which is a bummer. I'd recommend it highly to those who are either looking for a switch in your career or a final year student(who is done with the internship) or like me who has time before starting you higher education to apply for it.</li>
<li>Time Differences: Meetings are at quite unusual time at night for someone in Asia/Pacific region.</li>

### Neutral (Bonus) :

Job offers from partner companies are mostly confined to US residents. But there were externships available from the fellowship to fellows everywhere.   

## Verdict :

Fellowship does provide a platform for those intermediate in their learning curve of Machine Learning. Since, the program is unpaid, all the fellows(I met), were not working elsewhere full-time. So, I think if you are looking to either switch your career in an ML field or final year student(not the internship) - this will be a great opportunity to learn from real-world projects and potentially get job offers.
