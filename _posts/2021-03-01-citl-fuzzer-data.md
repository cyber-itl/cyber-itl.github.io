---
layout: post
title:  "CITL Fuzzer Early Data"
categories: []
tags: []
status: publish
type: post
published: true
meta: {}
excerpt_separator: <!--more-->
---

CITL's primary research goal has been focused around if we could formalize a technique security practitioners use for identifying potentially vulnerable code. We wanted to know if we could automatically detect patterns that are used for prioritization in a standard security audit? We started with simple questions based on common indicators. For example:

"Does using `strcpy()` more often mean that software will crash more?".

<!--more-->

One one level, we want to answer questions like the one above because bug hunters use heuristics like use of unsafe function in their process of identifying likely soft targets for attack, and we want to determine if such heuristics bear out. On a deeper level, though, we want to understand how to really measure software safety and quality, and we want to understand how various software traits impact program behavior. Any measurements that really speak to the safety of software should have some measurable security impact, and we are looking for ways to measure and demonstrate that impact.

The problem is open ended and even within our team there is still a lot of active debate if it is even possible to discover relationships that have any statistical significance. Unfortunately we have yet to discover anything strongly correlated with the high level indicators we will explore later on. However, we wanted to shared our early data, methods, and experiments with the larger community.

In order to try and tackle research questions like one one above, we have been analyzing and fuzzing large quantities of software. This was done, not to find specific or high-impact defects, but to generate a large sample dataset of software execution and defects.

In this post, we would like to share our merged dataset (static analysis features and fuzzing results) as well as some fun charts / analysis we have tried so far.


## The Fuzzer Design

To tackle the data collection needed we choose to write a new fuzzer. Many existing fuzzers are designed to be manually harnessed for a given target or interface. In order to collect the scale of data we wanted, we needed to avoid writing thousands of harnesses. So we choose to design a fuzzer that was built for fuzzing at breadth instead of depth. We also record the execution path, selective API calls, and signal paths to aid in our post-fuzzing analysis.

The way the fuzzer works at a high level is we ahead-of-time (AOT) rewrite the target binary and all libraries with dyninst basic block logging instrumentation and inject our fuzzing runtime. This injected library provides callbacks methods so the Unit-Under-Test (the target process, inclusive of binary, linked libraries, and subprocesses) can log each basic block it executes. It also provides weaksym overwrites for libc methods that perform IO. This way the run time will log when ever a file is attempted to be opened or a environment variable is queried. Then the primary fuzzer loop is able to pick up those missing inputs and provide them to the target on the next pass. Effectively automatically detecting and starting new input mutation paths as the fuzzer runs. The fuzzer currently has support for detecting / mutating: argv, envp, files, and stdin. During evaluation of the testcase, the engine also saves a complete basic block level trace. Following evaluation, the trace log is used to calculate the hitmap, a bitwise Bloom filter, which incorporates not only the basic blocks in the root module but all the libraries and sub-processes. When logging these basic block level traces the engine is thread id and process id aware so it can easily handle multi-process or multi-threaded targets.


## Exploration Analysis

Before diving into the sample analysis, we need to take the time to explain the crash counts metric. Unlike the AFL style crash counts, we needed the count to reflect the number of unique / repeatable defects. This is done with two stages of 'crash qualification' to get a more accurate crash count:

Following the fuzzer completing its efforts on a target, a crash qualification system is run. This consists of running each testcase against the target in both instrumented and non-instrumented modes, monitoring the program exit signal / state to ensure they reproduce the defect correctly. This is done 10 times for both modes. Then a crash is only considered 'valid' if all 20 iterations crash and have the same crash state (signal and location). This method does have its share of false negatives due to bugs that are affected by allocator state, race conditions, or esoteric kernel interfaces but deeper analysis was impractical for a first pass.

For the purposes of our analysis, we remove duplicate crashes based on the uniqueness of the tuple of: [signal number, module id (unique ID for a given .exe or .so), offset (virtual offset from the LOAD base, ASLR normalized)]. This allows us to not only deduplicate a good amount of crashes but also identified the specific library or executable the crash occurred in. It should be noted that this method has both false positives and negatives. For example a bug that 'moves' its crashing location in the code segment due to some global state (allocator, system state, inputs, etc) would have an artificially high crash count. There is also an example of the inverse case, C++ exceptions terminate in a ABORT signal, raised from the location within libc++.

This method favors correctly dismissing false positives in favor of a higher false negative count, which was more fit for our subsequent analysis. And while searching for potential relationships we preferred our error in the data to be over-cautious.

### Data summary

Input target set: Ubuntu 18.04 APT (x86-64), every elf executable, skipping targets that used X11, or were unable to link/load correctly. A module is a library or binary (basically any elf file that would be loaded and linked into a process space).

```
Total number of modules:         69707
Number of modules with coverage: 22623
Number of crashing modules:      4795
Number of crash locations:       13105
```


### Distribution of Crashing Signals

Below is a distribution of crashes, bucketed by signal number. SIGSEGV obviously is the most common in the data, followed by SIGABRT.

SIGABRT is a complex crash state because it can contain c++ exceptions, traditional abort()/assert calls, and even heap corruptions. The GNU malloc implementation uses abort after detecting corrupted heap metadata. Stack canaries also abort after a failed canary check. Luckily we are able to hook and detect most `stack_chk_fail()` calls hence the SIGABRT_STACK_CHK bucket.

![crash-signals](/assets/images/blog/2021-03-01-citl-fuzzer-data/crash-signals.png)


### Correlation Matrix

Using a simple logical AND we can verify the presence of certain hardening features with crashes. Putting these values into a correlation matrix we can quickly spot check the 'how common or uncommon does X hardening feature appear along side a crash in a module' question.

(Following values all in percentages)

||has_crash|ASLR|Full RELRO|Stack Guards|No Exec Stack|Full Fortification|
|-|-|-|-|-|-|-|
|has_crash|100.00||||||
|ASLR|15.87|100.00|||||
|Full RELRO|1.51|8.47|100.00||
|Stack Guards|20.59|82.85|4.81|100.00|
|No Exec Stack|21.18|88.26|5.40|87.20|100.00|
|Full Fortification|0.68|11.90|0.58|8.21|9.80|100.00|

Initially we were excited to see the 0.68% and 1.51% relationship between fortification / RELRO with has_crash but unfortunately this was due to those two features being highly uncommon in the dataset.

### Text (code segment) Size

Our first comparison we looked at was to determine if the size of the TEXT section of the module had any relationship with crash density:

![text-size](/assets/images/blog/2021-03-01-citl-fuzzer-data/text-size.png)

While there is no simple correlation, there is at least an interesting shape. Removing some outliers gives us a slightly better picture:


#### Filter:

```
text_size < 20000000 & buckets < 40
```

![text-size-zoomed](/assets/images/blog/2021-03-01-citl-fuzzer-data/text-size-zoomed.png)

There is a largey density compared with crash counts, density being defined as no grouping of high crash density binaries around the smallest text sizes but interestingly enough also in the 0.75 1e7 - 1.5 1e7 range. This could be due to something like statically linked libraries or some other commonly sized codebase.

### Fortification

We can also look for effects of [fortify source](https://access.redhat.com/blogs/766093/posts/1976213) on the binaries crash density. Below is a Violin category plot of fortification level and crash density.

![fortification](/assets/images/blog/2021-03-01-citl-fuzzer-data/fortification.png)

Fortify Source is a complex hardening feature and it is most common to see a module with MIXED fortification levels because the compiler is unable to safely fortify some method call sites. Full fortification is, therefore, seen less often. There are some outstanding questions here that bear further investigation. First, mixed fortification has a much longer tail than the other categories, and not as flat a shape? Is the compiler's inability to fortify an instance of a historically unsafe function an indication of higher crash likelihood? Are those specific instances in the crashing paths? Second, the "Unknown? category's shape has a larger proportion of 0 crash results. Is this an indicator that complete avoidance of these historically unsafe functions correlates with fewer crashes, or does it just have to do with the catch-all nature of the "Unknown" category?

Fortification Levels in all binaries in APT:

![fort-vals](/assets/images/blog/2021-03-01-citl-fuzzer-data/fort_vals.png)


### Function Relationships

Using the function call count data, it is possible to explore the relationship of certain function density with crash density. For example answering the question does high density of `strcpy()` predict a higher density of crashes?

#### strcpy

`strcpy()` calls compared with crash counts:

![strcpy-count](/assets/images/blog/2021-03-01-citl-fuzzer-data/strcpy-count.png)

We can also messure the `strcpy()` density by normalizing its call frequency by the text size (`strcpy()` calls per byte):

![strcpy-density](/assets/images/blog/2021-03-01-citl-fuzzer-data/strcpy-density.png)


## Symbolized traces

Using the fuzzer generated basic block traces and combining them with all the ELF files within the targets process tree, we can symbolize the traces.

Effectively this allows us to see all the external function names called, in order, in every unique execution path. For our current ubuntu apt fuzzing test dataset, this symbolized data is about 21TB of .csv files. So we filtered the data down to just the last 20 symbols, leading up to the crash site in a trace.

The raw data looks like this:

|job_id|serial|modid|pid|tid|addr_offset|block_id|signum|sym|
|-|-|-|-|-|-|-|-|-|
|1602|158.0|15204.0|529.0|529.0|169217.0|522.0|0.0|strlen|
|1602|158.0|15204.0|529.0|529.0|169225.0|523.0|0.0|xmalloc|
|1602|158.0|15204.0|529.0|529.0|169234.0|524.0|0.0|xmalloc|
|1602|158.0|14986.0|529.0|529.0|960320.0|525.0|0.0|malloc|
|1602|158.0|15204.0|529.0|529.0|169239.0|528.0|0.0|strcpy|
|1602|158.0|15204.0|529.0|529.0|169754.0|532.0|0.0|strlen|
|1602|158.0|15204.0|529.0|529.0|169762.0|533.0|0.0|xmalloc|
|1602|158.0|14986.0|529.0|529.0|960320.0|534.0|0.0|malloc|
|1602|158.0|15204.0|529.0|529.0|169775.0|537.0|0.0|strcpy|
|1602|158.0|15204.0|529.0|529.0|169789.0|538.0|0.0|strcpy|
|1602|158.0|15204.0|529.0|529.0|169824.0|539.0|0.0|mkstemps|
|1602|158.0|15204.0|529.0|529.0|169894.0|541.0|0.0|__errno_location|
|1602|158.0|15204.0|529.0|529.0|169899.0|542.0|0.0|strerror|
|1602|158.0|15204.0|529.0|529.0|169906.0|543.0|0.0|__fprintf_chk|
|1602|158.0|15204.0|529.0|529.0|169941.0|544.0|6.0|abort|

Unlike a stack trace from a crash site, the symbolized trace shows all functions called leading up to a crashsite. Instead of just the stack of functions called to a crash site.

### Grouping symbols by signal

Most common symbol (by crashing signal) in the last 20 symbols leading up to a crash.

*Please note that the Y axis is different for each plot.*

![trace-sym-barplots](/assets/images/blog/2021-03-01-citl-fuzzer-data/trace-sym-barplots.png)

Our initial reaction to these plots is that it generally shows what we would expect, SIGABRT / SIGSEGV having a strong correlation with malloc and memory releted functions. And the SIGABRT_STACK_CHK being related with __stack_chk_fail is consistent. There are some oddities though, we were not expecting to see __dynamic_cast have such a relationship with SIGFPE. With more analysis of the patterns and chains of functions called there could be even more interesting relationships to discover in this data.

We hope to release the symbolized trace data at a later point, if it can be released safely.

## The Data

These are very rich data sets, with the potential to teach us a lot about program behaviors. We encourage others to download the data and explore it further.

The following .csv has the complete dataset of merged data:

[merged-df.csv (529 MB)](https://drive.google.com/file/d/1U7JB4VmAkbbogWkjP2FmZYTsemxY7Acu/view?usp=sharing)

The data represents all modules (libraries or executables) within ubuntu 18.04 apt. In order to get only modules that had some amount of discovery during fuzzing, query for any row where crash_count is not NaN (or NULL).

### Description of the columns

|Column Name|Description|
|--|--|
|path|path to target module within rootfs|
|hash|sha256 hash|
|modid|unique module id|
|crash_count|count of semi-unique / qualified crashes found within module|
|architecture|cpu architecture of module|
|bitness|bitness of module (eg: 32/64)|
|os|operating system|
|os_version|distribution of linux: ex: 'ubuntu'|
|source|distribution version, ex: 'bionic'|
|package|apt package that provide the module|
|package_version|apt package version|
|text_size|size of executable sections of the module|
|data_size|size of the data sections of the module|
|function_cnt|count of functions within text segment, found via cfg recovery|
|block_cnt|count of basic blocks within text segment, found via cfg recovery|
|is_driver|is the module a kernel driver|
|is_library|is the module a library (.so) or executable|
|aslr|Does the module have ASLR (is dso but is executable). NaN if the module is a library, 0 if its missing, 1 if its present|
|no_exec_stack|Does the module mark the GNU_STACK segment executable (effects other segments if true, similar to DEP)|
|stack_guards|Does the module have stack guards. NaN if not applicable|
|fortify|What level of fortify_src does the module have. NaN: not applicable, 0: Unknown, 1: not fortified, 2: mixed fortification, 3: full fortification|
|relro|Does the module have RELRO: nan: not applicable, 0: No RELRO, 1: Partial RELRO, 2: Full RELRO|
|extern_funcs_calls|Total number of call sites (in text sections) to external functions linked in from libraries|
|libs|json array of libraries linked to module|
|function_calls|json dict of function call counts. Not a complete external function list, but functions with some level of security impact or interest|
|extra|json dict containing a number of extra features about the module|
|extra.fort_dict|json dict containing all the fortified function and their call counts|
|extra.unfort_dict|json dict containing all the unfortified functions and their call counts|
|extra.ret_dists|json array. return distances of each function, bytes between function head and return instructions within function|
|extra.stack_adjs|json array. size in bytes of every function stack adjust in function prolog|
|extra.branch_dict|json dict containing every branch instruction mnemonic and their count from the text section|
|extra.stack_guard_calls|json array. stack guard call locations (virtual address)|
