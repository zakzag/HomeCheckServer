#!/bin/bash

# color constants
red='\e[0;31m'
green='\e[0;32m'
blue='\e[0;34m'
lgray='\e[0;37m'
none='\e[0'
lcyan='\e[96m'

# directories and files
deploy_root="/www"
deploy_prod_dir="$deploy_root/prod"
deploy_upload_dir="$deploy_root/upload"
deploy_log_dir="$deploy_root/log"
build_number_filename="$deploy_upload_dir/build-number.txt"
build_info_filename="$deploy_upload_dir/build-info.txt"
artifact_filename="build-artifact.tar.gz"
artifact_file_path="$deploy_upload_dir/$artifact_filename"

log_file="$deploy_log_dir/deploy.log"
output_log_file="$deploy_log_dir/last_deploy_output.log"

# channel all to logfile
exec 3>&1 4>&2
trap 'exec 2>&4 1>&3' 0 1 2 3
exec 1>"$output_log_file" 2>&1

# log function logs text to file and stdout
# @param text    text to log
# @param type    log entry type: FATAL,LOG,INFO,WARN
log() {
    local text=$1
    local type=$2
    local color=$none
    local now=$(date +'%Y-%m-%d %T')

    case "$type" in
    FATAL)
        color=$red
        ;;
    LOG)
        color=$lgray
        ;;
    INFO)
        color=$lcyan
        ;;
    WARN)
        color=$yellow
        ;;
    *)
        color=$lgray
    esac

    echo -e "$yellow$now$color    $1"
    echo -e "$now  $1" >> "$log_file"
}

log "Deploying production...";

#getting 
build_number=$(<"$build_number_filename")
build_info=$(<"$build_info_filename")

# change directory to "deploy production" dir
cd "$deploy_prod_dir"

# uncompress new version
if [ -f $artifact_file_path ]; then
    log "uncompressing artifact file: $artifact_file_path"
    tar -xvf "$artifact_file_path" -C "$deploy_prod_dir"
else
    log "FATAL ERROR, Artifact is missing, exiting deploy process." "FATAL"
fi

# copy build files into prod dir
cp "$build_number_filename" "$deploy_prod_dir"
cp "$build_info_filename" "$deploy_prod_dir"

# git commit /www/prod folder to make snapshot
log "creating git snapshot"
git add -A
git commit -m"prod deploy, build No: $build_number, $build_info"
log "copying files"

# create/overwrite file /www/prod/config/mode > "PROD"
# restart pm2
log "restarting pm2"
pm2 restart "$deploy_prod_dir/config/ecosystem.config.js"