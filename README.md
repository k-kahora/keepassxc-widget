
# Table of Contents

1.  [Password Widget](#org9650b04)
2.  [Description](#orgc13ca74)
3.  [Demo](#orge320de1)
4.  [Installation](#org6ade73f)
    1.  [My hyprland setup](#org499b75b)
    2.  [Non nixos setup](#orgf282664)
5.  [Usage](#org43489c3)
6.  [Features](#org8bbf90c)
7.  [Contributing](#orge765f0e)
8.  [Credits](#orgf5bcf87)
9.  [Contact](#org76f5eba)


<a id="org9650b04"></a>

# Password Widget


<a id="orgc13ca74"></a>

# Description

This is essentially a wrapper around [Keepassxc](https://keepassxc.org/).  It uses the [keepassxc-cli](https://manpages.ubuntu.com/manpages/focal/man1/keepassxc-cli.1.html) to interact with the password database files.  I have been using [Keepassxc](https://keepassxc.org/) however it was really bothering me having to open the application, click the password I wanted and click C-c, my soloution is a much faster mousless interface.  Unfortunatley the UI is not easily customizable as I went for a very stylized approach with pixel art which does not lend itself to easy color customizing.  To actually create the UI I used [AGS](https://github.com/Aylur/ags).  


<a id="orge320de1"></a>

# Demo

<video src="https://raw.githubusercontent.com/k-kahora/keepassxc-widget/refs/heads/master/demo.mp4"></video>


<a id="org6ade73f"></a>

# Installation

if your using nix then its super easy, just add it as in input and put the derivation in your packages

    
    {
      description = "demo flake";
    
      inputs = {
        nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
        flake-utils.url = "github:numtide/flake-utils";
    
        pix_pass = {
          url = "github:k-kahora/keepassxc-widget";
        };
      };
    
      outputs = { self, nixpkgs, flake-utils, pix_pass}:
        flake-utils.lib.eachDefaultSystem (system:
          let
            pkgs = nixpkgs.legacyPackages.${system};
            lib = pkgs.lib;
            pix_pass_pkg = pix_pass.packages.${system}."default";
          in
          {
            devShells.default = pkgs.mkShell {
              packages = [
                  pix_pass_pkg
              ];
            };
          }
        );
    }

Then just run 

    
    nix develop
    
    pass-launcher open
    
    # to toggle the visablity
    pass-launcher toggle


<a id="org499b75b"></a>

## My hyprland setup

    # On start I run pass-launcher open in the background
    
    bind = $mainMod, P, exec, pass-launcher toggle


<a id="orgf282664"></a>

## Non nixos setup

Dependecies

-   keepassxc
-   adw-gtk3 and nwg-look optional, I use for themeing
-   ags
-   libsecret (secret-tool)

clone the project and just run `ags -c ./config.js`


<a id="org43489c3"></a>

# Usage

Open up an existing keepassxc database file and enter your password to begin browsing the available passwords.  Hitting enter on one


<a id="org8bbf90c"></a>

# Features

-   [X] Open any database file on your system
-   [X] Toggle between username and password
-   [X] Enter groups and leave groups
-   [X] C-g to toggle password or username
-   [X] C-r to reset the database search
-   [X] Click on lock to lock database file
-   [X] Reads the `KEEPASSXC_BD` env variable so you do not have to use file selector


<a id="orge765f0e"></a>

# Contributing


<a id="orgf5bcf87"></a>

# Credits


<a id="org76f5eba"></a>

# Contact

