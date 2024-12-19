<!-- markdownlint-disable -->
<div align="center">
<h1>Konarr Frontend Client</h1>

[![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)][github]
[![Crates.io Version](https://img.shields.io/crates/v/konarr?style=for-the-badge)][crates-io]
[![Crates.io Downloads (recent)](https://img.shields.io/crates/dr/konarr?style=for-the-badge)][crates-io]
[![GitHub Stars](https://img.shields.io/github/stars/42ByteLabs/konarr?style=for-the-badge)][github]
[![GitHub Issues](https://img.shields.io/github/issues/42ByteLabs/konarr-client?style=for-the-badge)][github-issues]
[![Licence](https://img.shields.io/github/license/42ByteLabs/konarr?style=for-the-badge)][license]

⚠️  This is currently a work in progress and still in the early stages of development ⚠️

</div>
<!-- markdownlint-restore -->

## Overview

[Konarr][konarr] is a simple, easy-to-use web interface for monitoring your servers, clusters, and containers for supply chain attacks.
It is designed to be lightweight and fast, with minimal resource usage.

This repository contains the client-side code for [Konarr][konarr].

## 🚀 Local Development

To run the client locally, you will need to have the following installed:

- [Node.js][node] & [npm][npm]

Once you have the above installed, you can run the following commands:

```bash
npm install
```

This will install all the required dependencies.

To start the development server, run:

```bash
npm run dev
```

This will start the development server on `http://localhost` and you can access the client from your browser.

### 🌐 Setting up the Server

To access a Konarr Server instance, you will need to have the [Konarr Server][github] running.
Checkout the [Konarr Server][github] repository for more information on how to run the server.

You can set the server URL by creating a `.env` file in the root of the project and adding the following:

```env
VITE_SERVER_BASE_URL=http://localhost:8000/api
```

Replace `http://localhost:8000/api` with the URL of your server.

## ✨ Components

Here is the core components used by Konarr:

- [VueJS][vue]
- [Tailwind][tailwind]
- [Material Design Icons (MDI)][mdi]
- [Heroicons][heroicons]
- [HeadlessUI][headlessui]

## ❤️  Maintainers / Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://geekmasher.dev"><img src="https://avatars.githubusercontent.com/u/2772944?v=4?s=100" width="100px;" alt="Mathew Payne"/><br /><sub><b>Mathew Payne</b></sub></a><br /><a href="#code-GeekMasher" title="Code">💻</a> <a href="#review-GeekMasher" title="Reviewed Pull Requests">👀</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

## 🦸 Support

Please create [GitHub Issues][github-issues] if there are bugs or feature requests.

This project uses [Semantic Versioning (v2)][semver] and with major releases, breaking changes will occur.

## 📓 License

This project is licensed under the terms of the Apache2 open source license.
Please refer to [Apache2][license] for the full terms.

<!-- Resources -->

[license]: ./LICENSE
[crates-io]: https://crates.io/crates/konarr
[docs]: https://docs.rs/konarr/latest/konarr
[semver]: https://semver.org/

[konarr]: https://github.com/42ByteLabs/konarr
[github]: https://github.com/42ByteLabs/konarr-client
[github-issues]: https://github.com/42ByteLabs/konarr-client/issues

[vue]: https://vuejs.org/
[node]: https://nodejs.org/
[tailwind]: https://tailwindcss.com/
[mdi]: https://pictogrammers.com/library/mdi/
[heroicons]: https://heroicons.com/
[headlessui]: https://headlessui.com/v1/vue

