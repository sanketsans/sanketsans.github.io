---
title: "FACExplanations"
subtitle: "High density paths for generating feasible and actionable counterfactuals"
comments_id: 1
categories:
  - explainable_ai
reviewed_by: Urja Pawar, PhD student (MTU)

tags: [explainable_ai]

reference: "https://dl.acm.org/doi/10.1145/3375627.3375850"
authors: "Rafael Poyiadzi, Kacper Sokol, Raul Santos-Rodriguez, Tijl De Bie,
Peter Flach"
comments: "2020 Proceedings of the AAAI/ACM Conference on AI, Ethics, and Society"
# featured_image: '/images/demo/demo-square.jpg'
---

## What ?

Feasible and Actionable counterfactuals using high density paths of data points and custom weight functions.

## Why ?

Counterfactuals does not consider underlying data distributions and constraints that makes them unachievable and infeasible.

## How ?

A graph over the data points is constructed where edges are weighted using different metrics based on distances and density of data points. This metric can be tuned based on properties of target instance (to be explained counterfactually) - prediction threshold (for distance) and density threshold.

<div align="center" class="img-container" style="margin-top:2%">

    <img src="/img/FACE/counter_path.png" width="80%" height="60%" border="1px" alt="arch" class="center">
    <figcaption>HPGD</figcaption>
</div>

For the given data points graph, FACE suggests D to be the best counterfactual. As A has low classification margin and is in low-density region. B has good classification margin but again is in low-density. C is in high density but is not connected by a high density path.

<div align="center" class="img-container" style="margin-top:2%">

    <img src="/img/FACE/epsilon_low.png" width="80%" height="60%" border="1px" alt="arch" class="center">
    <figcaption>Low threshold</figcaption>
</div>

The counterfactuals generated ensures a path that guarantees feasible changes (due to high density data points). Furthermore, a custom weight and condition function is provided to remove inappropriate edges. The figure compares the differences in constructing counterfactuals by typical KDE (Kernel Density Estimator) approach (Left) and FACE approach (Right).

<div align="center" class="img-container" style="margin-top:2%">

    <img src="/img/FACE/epsilon_high.png" width="80%" height="60%" border="1px" alt="arch" class="center">
    <figcaption>High threshold</figcaption>
</div>

However, the paths can also be decided based on a distance threshold metric, <i>ε</i> , when the user wants to somewhat ignore the density metric. Different use cases can use different density thresholds based on the distribution of the data.

### Notes
Assumes covariates to be distributed only on the basis of density. Actionable counterfactuals could be generated based on input constraints as well.
