FROM phusion/passenger-nodejs:2.0.0

# Set correct environment variables
ENV HOME /home/app
ENV DOCKERIZE_VERSION v0.2.0
## downgrading NodeJS
ENV NVM_DIR /usr/local/nvm
ENV NODE_VERSION 0.10.46
# ENV NODE_VERSION 0.6.12 #version in the old server
ENV NODE_PATH $NVM_DIR/versions/node/v$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

# Use baseimage-docker's init process
CMD ["/sbin/my_init"]

# Update installed APT packages, clean up when done
RUN apt-get update && \
    apt-get upgrade -y -o Dpkg::Options::="--force-confold" && \
    apt-get install wget git ntp -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Enable Passenger and Nginx and remove the default site
# Preserve env variables for nginx
RUN rm -f /etc/service/nginx/down && \
    rm /etc/nginx/sites-enabled/default
COPY vendor/docker/webapp.conf /etc/nginx/sites-enabled/webapp.conf
COPY vendor/docker/00_app_env.conf /etc/nginx/conf.d/00_app_env.conf

# install dockerize
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz && \
    tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

# Use Amazon NTP servers
COPY vendor/docker/ntp.conf /etc/ntp.conf

# Copy webapp folder
COPY . /home/app/webapp/

# Replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Set debconf to run non-interactively
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections

WORKDIR /home/app/webapp/vendor
# Install nvm with node and npm
# RUN /sbin/setuser app cp nvm/bash_profile ~/.bash_profile \
RUN bash /home/app/webapp/vendor/nvm/install.sh\
    && source $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

RUN chown -R app:app /home/app/webapp && \
    chmod -R 755 /home/app/webapp

# Install npm and bower packages
WORKDIR /home/app/webapp
RUN npm install

# Run additional scripts during container startup (i.e. not at build time)
# Process templates using ENV variables
RUN mkdir -p /etc/my_init.d
COPY vendor/docker/70_templates.sh /etc/my_init.d/70_templates.sh
COPY vendor/docker/80_submodules.sh /etc/my_init.d/80_submodules.sh

# Expose web
EXPOSE 80
