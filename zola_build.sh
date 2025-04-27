#!/bin/bash

ZOLA_VER="v0.20.0"
TAR_FILE="zola-$ZOLA_VER-x86_64-unknown-linux-gnu.tar.gz"

set -ex

wget https://github.com/getzola/zola/releases/download/$ZOLA_VER/$TAR_FILE

tar xf $TAR_FILE

./zola build

