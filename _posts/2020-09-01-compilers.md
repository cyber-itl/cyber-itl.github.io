---
layout: post
title:  "A Case for Improving Security Ergonomics of Compilers"
categories: []
tags: []
status: publish
type: post
published: true
meta: {}
excerpt_separator: <!--more-->
---

by Sarah Zatko 

We published [a study](https://cyber-itl.org/2019/08/26/iot-data-writeup.html) a while back showing the failure of the IoT industry to adhere to basic build safety best practices over the past 15 years.  In the light of this failure, I wanted to unpack what some of the root causes might be, and make a case for why better usability and transparency for security features in compiler toolchains would help.    

<!--more-->

First, there were several responses pointing out that some IoT hardware isn’t compatible with these safety features, either because the base hardware literally doesn’t support it, or because of hits to performance.  While I recognize that that could explain some gaps in coverage, I highly doubt that it explains the majority of the products we analyzed.  Why?  Because if the lack of these safety features were due to a conscious decision, or a fundamental incompatibility, then we’d see more consistent trends.  <em>If the build hardening was being driven by engineering decisions or limitations, it wouldn’t vary so widely within the same architecture, vendor, or even product.</em>  We wouldn’t see hardening features randomly drop out of a product entirely when a firmware update comes in.  

When we eliminate legitimate engineering decisions as the root cause of the lack of build safety, there are two likely culprits: lack of motivation on the vendors’ part, and lack of knowledge when it comes to proper build hygiene. 

Vendors certainly do lack motivation in this case – there are no nutritional labels or other mandatory reporting mechanisms, so there’s no transparency with regards to build safety, and no transparency means no accountability.  Also, what security guidelines and standards that IoT products are asked to adhere to miss the importance of build safety to overall security stance, so it’s not something they’ve been made to care about before.  We at CITL have ideas of how to fix this problem of motivation, and we’re working with partners on those fronts, but any efforts there will be much more effective if vendors know what to do once they’ve been made to care.  

So, let’s look at the knowledge side of things.  When we do, there’s a few major contributing factors: 

1. Build safety/hygiene isn’t something that’s generally mentioned in programming courses, or in unit testing guidelines.  It’s so fundamental that it’s been taken for granted, and neglected as a result.  CITL is already working to bring attention to this industry-wide blind spot. 

2. Most major compilers and toolchains support these safety features, but it’s often quite difficult to determine, as someone new to gcc or llvm, what flags or setting will produce the safest build, and there’s no feedback afterwards regarding what was done, from a security perspective.  

I know that usability is an issue, not only because I’ve seen that documentation for myself, but because I know security consultants who maintain wikis for their customers detailing best build practices.  That wouldn’t be necessary if compiler usability weren’t such a problem.  

This second issue, the problem with compiler usability and transparency with regards to safety features, has far-reaching implications, and is something that has a concrete engineering solution.  Both of these things make it stand out to me as a logical starting place.  Before anyone gets too defensive about their preferred toolchain’s technical superiority, let’s be clear - these tools have the potential to significantly improve the security stance of the software they compile.  They’re very impressive tools, with a lot of things happening from a security perspective.  What they aren’t, though, is transparent or intuitive.  

Overall, CITL’s goal here is for there to be security-focused flags to help people make good security choices when producing production code and to understand what security decisions were made during the compile process.  The proposed features are pretty similar to ones that already exist for optimization.  

## Usability

Most popular compilers have a ton of safety features that they support.  Sometimes those features are enabled by default, sometimes not, and as a new user going into the documentation for the first time, it’s pretty tough to figure out what flags to use to get the best safety outcome.  I’ve been told that “you can lead a horse to water, but you can’t make it drink.”  Having looked at the documentation, though, I’d assert that in this case they’ve made sure water existed, but haven’t really led the horse anywhere.  

<em>The first feature on my wish list is a straightforward “<code>-fSecure</code>” convenience flag for people compiling production code.  </em> Either by default, or as an extra option, this flag would also cause a text file manifest to be output, detailing the build hardening and security features of the resultant binary.  What percent of the binaries include each safety feature? What percent of stack operations were given canaries? What percent of potentially fortifiable functions got replaced?  Were writable sections ordered reasonably?  If a security feature like ASLR, DEP, etc was enabled but couldn’t be implemented, the user would be alerted, rather than having it fail silently.  We’ve seen historically that it is too easy for an engineer to think they’ve done the right things, but end up with a final product lacking basic protections.  

We’d also like to see some improvements to the aforementioned documentation.  In particular, it can currently be very difficult to determine build hardening compatibility for a particular environment, and that is something that should be documented.  Some features, like ARM PAC, are architecture-specific.  Often newer hardening features will initially be added only for x86, with an ARM port being added years later.  The documentation should include a straightforward compatibility matrix so that an engineer can easily determine what build hardening is possible for a particular architecture, target OS, etc.  This would help at build time, but also during early planning stages of a product, so that decisions about the environment can include consideration for what safety features are available.  

## Transparency

The manifest mentioned in the usability section would be a great start in the transparency realm, allowing vendors to be more aware of the security traits of their own products, and making it easier for consumers to request information about build hardening in the products they’re purchasing.  

Better transparency, logging, and reporting is needed for two main reasons: one, so that there aren’t silent failures when a requested feature cannot be implemented.  Two, because some security decisions being made are fairly complex, and are currently very black box.  

This second problem is one I’ve heard less about elsewhere, but that we’ve come across in our work at CITL.  For example, without actually inspecting the binaries and finding all symbols that relate to stack guards, it’s nearly impossible to understand or predict where such guards will be placed.  We can see in our analysis that not all stack operations receive canaries, but we end up with no understanding of why some were skipped.  There should be a way to have the compiler output verbose logs detailing how it decided which stack operations required a canary and which did not.  

Similarly, when we did a deep dive [analysis](https://cyber-itl.org/data/2016/11/21/fortify-source-a-deeper-dive-into-the-data.html) of source fortification a few years ago, we found that enabling fortification could result in widely varying outcomes.  Sometimes <1% of relevant functions were fortified, sometimes 100%, but from the perspective of the developer, those outcomes would appear identical.  There is a set of historically risky functions that are theoretically replaced in the fortification process, according to documentation, but in some cases that process appears to be purely theoretical.  Some functions were fortified almost 100% of the time, while some fortified functions were never successfully deployed.  Some “fortified” binaries were still left with thousands of instances of the original, unfortified functions intact.  Without clear logging and reporting on fortification outcomes, an engineer could be left with a false sense of security regarding their end product.  

## Conclusions

There’s many root causes contributing to the sorry state that software development (and IoT specifically) is currently in, but improved security transparency and usability of compilers and their toolchains can only improve the landscape.  I urge anyone who’s involved in the maintenance of a compiler toolchain to consider adding features that bring build hardening to the forefront, and make it easier for software and IoT vendors to do the right thing.  If anyone is interested in funding open source development work in this vein, please contact me at sarah at cyber-itl dot org.  
