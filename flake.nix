{
  description = "keepassxc flake";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";
    flake-utils.url = "github:numtide/flake-utils";

    ags = {
      url = "github:Aylur/ags";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = { self, nixpkgs, flake-utils,  ags,  }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        lib = pkgs.lib;
        agsPkg = ags.packages.${system}."default";
      in
      {
        devShells.default = pkgs.mkShell {
          packages = [
            pkgs.keepassxc
            pkgs.libsecret
            pkgs.adw-gtk3
            pkgs.nwg-look
            agsPkg
          ];
        };

        packages.default = pkgs.stdenv.mkDerivation {
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
