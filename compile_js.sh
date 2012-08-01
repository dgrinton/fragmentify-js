#!/bin/sh

yui=~/work/DecalDemo/yuicompressor-2.4.7.jar
if [ ! -e "$yui" ]
then
    echo don\'t know where yuicompressor is! > /dev/stderr
    exit
fi
cp jquery-1.7.2.min.js fragmentify.min.js
java -jar $yui fragmentify.js >> fragmentify.min.js
