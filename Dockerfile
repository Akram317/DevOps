# Use an official Jenkins image with Kubernetes support
FROM jenkins/jenkins:lts

# Switch to root to install additional tools
USER root

# Install Docker (if needed, adjust for your OS and distribution)
RUN apt-get update && \
    apt-get install -y apt-transport-https \
                       ca-certificates \
                       curl \
                       gnupg2 \
                       software-properties-common && \
    curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add - && \
    add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable" && \
    apt-get update && \
    apt-get install -y docker-ce docker-ce-cli containerd.io && \
    usermod -aG docker jenkins && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Create a directory to store pipeline scripts
RUN mkdir -p /var/jenkins_home/pipeline-scripts

# Set the necessary permissions
RUN chown -R jenkins:jenkins /var/jenkins_home/pipeline-scripts

# Switch back to the Jenkins user
USER jenkins

# Start Jenkins with the pipeline scripts directory as a volume
CMD ["/sbin/tini", "--", "/usr/local/bin/jenkins.sh"]
