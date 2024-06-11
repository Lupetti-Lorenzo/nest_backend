FROM mcr.microsoft.com/devcontainers/javascript-node:1-22-bullseye As development
# Per i poveri sostituire con:
# FROM node:18-alpine As development

# Create app directory
WORKDIR /workspace

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY --chown=node:node package*.json ./

# Install app dependencies using the `npm ci` command instead of `npm install`
RUN npm ci

RUN apt-get update \
    && apt-get install -y xdg-utils

# Bundle app source
COPY --chown=node:node . .

# Expose the ports for the API  
EXPOSE 3000

# RUN apt-get update \
#     && apt-get install -y bash-completion fzf git highlight xdg-utils \
#     # Install bash-git-prompt
#     && git clone https://github.com/magicmonty/bash-git-prompt.git /opt/bash-git-prompt \
#     # Install bash-preexec
#     && git clone https://github.com/rcaloras/bash-preexec.git /opt/bash-preexec \
#     # Clean up
#     && apt-get autoremove -y \
#     && apt-get clean -y \

# 		# Copy custom .bashrc to enable plugins
# COPY .devcontainer/.bashrc /root/.bashrc


# RUN sh -c "$(wget -O- https://github.com/deluan/zsh-in-docker/releases/download/v1.2.0/zsh-in-docker.sh)" -- \
#     -t https://github.com/denysdovhan/spaceship-prompt \
#     -a 'SPACESHIP_PROMPT_ADD_NEWLINE="false"' \
#     -a 'SPACESHIP_PROMPT_SEPARATE_LINE="false"' \
#     -p git \
#     -p ssh-agent \
#     -p https://github.com/zsh-users/zsh-autosuggestions \
#     -p https://github.com/zsh-users/zsh-completions







## tryed to install zsh and autocompletions, but it's not working

# BASH

### .bashrc


# Dockerfile


# ZSH: https://github.com/deluan/zsh-in-docker/blob/master/README.md

# # Set zsh as the default shell
# RUN chsh -s $(which zsh)

# # Install zsh-autosuggestions and zsh-syntax-highlighting plugins
# RUN git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions \
#     && git clone https://github.com/zsh-users/zsh-syntax-highlighting ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting

# # Enable the plugins in .zshrc
# RUN sed -i "s/plugins=(git)/plugins=(git zsh-autosuggestions zsh-syntax-highlighting)/" ~/.zshrc
