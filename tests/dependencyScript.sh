#!/bin/bash

# Update package repositories
apt-get update -y

# Install Python (if not already installed)
apt-get install -y python3

# Install pip (Python package manager)
apt-get install -y python3-pip

# Install Selenium Python bindings
#pip3 install selenium

# Install Google Chrome (replace with your preferred browser)
# # Adding trusting keys to apt for repositories
# wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -

# # Adding Google Chrome to the repositories
# sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list'
rm -rf /etc/apt/sources.list.d/google-chrome.list

apt-get update -y

# # Install ChromeDriver
# # Download the appropriate version of ChromeDriver and install it
CHROME_DRIVER_VERSION="100.0.4896.20"
wget -N https://chromedriver.storage.googleapis.com/$CHROME_DRIVER_VERSION/chromedriver_linux64.zip -P ~/
unzip ~/chromedriver_linux64.zip -d ~/
rm ~/chromedriver_linux64.zip
chmod +x ~/chromedriver
#ls -la ~/
sh '~/chromedriver -v'

# Add ChromeDriver to system PATH (optional)
#echo "export PATH=\$PATH:~/chromedriver" >> ~/.bashrc

# Additional dependencies can be installed here
# e.g., libraries for headless mode, browser drivers for Firefox, etc.

echo "Selenium dependencies installed successfully"

