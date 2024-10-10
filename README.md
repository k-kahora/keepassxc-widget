
# Table of Contents

1.  [Password Widget](#orge83a1d7)
2.  [Description](#org1c44a8d)
3.  [Demo](#org15bd1f8)
4.  [Installation](#org5f9b179)
    1.  [My hyprland setup](#org49f6a6d)
5.  [Usage](#org760a631)
6.  [Features](#org4db68a1)
7.  [Contributing](#org22883db)
8.  [Credits](#org65c1713)
9.  [Contact](#org6d6167a)


<a id="orge83a1d7"></a>

# Password Widget


<a id="org1c44a8d"></a>

# Description

This is essentially a wrapper around [Keepassxc](https://keepassxc.org/).  It uses the [keepassxc-cli](https://manpages.ubuntu.com/manpages/focal/man1/keepassxc-cli.1.html) to interact with the password database files.  I have been using [Keepassxc](https://keepassxc.org/) however it was really bothering me having to open the application, click the password I wanted and click C-c, my soloution is a much faster mousless interface.  Unfortunatley the UI is not easily customizable as I went for a very stylized approach with pixel art which does not lend itself to easy color customizing.  To actually create the UI I used [AGS](https://github.com/Aylur/ags).  


<a id="org15bd1f8"></a>

# Demo


<a id="org5f9b179"></a>

# Installation

if your using nix then its super easy, just add it as in input and put the derivation in your packages

    
    {
      description = "demo flake";
    
      inputs = {
        nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
        flake-utils.url = "github:numtide/flake-utils";
    
        pix_pass = {
          url = "github:k-kahora/keepass-widget";
        };
      };
    
      outputs = { self, nixpkgs, flake-utils, }:
        flake-utils.lib.eachDefaultSystem (system:
          let
            pkgs = nixpkgs.legacyPackages.${system};
            lib = pkgs.lib;
            pix_pass_pkg = pix_pass.packages.${system}."default";
          in
          {
            devShells.default = pkgs.mkShell {
              packages = [
                  pix_pass_pkgs
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


<a id="org49f6a6d"></a>

## My hyprland setup

    # On start I run pass-launcher open in the background
    
    bind = $mainMod, P, exec, pass-launcher toggle


<a id="org760a631"></a>

# Usage


<a id="org4db68a1"></a>

# Features

-   [X] Open any database file on your system
-   [X] Toggle between username and password
-   [X] Enter groups and leave groups
-   [X] C-g to toggle password or username
-   [X] C-r to reset the database search
-   [X] Click on lock to lock database file
-   [X] Reads the `KEEPASSXC_BD` env variable so you do not have to use file selector


<a id="org22883db"></a>

# Contributing


<a id="org65c1713"></a>

# Credits


<a id="org6d6167a"></a>

# Contact

