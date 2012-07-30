#!/bin/sh

yui=~/work/DecalDemo/yuicompressor-2.4.7.jar
if [ ! -e "$yui" ]
then
    echo don\'t know where yuicompressor is! > /dev/stderr
    exit
fi
cp jquery-1.7.2.min.js fragmenty.min.js
java -jar $yui fragmenty.js >> fragmenty.min.js
