#!/bin/bash

is_remote_newer() {
	remote_url=$1
	local_file=$2

	remote_last_modified=$(curl -sI $remote_url | grep -i "Last-Modified" | cut -d' ' -f2-)
	remote_timestamp=$(date -d "$remote_last_modified" +%s)
	local_timestamp=$(stat -c %Y $local_file)

	if [ $remote_timestamp -gt $local_timestamp ]; then
		return 0
	else
		return 1
	fi
}

arch=$(uname -m)

if [ "$arch" = "x86_64" ]; then
	swc_url="https://github.com/swc-project/swc/releases/latest/download/swc-linux-x64-gnu"
	swc_local="/bin/swc-linux-x64-gnu"
elif [ "$arch" = "aarch64" ]; then
	swc_url="https://github.com/swc-project/swc/releases/latest/download/swc-linux-arm64-musl"
	swc_local="/bin/swc-linux-arm64-musl"
else
	echo "Unsupported architecture: $arch"
	exit 1
fi

if [ ! -f $swc_local ] || is_remote_newer $swc_url $swc_local; then
	sudo curl -o $swc_local -L $swc_url
	sudo chmod +x $swc_local
fi

mkdir -p dist
cat src/**/*.js > dist/dim.js
$swc_local compile dist/dim.js --out-file dist/dim.min.js --config-file .swcrc
