{ pkgs ? import <nixpkgs> {} }:
  pkgs.mkShell {
    nativeBuildInputs = with pkgs.buildPackages; [
      rubyPackages_3_2.jekyll
      rubyPackages_3_2.rake
      rubyPackages_3_2.jekyll-paginate
      rubyPackages_3_2.kramdown-parser-gfm
      rubyPackages_3_2.webrick
      ruby_3_2
    ];
}

