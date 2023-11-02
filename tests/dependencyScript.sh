#!/bin/bash

# Update package repositories
sudo apt-get update -y

# Install Python (if not already installed)
sudo apt-get install -y python3

# Install pip (Python package manager)
sudo apt-get install -y python3-pip

# Install Selenium Python bindings
pip3 install selenium

# Install Google Chrome (replace with your preferred browser)
sudo apt-get install -y google-chrome-stable

# Install ChromeDriver
# Download the appropriate version of ChromeDriver and install it
CHROME_DRIVER_VERSION="your_chromedriver_version"
wget -N https://chromedriver.storage.googleapis.com/$CHROME_DRIVER_VERSION/chromedriver_linux64.zip -P ~/
unzip ~/chromedriver_linux64.zip -d ~/
sudo mv -f ~/chromedriver /usr/local/bin/chromedriver
sudo chmod +x /usr/local/bin/chromedriver
rm ~/chromedriver_linux64.zip

# Add ChromeDriver to system PATH (optional)
echo "export PATH=\$PATH:/usr/local/bin/chromedriver" >> ~/.bashrc

# Additional dependencies can be installed here
# e.g., libraries for headless mode, browser drivers for Firefox, etc.

echo "Selenium dependencies installed successfully"

