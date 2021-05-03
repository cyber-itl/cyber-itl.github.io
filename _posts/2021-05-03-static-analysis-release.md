---
layout: post
title:  "CITL Static Analysis Release"
categories: []
tags: []
status: publish
type: post
published: true
meta: {}
excerpt_separator: <!--more-->
---

Today CITL is open sourcing our [static analysis](https://github.com/cyber-itl/citl-static-analysis/) tooling. Doing so we hope to share our methods for analyzing binary hardening with a wider audience. Our static analysis tooling ingests binary files (PE/ELF/MachO), of multiple architectures (ELF supports: x86, x86-64, arm, arm/thumb, aarch64, mips, ppc) and reports on the hardening of the binary. It supports a range of different hardening techniques via its plugable analyzer model.

<!--more-->

The static analysis codebase is one of CITL's most useful tools outside of our own research stack. We wanted to share some of our tooling because we believe it could be a foundation for others to do their own research into binary hardening. It can also act as a check for developers wanting to ensure their code is hardened before release.

## CITL's history with static analysis

Our goal at CITL is to be able to quantify and collect metrics on software security. The scope of the problem is large in size and often subjective, so we picked a subset of identifiable features whose values are objective and that we could collect data for en-mass. We chose to start with native code hardening. Features like ASLR, DEP, RELRO, stack guards, etc. While there are plenty of tools to report on these features in a subset of different file formats or architectures, we needed a unified tool to process ELF, MachO, PE files along with different CPU architectures and platforms.

In order to be able to analyze the code/instructions that comprise the binary, we would also need to reconstruct the control flow graph of the program, much like how IDA or Binaryninja does. Unfortunately, both of these tools are built more for depth of analysis vs scale. So we opted to build our own analysis engine that could scale to processing millions of unique files in a day. Our tooling does nowhere near as deep of an analysis pass but it is able to reconstruct a reasonable CFG, iterate over basic blocks and symbolize the binary very quickly.

Finally we wanted a modular architecture to plug in analyzers as needed. The analysis engine needed to be able to run different analyzers at different times with different contexts. For example, an ASLR analysis for most binaries just needs to inspect the format headers, but function fortification needs to know if certain external symbols are present and how many times each is called. In order to support this and other cases, analyzers run at different stages and report all the discrete 'facts' it can find into the final json report.

Currently the bulk of the analyzers focus on hardening techniques, things like ASLR, DEP, RELRO, Fortification, stack_guards, cfi and others. But the tool also reports on some more generic features like section stats, density of hardening (ex: how often are stack guards injected) and frequency of certain instruction classes. We included these to provide extra data for our modeling and further studies.

## Past Studies

Most of the studies in the past 3 years have used this tooling extensively for data collection. We leverage some other tooling for scaling out the analysis, result indexing and summarization but the tool at the heat of the data collection in the static-analyzer. Some examples of what we have been able to do with it can be found on previous blog posts:

- [Fuzzer Data](https://cyber-itl.org/2021/03/01/citl-fuzzer-data.html)
- [IoT Study](https://cyber-itl.org/2019/08/26/iot-data-writeup.html)
- [Android Study](https://cyber-itl.org/2019/12/16/android-evolution.html)

There are a wealth of other possible studies we have considered but have not quite had the time to explore, including:

- Looking at the hardening of different repositories.  For example how has binary hardening changed over the lifetime of debian/ubuntu apt?
- Hardening of different AMI images, are there any measurable differences in cloud vendors? What does the lifetime of hardening look like?
- Hardening of common docker images from docker hub

## Where can you find it

You can find the project on github at: [https://github.com/cyber-itl/citl-static-analysis/](https://github.com/cyber-itl/citl-static-analysis/)

Currently the engine supports the following platform/format/arch pairs:

```
Windows-PE-x86
Windows-PE-x86-64
Macos-MACHO-x86
Macos-MACHO-x86-64
Linux-ELF-x86
Linux-ELF-arm
Linux-ELF-thumb
Linux-ELF-aarch64
Linux-ELF-mips
Linux-ELF-mips64
Linux-ELF-ppc
Linux-ELF-ppc64
```
