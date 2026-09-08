---
title: "Scaling Deep Learning with Distributed Training — Part II(a): How GPUs Talk?"
published: true
tags: distributed-training ddp gpu-communication
comments_id: 2
date: 15 Nov 2025
categories:
  - ML systems
  - Distributed Training
tags: [Distributed Training, ML systems]
medium_url: "https://sanketsans.medium.com/scaling-deep-learning-with-distributed-training-part-ii-a-how-gpus-talk-3781bce08624"
excerpt: "Let's say we have 4 GPUs on a single machine and we want to communicate between them — data is sliced, each GPU gets a different slice of the dataset, and the communication pattern differs depending on the type of model parallelism."
---
