---
title: "Self attention in a nutshell, like seriously "
published: true
tags: attention intro
comments_id: 1
categories:
  - attention
  - intro
  - technical
---

I hear a lot about self-attention in papers I read every now and then. And almost every time i get very puzzeled whenever the word is mentioned. Whether it is action recognition, image translation, image segementation or anything else (PS: sorry for being computer vision bias), self-attention is the new trend, I suppose. 

Lets say you have a time series data. It is in their nature to be very noisy. And believe me when I say this. How ? Read my recent paper - <a href="https://scholar.google.com/citations?view_op=view_citation&hl=en&user=pM6-D7EAAAAJ&citation_for_view=pM6-D7EAAAAJ:u5HHmVD_uO8C"><b>Predicting gaze from egocentric social interaction videos and IMU data</b></a>

I know you didnt go through the link. Anyway, lets consider you have data of say stocks, now if you have ever invested in stocks, you know they are risky and subject to marke.. I mean, they are very noisy wrt time. It is like having multiple local minima with no end. Though there was global minima in March, 2020 - if you know what I mean !

So, now we have this noisy data and we somewhat want to smoothen it out. So, one way is to apply re-weighing to the stock data and generate new smoothened out data. We can map the co-related data points in both noisy and re-weighing set to create corresponding "re-weighted data points". 
eg. The timeseries data , X and our re-weighing factor, W  both have n corresponding points. 
###### X = [x_1, x_2, .... x_n]

###### W = [w_1, w_2, .... w_n]
We can then simply denote the smoothened out factor as :

```
Y = W.X
```
If you are nosy about linear algebra, then:
```
Y = transpose(W).X
```
This Y will be somewhat smoothened version of X thanks to <b>re-weighting</b> which we just did. It amplifies the relations between the data points and bring the similar ones closer and vice versa. 

Lets take a look at this from natural language perspective. Suppose we have two sentences V_1, and V_2, each word represented as vector. Now, there must be some correlation between some words of one sentence to an another word of the other sentence. That's where we need attention to figure out the corelation between different sentence and understand the context. As one can image, it is widely used in machine translation based tasks.

Lets take a simpler sentence: 
###### Sky is clear today 
Sky is connected with clear and today. Sky in itself can mean other things as well, eg. someone's name. But here there is a context which says that the sky is clear today. So machine should be able to relate the corelation between the words to understand the context. 
So, we try the earlier re-weightning factor in this as well. 
So ,we create word embeddings for our sentence. Since machine cannot understand generic words, we create
###### V = [V_1, V_2, V_3, V_4] - # word embeddings.
From these embeddings we create a re-weighting factor. Thefore, for each embeddings we do a dot product with every other vector in the representation and perform a normalization so that all vector add upto 1. So, 
```
V_1.V_1 = W -> (N) W_11
V_1.V_2 = W -> (O) W_12 
V_1.V_3 = W -> (R) W_13 
V_1.V_4 = W -> (M) W_14
```
So now we have these re-weighting factors which we can join with original embeddings.
```
W_11.V_1 + W_12.V2 + W_13.V3 + W_14.V4 = Y_1
```
But all this work only gives the re-weighted vector just for V_1. So , we repeat all these steps for each word to get all the re-weighted embeddings. 
In the end, we get, <b> Y = [Y_1, Y_2, Y_3, Y_4] </b> which can provide us a better context for the sentence. 

This all in itself is called self-atteion. There are couple of things to take note of : 
<ul>
  <li> No trained weights </li>
  <li> Order has no influence </li>
  <li> Priority has no influence </li>
</ul>

We can make this more intelligent by adding some learnable parameters to better understand larger sentences and their context. Therefore, we add weights to the pipeline - which I will discuss in the next post. 



