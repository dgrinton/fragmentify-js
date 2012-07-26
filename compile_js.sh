#!/bin/sh

cp jquery-1.7.2.min.js fragmenty.min.js
java -jar ~/work/DecalDemo/yuicompressor-2.4.7.jar fragmenty.js >> fragmenty.min.js
