{
  description = "keepassxc flake";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";

    quickshell = {
      url = "git+https://git.outfoxxed.me/outfoxxed/quickshell";
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
        pkgs = nixpkgs.legacyPackages.${system};
        lib = pkgs.lib;
        agsPkg = ags.packages.${system}."default";
        ewwPkg = eww.packages.${system}."default";
        quickshellPkg = quickshell.packages.${system}."default".override {
          withHyprland = true;
        };
      in
      {
        devShells.default = pkgs.mkShell {
          packages = [
            pkgs.keepassxc
            pkgs.eww
            pkgs.rofi-wayland
            pkgs.libsecret
            pkgs.adw-gtk3
            pkgs.nwg-look
            quickshellPkg
            agsPkg
          ];
        };

        packages.pass-launcher = pkgs.stdenv.mkDerivation {
          name = "pass-launcher";
          nativeBuildInputs = [ pkgs.makeWrapper ];
          src = ./.;
          buildPhase = ''
            echo "Nothing is done here"
          '';
          installPhase = ''
            mkdir -p $out/bin
            cp style.css $out/bin
            cp -r assets $out/bin/assets
            cp justfile $out/bin
            cp config.js $out/bin
            cp start.sh $out/bin/pass-launcher
            wrapProgram $out/bin/pass-launcher \
              --suffix PATH : ${lib.makeBinPath [ pkgs.libsecret agsPkg ]}
          '';
        };
      }
    );
}
