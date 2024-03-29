<p style="text-align: center">
  <i>sri sri guru gaurangau jayatah</i>
</p>

# Srila Gurudeva’s Archive Web App

## Architecture

The web app consists of the following components.

- [Frontend](frontend) hosted at Firebase Hosting.
- [Directus](https://directus.io/) as a headless CMS.
- [Algolia](https://www.algolia.com/doc/) as an external search provider.

See each of the README files linked above for component-specific descriptions.

## Contributing

Please read our [Contributing guidelines](CONTRIBUTING.md).

## Continuous Integration

CI/CD runs using GitHub Actions. The workflows are in [`.github/workflows`](.github/workflows) folder.

- The `pull-request-check-suite` workflow tests all the touched sub-projects in a pull request.
