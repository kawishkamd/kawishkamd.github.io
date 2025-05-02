---
title: "How to install software using powershell on windows"
date: 2024-01-04T11:30:03+00:00
# weight: 1
# aliases: ["/first"]
tags: ["windows","how-to","powershell","kawishkamd"]
categories: ["Windows"]
author: "Kavishka"
# author: ["Me", "You"] # multiple authors
showToc: true
TocOpen: false
draft: false
hidemeta: false
comments: true
description: ""
disableHLJS: false # to disable highlightjs
disableShare: false
ShowShareButtons: true
hideSummary: false
searchHidden: false
ShowReadingTime: true
ShowBreadCrumbs: true
ShowPostNavLinks: true
ShowWordCount: true
ShowCodeCopyButtons: true
ShowRssButtonInSectionTermList: true
UseHugoToc: true
cover:
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgKIdo65S_5dsgcWgW0RhH5KtyBO-H9lM-FIn0OiT66GqJsQhRmZdgnfk3y9B0GTfkm5OJm3_Tem5_f1zpB_IeVRsGEBjgnpfx2GhaLky4mqQNI6yJQEPe9zm-xcv7-pq6Hg39Pqpc6OOzCeSawF78Fhx-1TjyO6-Xp9eX3roAz9YnAhlVmbfdSuANS_a87/s1200/choco.png" # image path/url
    alt: "<alt text>" # alt text
    caption: "<text>" # display caption under cover
    relative: true # when using page bundles set this to true
    hidden: true # only hide on current single page
editPost:
    URL: "https://github.com/kawishkamd/kawishkamd.github.io/tree/main/content"
    Text: "Suggest Changes" # edit text
    appendFilePath: true # to append file path to Edit link
---
### Streamlining Software Installation with PowerShell and Chocolatey
#### Introduction:

Installing and managing software on a Windows system can be a time-consuming task, especially when dealing with multiple applications. PowerShell, a powerful scripting language and automation framework, comes to the rescue when it comes to automating repetitive tasks. In this article, we will explore how to simplify software installation on Windows using PowerShell and Chocolatey, a package manager for Windows.


![Chocolatey Image](https://chocolatey.org/assets/images/global-shared/logo-square.svg)


### What is Chocolatey?
Chocolatey is a package manager for Windows that automates the process of installing, updating, configuring, and removing software from your system. It simplifies the tedious task of downloading and installing software by providing a command-line interface for managing packages. One of the key advantages of Chocolatey is its vast repository of packages, making it easy to find and install a wide range of software.

### Installing Chocolatey:
- Before diving into software installation, let's start by installing Chocolatey itself. Open PowerShell with administrator privileges and run the following command:

```powershell
Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))

```

This command will download and execute the Chocolatey installation script, configuring your system to use Chocolatey.

### Searching for Software with Choco:
Once Chocolatey is installed, you can use the choco search command to find packages available in the Chocolatey repository. For example, if you want to search for the popular text editor "Visual Studio Code," you can run:

```powershell
choco search visualstudiocode
```
Chocolatey will display a list of relevant packages along with their versions and descriptions. This makes it easy to identify the package you want to install.

### Installing Software with Choco:
After finding the desired software package, installing it is a breeze. Use the choco install command followed by the package name. For instance, to install Visual Studio Code, run:

```powershell
choco install visualstudiocode
```
Chocolatey will download and install the specified package along with its dependencies, streamlining the entire process.

### Updating and Uninstalling Software:
Chocolatey also simplifies the process of updating and uninstalling software. 
### To update a package, use the following command:
```powershell
choco upgrade visualstudiocode
```

### For uninstallation, use:
```powershell
choco uninstall visualstudiocode
```
peace <3