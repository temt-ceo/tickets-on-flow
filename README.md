# tickets-on-flow
このプロジェクトではNuxt.jsを使用しています。Nuxt.jsはフランスのボルドーでプロジェクトが立ち上がった、Vueのファンによるライブラリです。
今では世界中にファンがおり、Flowチームの中にもファンがいます。そして誰でもNuxtを使用してFlow BlockchainのDappが開発できるようになっています。
詳しくは以下:
https://github.com/brunogonzales/fcl-nuxt-starter

## App

Tickets is a payment support service for individuals who actively use social media. You can earn $FLOW with a dedicated web page tied to your wallet address. 🌳

Tickets Onchain is
1. friendly to climate change
2. friendly to victims of war
3. help those suffering from heat waves to earn cash income.

🌳 Eco at home Apps: https://tickets-onchain.com/

Tickets Onchain was inspired by the need for an app that would allow the economically disadvantaged in Ukraine to start a business.

🌳 Eco at home Apps: https://tickets-onchain.com

## Build Setup

### Install Rust

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

source $HOME/.cargo/env

rustup --version

cargo --version
```

### Install wasm-pack

```bash
cargo install wasm-pack
```

### Setting up and build a package using wasm-pack for Rust project

```bash
# Setting up a package
mkdir rust
cd rust
cargo new --lib encrypt-phrase

# Build a package
wasm-pack build --target web

# When executed, the following is displayed
> Your wasm pkg is ready to publish at /Users/taharatakashi/AI/tickets-on-flow/rust/encrypt-phrase/pkg.
```

### Start Nuxt project
```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, check out the [documentation](https://nuxtjs.org).

## Special Directories

You can create the following extra directories, some of which have special behaviors. Only `pages` is required; you can delete them if you don't want to use their functionality.

### `assets`

The assets directory contains your uncompiled assets such as Stylus or Sass files, images, or fonts.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/assets).

### `components`

The components directory contains your Vue.js components. Components make up the different parts of your page and can be reused and imported into your pages, layouts and even other components.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/components).

### `layouts`

Layouts are a great help when you want to change the look and feel of your Nuxt app, whether you want to include a sidebar or have distinct layouts for mobile and desktop.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/layouts).


### `pages`

This directory contains your application views and routes. Nuxt will read all the `*.vue` files inside this directory and setup Vue Router automatically.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/get-started/routing).

### `plugins`

The plugins directory contains JavaScript plugins that you want to run before instantiating the root Vue.js Application. This is the place to add Vue plugins and to inject functions or constants. Every time you need to use `Vue.use()`, you should create a file in `plugins/` and add its path to plugins in `nuxt.config.js`.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/plugins).

### `static`

This directory contains your static files. Each file inside this directory is mapped to `/`.

Example: `/static/robots.txt` is mapped as `/robots.txt`.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/static).

### `store`

This directory contains your Vuex store files. Creating a file in this directory automatically activates Vuex.

More information about the usage of this directory in [the documentation](https://nuxtjs.org/docs/2.x/directory-structure/store).

### main net procedure
```
flow version # Version: v0.37.2

flow keys generate --network=mainnet

1. access to port flow : port.onflow.org
2. click "Advanced"
3. click "Create New Account"
4. Copy your public key, paste public key.
#5. access to flow-view-source : flow-view-source.com/mainnet
6. From port.onflow.org send a few FLOW tokens to mainnet-account address.

flow init # Configuration initialized
> Start emulator by running: 'flow emulator'
> Reset configuration using: 'flow init --reset'


flow project deploy --network=mainnet

# Re-deploy command
flow accounts update-contract Tickets ./cadence/Tickets.cdc --signer=mainnet-account --network=mainnet

# add capability receiver to an account
node addCap.js
```