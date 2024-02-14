FROM library/node:lts-bookworm

ARG DEBIAN_FRONTEND=noninteractive

# Install Docker
RUN apt update \
    && apt install -y --no-install-recommends sudo curl \
    && curl -fsSL https://get.docker.com -o get-docker.sh \
    && sh get-docker.sh \
    && apt autoremove -y \
    && rm -rf /var/lib/apt/lists/* \
    && echo "node ALL=(ALL) NOPASSWD: ALL" >/etc/sudoers.d/node \
    && chmod 0440 /etc/sudoers.d/node 
  



