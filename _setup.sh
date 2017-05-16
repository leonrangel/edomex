#!/bin/bash
# Local setup
# To keep the repository clean all platforms and plugins must be
# installed locally as required for testing

# Add platforms
#phonegap platform add android
#phonegap platform add ios

# Add plugins
phonegap plugin add cordova-plugin-battery-status
phonegap plugin add cordova-plugin-camera
phonegap plugin add cordova-plugin-console
phonegap plugin add cordova-plugin-contacts
phonegap plugin add cordova-plugin-device
phonegap plugin add cordova-plugin-device-motion
phonegap plugin add cordova-plugin-device-orientation
phonegap plugin add cordova-plugin-dialogs
phonegap plugin add cordova-plugin-file
phonegap plugin add cordova-plugin-file-transfer
phonegap plugin add cordova-plugin-geolocation
phonegap plugin add cordova-plugin-globalization
phonegap plugin add cordova-plugin-inappbrowser
phonegap plugin add cordova-plugin-media
phonegap plugin add cordova-plugin-media-capture
phonegap plugin add cordova-plugin-network-information
phonegap plugin add cordova-plugin-splashscreen
phonegap plugin add cordova-plugin-vibration
phonegap plugin add cordova-plugin-whitelist
phonegap plugin add phonegap-plugin-barcodescanner
phonegap plugin add cordova-plugin-facebook4 --variable APP_ID="446243748916389" --variable APP_NAME="SomosFut"
#phonegap plugin add phonegap-plugin-push --variable 