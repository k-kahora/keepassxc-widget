
{
  description = "keepassxc flake";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";

    quickshell = {
      url = "git+https://git.outfoxxed.me/outfoxxed/quickshell";

      # THIS IS IMPORTANT
      # Mismatched system dependencies will lead to crashes and other issues.
      inputs.nixpkgs.follows = "nixpkgs";
    };
    eww = { 
      url = "github:elkowar/eww";
      inputs.nixpkgs.follows = "nixpkgs";
    };
      ags = {
            url = "github:Aylur/ags";
            inputs.nixpkgs.follows = "nixpkgs";
          };
  };

  outputs = { self, nixpkgs, flake-utils, quickshell, ags, eww }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        legacyPackages = nixpkgs.legacyPackages.${system};
        lib = legacyPackages.lib;
        agsPkg = ags.packages.${system}."default";
        ewwPkg = eww.packages.${system}."default";
        quickshellPkg = quickshell.packages.${system}."default".override
          {
            withHyprland = true;
          };
      in
      {
        devShells.default = legacyPackages.mkShell {
          packages = [
            legacyPackages.keepassxc
            legacyPackages.eww
            legacyPackages.rofi-wayland
            legacyPackages.libsecret
            legacyPackages.adw-gtk3
            legacyPackages.nwg-look
            quickshellPkg
            agsPkg
          ];
        };

      }
    );
}
