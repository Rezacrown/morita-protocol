FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
    curl \
    git \
    jq \
    unzip \
    build-essential \
    pkg-config \
    libssl-dev \
    python3.10 \
    python3.10-venv \
    python3-pip \
    nodejs \
    npm \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# -------------------------
# Python setup
# -------------------------

RUN python3.10 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

RUN pip install --upgrade pip setuptools wheel

# Install Python deps
RUN pip install garaga==0.18.1

# -------------------------
# Install bun
# -------------------------

RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:$PATH"

# -------------------------
# Install Noir
# -------------------------

RUN curl -L https://raw.githubusercontent.com/noir-lang/noirup/main/install | bash
ENV PATH="/root/.nargo/bin:$PATH"
RUN noirup --version 1.0.0-beta.6

# -------------------------
# Install Barretenberg
# -------------------------

RUN curl -L https://raw.githubusercontent.com/AztecProtocol/aztec-packages/master/barretenberg/bbup/install | bash
ENV PATH="/root/.bb:$PATH"
RUN bbup --version 0.86.0-starknet.1

# -------------------------
# Install Starknet Foundry
# -------------------------

RUN curl -L https://foundry.paradigm.xyz | bash

# -------------------------
# Install Scarb
# -------------------------

RUN curl https://docs.swmansion.com/scarb/install.sh | bash
ENV PATH="/root/.local/bin:$PATH"

WORKDIR /workspace