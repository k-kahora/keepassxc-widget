
# Table of Contents

1.  [Password Widget](#org41d0dc8)
2.  [Description](#org2f6c20a)
3.  [Demo](#org3062a50)
4.  [Installation](#orga06a9f2)
    1.  [My hyprland setup](#org0f2f65f)
    2.  [Non nixos setup](#org69209dd)
5.  [Usage](#org94434c1)
6.  [Features](#org6a96a2c)
7.  [Contributing](#org538ba55)
8.  [Credits](#org8cf1d92)
9.  [Contact](#org2bd23ad)


<a id="org41d0dc8"></a>

# Password Widget


<a id="org2f6c20a"></a>

# Description

This is essentially a wrapper around [Keepassxc](https://keepassxc.org/).  It uses the [keepassxc-cli](https://manpages.ubuntu.com/manpages/focal/man1/keepassxc-cli.1.html) to interact with the password database files.  I have been using [Keepassxc](https://keepassxc.org/) however it was really bothering me having to open the application, click the password I wanted and click C-c, my soloution is a much faster mousless interface.  Unfortunatley the UI is not easily customizable as I went for a very stylized approach with pixel art which does not lend itself to easy color customizing.  To actually create the UI I used [AGS](https://github.com/Aylur/ags).  


<a id="org3062a50"></a>

# Demo

./2024-10-10 03-07-23.mp4


<a id="orga06a9f2"></a>

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


<a id="org0f2f65f"></a>

## My hyprland setup

    # On start I run pass-launcher open in the background
    
    bind = $mainMod, P, exec, pass-launcher toggle


<a id="org69209dd"></a>

## Non nixos setup

Dependecies

-   keepassxc
-   adw-gtk3 and nwg-look optional, I use for themeing
-   ags
-   libsecret (secret-tool)

clone the project and just run `ags -c ./config.js`


<a id="org94434c1"></a>

# Usage

Open up an existing keepassxc database file and enter your password to begin browsing the available passwords.  Hitting enter on one


<a id="org6a96a2c"></a>

# Features

-   [X] Open any database file on your system
-   [X] Toggle between username and password
-   [X] Enter groups and leave groups
-   [X] C-g to toggle password or username
-   [X] C-r to reset the database search
-   [X] Click on lock to lock database file
-   [X] Reads the `KEEPASSXC_BD` env variable so you do not have to use file selector


<a id="org538ba55"></a>

# Contributing


<a id="org8cf1d92"></a>

# Credits


<a id="org2bd23ad"></a>

# Contact

