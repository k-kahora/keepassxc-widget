
# Table of Contents

1.  [Password Widget](#orgabac9a7)
2.  [Description](#org718af8a)
3.  [Screenshots](#org668ffdc)
4.  [Installation](#orgb75ee05)
    1.  [My hyprland setup](#org8b381cc)
    2.  [Non nixos setup](#org85a71bd)
5.  [Usage](#orgf7cc94f)
6.  [Features](#orga2c8710)
7.  [Contributing](#org594d3e1)


<a id="orgabac9a7"></a>

# Password Widget


<a id="org718af8a"></a>

# Description

This project is essentially a wrapper around KeepassXC. It uses the keepassxc-cli to interact with password database files. I had been using KeepassXC, but it was cumbersome to open the application, select the password, and manually copy it using Ctrl+C. My solution is a much faster, mouseless interface.

Unfortunately, the UI is not easily customizable since I opted for a highly stylized pixel art approach, which doesn’t lend itself to easy color customization. To create the UI, I used AGS.

This project is essentially a wrapper around [Keepassxc](https://keepassxc.org/).  It uses the [keepassxc-cli](https://manpages.ubuntu.com/manpages/focal/man1/keepassxc-cli.1.html) to interact with the password database files.  I had been using [Keepassxc](https://keepassxc.org/) however it was cumbersome to opent the application, select the password, and manually copy it using Ctrl+C. My solution is a much faster, mouseless interface.

I went for a very stylized approach with pixel art which came out pretty good.  To actually create the UI I used [AGS](https://github.com/Aylur/ags).  


<a id="org668ffdc"></a>

# Screenshots

![img](./password-enter.png)
![img](./ss-in-use.png)


<a id="orgb75ee05"></a>

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


<a id="org8b381cc"></a>

## My hyprland setup

    # On start I run pass-launcher open in the background
    
    bind = $mainMod, P, exec, pass-launcher toggle


<a id="org85a71bd"></a>

## Non nixos setup

Dependecies

-   keepassxc
-   ags
-   libsecret (secret-tool)

clone the project and just run `ags -c ./config.js`


<a id="orgf7cc94f"></a>

# Usage

Open up an existing keepassxc database file and enter your password to begin browsing the available passwords.  Hitting enter on one


<a id="orga2c8710"></a>

# Features

-   [X] Open any database file on your system
-   [X] Toggle between username and password
-   [X] Enter groups and leave groups
-   [X] C-g to toggle password or username
-   [X] C-r to reset the database search
-   [X] Click on lock to lock database file
-   [X] Reads the `KEEPASSXC_BD` env variable so you do not have to use file selector


<a id="org594d3e1"></a>

# Contributing

