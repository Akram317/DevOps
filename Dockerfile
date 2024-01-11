# Use an official Jenkins image as a base image
FROM jenkins/jenkins:lts

# Install necessary plugins (if any) using install-plugins.sh script
# Example:
# COPY plugins.txt /usr/share/jenkins/ref/plugins.txt
# RUN /usr/local/bin/install-plugins.sh < /usr/share/jenkins/ref/plugins.txt

# Create a directory for Jenkins scripts
RUN mkdir -p /var/jenkins_home/scripts

# Copy the Jenkins pipeline script to the appropriate location
COPY scripts /var/jenkins_home/scripts/

# Set the necessary permissions
USER root
RUN chown -R jenkins:jenkins /var/jenkins_home/scripts
USER jenkins
