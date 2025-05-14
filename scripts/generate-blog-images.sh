#!/bin/bash

# Create the blog images directory if it doesn't exist
mkdir -p public/images/blog

# Function to create a placeholder image with text
create_placeholder() {
  local filename=$1
  local text=$2
  local width=$3
  local height=$4
  
  convert -size ${width}x${height} xc:lightgray \
    -gravity center -pointsize 30 -annotate 0 "$text" \
    -quality 90 "public/images/blog/$filename"
}

# Create placeholder images
create_placeholder "stockholm-cityscape.webp" "Stockholm Cityscape" 1280 960
create_placeholder "local-restaurant.webp" "Local Restaurant" 800 600
create_placeholder "sushi-plate.webp" "Sushi Plate" 800 600
create_placeholder "arcade-gaming.webp" "Arcade Gaming" 800 600 