{ pkgs ? import <nixpkgs> {} }:
  pkgs.mkShell {
    nativeBuildInputs = with pkgs.buildPackages; [ 

      rubyPackages_3_2.jekyll
      rubyPackages_3_2.rake
      ruby_3_2


    ];
}

